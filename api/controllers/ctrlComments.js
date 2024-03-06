const mongoose = require('mongoose');
const AreaModel = require('../models/area'); //import model
const User = require("../models/user");

const getAuthor = async (req, res, cbResult) => {
  if (req.auth?.email) {
    try {
      let user = await User.findOne({ email: req.auth.email }).exec();
      if (!user) res.status(401).json({ message: "User not found." });
      else cbResult(req, res, user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
/**
 * @openapi
 * /plezalisce/{areaId}/comments:
 *   post:
 *     summary: Create a new comment for a specific area.
 *     tags:
 *       - Comments
 *     security:
 *       - jwt: []
 *     description: |
 *       This endpoint allows you to create a new comment for a specific area.
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         description: The ID of the area for which the comment is being added.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: object
 *                 properties:
 *                   author:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *     responses:
 *       '201':
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: "commentId"
 *               author: "John Doe"
 *               rating: 5
 *               comment: "This is a great place!"
 *       '400':
 *         description: Body parameters 'author', 'rating' and 'comment' are required.
 *         content:
 *           application/json:
 *             example:
 *               message: "Path parameter 'areaId' is required."
 *       '404':
 *         description: Not found. The specified area does not exist.
 *         content:
 *           application/json:
 *             example:
 *               message: "Area with id 'areaId' not found."
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 *       '401':
 *         description: Unauthorized, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               no token provided:
 *                 value:
 *                   message: No authorization token was found.
 *               user not found:
 *                 value:
 *                   message: User not found.
 */
const commentsCreate = async (req, res) => {
  getAuthor(req, res, async (req, res, author) => {
    const areaId = req.params.areaId;
    if (!areaId) {
      res.status(400).json({ message: "Path parameter 'areaId' is required." });
    } else {
      try {
        let area = await AreaModel.findById(areaId).select("comments").exec();
        doAddComment(req, res, area, author.name);
      } catch (err) {
        //TODO USE ErrorHandler from ~/middleware
        res.status(500).json({ message: err.message });
      }
    }
  });
};

const doAddComment = async (req, res, area, author) => {
  if (!area)
    res.status(404).json({
      message: `Area with id '${req.params.areaId}' not found.`,
    });
  else if (!req.body.comment.rating || !req.body.comment.comment) {
    res.status(400).json({
      message: "Body parameters 'author', 'rating' and 'comment' are required.",
    });
  } else {
    area.comments.push({
      author: req.body.comment.author,
      rating: req.body.comment.rating,
      comment: req.body.comment.comment,
      createdOn: req.body.comment.createdOn,
    });
    try {
      await area.save();

      await updateAverageRating(area._id);

      res.status(201).json(area.comments.slice(-1).pop());
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const updateAverageRating = async (areaId) => {
  try {
    let area = await AreaModel.findById(areaId)
      .select("rating comments")
      .exec();

    await doSetAverageRating(area);
  } catch (err) {}
};

const doSetAverageRating = async (area) => {
  if (!area.comments || area.comments.length == 0) area.rating = 0;
  else {
    const count = area.comments.length;
    const total = area.comments.reduce((acc, { rating }) => {
      return acc + rating;
    }, 0);
    area.rating = parseInt(total / count, 10);
  }
  try {
    await area.save();
    //EventLog from middleware takes care of this
    console.log(`Average rating updated to ${area.rating}.`);
  } catch (err) {
    console.log(err);
  }
};

/**
 * @openapi
 * /plezalisce/{areaId}/comments/{commentId}:
 *   get:
 *     summary: Get details of a specific comment in an area.
 *     tags:
 *       - Comments
 *     description: |
 *       This endpoint allows you to retrieve details of a specific comment within a given area.
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         description: The ID of the area containing the comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             example:
 *               areaInstance:
 *                 _id: "areaId"
 *                 name: "Plezalnica ob Soci"
 *               comment:
 *                 _id: "commentId"
 *                 text: "Zelo lepo."
 *               status: "OK"
 *       '404':
 *         description: Not found. Either the area, comment, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Area with id 'areaId' not found."
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const commentsReadOne = async (req, res) => {
  try {
    let areaInstance = await Area.findById(req.params.areaId)
      .select("name comments")
      //.populate('comments')
      .exec();
    console.log(req.params.commentId);
    if (!areaInstance)
      res.status(404).json({
        message: `area with id '${req.params.areaId}' not found`,
      });
    else if (!areaInstance.comments || areaInstance.comments.length == 0)
      res.status(404).json({ message: "No comments found." });
    else {
      let comment = areaInstance.comments.id(req.params.commentId);
      if (!comment)
        res.status(404).json({
          message: `Comment with id '${req.params.commentId}' not found.`,
        });
      else {
        res.status(200).json({
          areaInstance: {
            _id: req.params.areaId,
            name: areaInstance.name,
          },
          comment,
          status: "OK",
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//NE UPORABLJAMO
const commentsUpdateOne = async (req, res) => {
  if (!req.params.areaId || !req.params.commentId)
    res.status(400).json({
      message: "Path parameters 'areaId' and 'commentId' are required.",
    });
  else {
    try {
      let area = await Area.findById(req.params.areaId)
        .select("comments")
        .exec();
      if (!area)
        res.status(404).json({
          message: `Area with id '${req.params.areaId}' not found.`,
        });
      else {
        const comment = area.comments.id(req.params.commentId);
        if (!comment)
          res.status(404).json({
            message:
              "Comment with id '" + req.params.commentId + "' not found.",
          });
        getAuthor(req, res, async (req, res, author) => {
          if (comment.author != author.name) {
            res.status(403).json({
              message: "Not authorized to update this comment.",
            });
          } else if (!req.body.rating && !req.body.comment) {
            res.status(400).json({
              message:
                "At least one parameter 'rating' or 'comment' is required.",
            });
          } else {
            if (req.body.rating) comment.rating = req.body.rating;
            if (req.body.comment) comment.comment = req.body.comment;
            await area.save();
            await updateAverageRating(area._id);
            res.status(200).json(comment);
          }
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 * /plezalisce/{areaId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a specific comment in an area.
 *     tags:
 *       - Comments
 *     security:
 *       - jwt: []
 *     description: |
 *       This endpoint allows you to delete a specific comment within a given area.
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         description: The ID of the area containing the comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Successful operation. The comment has been deleted.
 *       '400':
 *         description: Bad request. Path parameters 'areaId' and 'commentId' are required.
 *         content:
 *           application/json:
 *             example:
 *               message: "Path parameters 'areaId' and 'commentId' are required."
 *       '401':
 *         description: Unauthorized, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               no token provided:
 *                 value:
 *                   message: No authorization token was found.
 *               user not found:
 *                 value:
 *                   message: User not found.
 *               malformed token:
 *                 value:
 *                   message: jwt malformed
 *               invalid token signature:
 *                 value:
 *                   message: invalid signature
 *       '403':
 *         description: Forbidden, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Not authorized to delete this comment.
 *       '404':
 *         description: Not found. Either the area, comment, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Area with id 'areaId' not found."
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const commentsDeleteOne = async (req, res) => {
  const { areaId, commentId } = req.params;
  if (!areaId || !commentId) {
    console.log("commentsDeleteOne: 400");
    res.status(400).json({
      message: "Path parameters 'areaId' and 'commentId' are required.",
    });
  } else {
    try {
      let area = await AreaModel.findById(areaId).select("comments").exec();
      if (!area) {
        res.status(404).json({
          message: `Area with id '${areaId}' not found.`,
        });
      } else if (area.comments && area.comments.length > 0) {
        const comment = area.comments.id(commentId);
        if (!comment) {
          res.status(404).json({
            message: `Comment with id '${commentId}' not found.`,
          });
        } else {
          getAuthor(req, res, async (req, res, author) => {
            if (res.body && res.body.comment && res.body.comment.author != author.name) {
              res.status(403).json({
                message: "Not authorized to delete this comment.",
              });
            } else {
              area.comments.pull(commentId);
              await area.save();
              await updateAverageRating(area._id);
              res.status(204).send();
            }
          });
        }
      } else {
        res.status(404).json({ message: "No comments found." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};


module.exports = {
  commentsCreate,
  commentsReadOne,
  commentsUpdateOne,
  commentsDeleteOne,
};