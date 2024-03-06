const UserClimb = require('../models/userClimb'); //import model
const UserModel = require('../models/user'); //import model
const AreaModel = require('../models/area'); //import model

function checkOrderNumber(area, orderNumber) {
    return area.routes.some(route => route.numberOrder === orderNumber);
}

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
 * /profile/{userId}/vzponi:
 *   post:
 *     summary: Create a new climb for a user.
 *     tags:
 *       - UserClimbs
 *     security:
 *       - jwt: []
 *     description: |
 *       This endpoint allows you to create a new climb for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user for whom the climb is being created.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               area:
 *                 type: string
 *               numberOrder:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Successful operation. The climb has been created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserClimb'
 *       '401':
 *         description: <b>Unauthorized</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               no token provided:
 *                 value:
 *                   message: "No authorization. token was found"
 *               user not found:
 *                 value:
 *                   message: "User not found."
 *       '400':
 *         description: Bad request. The request body is missing required fields or the route number does not exist in the area.
 *         content:
 *           application/json:
 *             example:
 *               message: "The route with this route number does not exists in this area"
 *       '404':
 *         description: Not found. Either the user or area, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const userClimbCreate = async (req, res) => {
    let route;
    try { //added catch for uncaught errors
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const area = await AreaModel.findById(req.body.area);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }

        if (req.params.userId !== req.auth.userId) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile." });
        }
        
        route = area.routes.find(route => route.numberOrder === req.body.numberOrder);
        if (!route) {
            return res.status(400).json({ message: 'The route with this route number does not exists in this area' });
         }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
    
    const newClimb = new UserClimb({
      name: req.body.name,
      grade: route.grade, // Use the grade from the route
      description: req.body.description,
      date: req.body.date,
      area: req.body.area,
      numberOrder: req.body.numberOrder
    });
  
    try {
        const climb = await newClimb.save();
        await UserModel.findByIdAndUpdate(req.params.userId, { $push: { climbs: climb._id } }, { new: true });        
        res.status(201).json(climb);
      } catch (err) {
        res.status(400).json(err);
    }
};

/**
 * @openapi
 * /profile/{userId}/vzponi/{climbId}:
 *   get:
 *     summary: Retrieve a specific climb for a user.
 *     tags:
 *       - UserClimbs
 *     description: |
 *       This endpoint allows you to retrieve a specific climb for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user for whom the climb is being retrieved.
 *         schema:
 *           type: string
 *       - in: path
 *         name: climbId
 *         required: true
 *         description: The ID of the climb to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. The climb has been retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserClimb'
 *       '404':
 *         description: Not found. Either the user or climb, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Climb with id 'climbId' not found"
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const userClimbReadOne = async (req, res) => {
    let response = { status: 200 };
    try {
        let climbInstance = await UserClimb.findById(req.params.climbId)
          .select("name grade description date area numberOrder"); // Select the fields you want to return

        if (!climbInstance) {
          response.status = 404;
          response.message = `Climb with id '${req.params.climbId}' not found`;
        } else {
            if (!climbInstance.name) {
                response.status = 404;
                response.message = "No name found.";
            } else {
                response.climbInstance = {
                    name: climbInstance.name,
                    grade: climbInstance.grade,
                    description: climbInstance.description,
                    date: climbInstance.date,
                    area: climbInstance.area,
                    numberOrder: climbInstance.numberOrder,
                };
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json(response);
};

/**
 * @openapi
 * /profile/{userId}/vzponi:
 *   get:
 *     summary: Retrieve all climbs for a user.
 *     tags:
 *       - UserClimbs
 *     description: |
 *       This endpoint allows you to retrieve all climbs for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user for whom the climbs are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. The climbs have been retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserClimb'
 *       '404':
 *         description: Not found. Either the user or climbs, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User with id 'userId' not found"
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const getAllClimbsForUser = async (req, res) => {
    let response = { status: 200 };
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            let climbs = await UserClimb.find({ '_id': { $in: user.climbs } })
              .select("name grade description date area numberOrder"); // Select the fields you want to return

            if (!climbs.length) {
              response.status = 404;
              response.message = 'No climbs found for this user';
            } else {
              response.climbs = climbs;
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json(response);
};


//THIS IS NOT USED
const userClimbUpdateOne = async (req, res) => {
    let response = { status: 200 };
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            let climb = await UserClimb.findOneAndUpdate(
                { '_id': req.params.climbId, '_id': { $in: user.climbs } },
                req.body,
                { new: true }
            ).select("name grade description date area numberOrder");

            if (!climb) {
                response.status = 404;
                response.message = `Climb with id '${req.params.climbId}' not found for this user`;
            } else {
                response.climb = climb;
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json(response);
};

/**
 * @openapi
 * /profile/{userId}/vzponi/{climbId}:
 *   delete:
 *     summary: Delete a specific climb for a user.
 *     tags:
 *       - UserClimbs
 *     security:
 *       - jwt: []
 *     description: 
 *       This endpoint allows you to delete a specific climb for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user for whom the climb is being deleted.
 *         schema:
 *           type: string
 *       - in: path
 *         name: climbId
 *         required: true
 *         description: The ID of the climb to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. The climb has been deleted.
 *         content:
 *           application/json:
 *             example:
 *               message: "Climb deleted successfully"
 *       '404':
 *         description: Not found. Either the user or climb, or both were not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Climb with id 'climbId' not found for this user"
 *       '500':
 *         description: Internal server error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error."
 */
const userClimbDeleteOne = async (req, res) => {
    let response = { status: 200 };
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            // Check if req.params.userId and req.auth.userId match
            if (req.params.userId !== req.auth.userId) {
                response.status = 401;
                response.message = "Unauthorized: You can only delete your own climbs.";
                return res.status(response.status).json(response);
            }

            //Deletes the found climb
            let climb = await UserClimb.findOneAndDelete({
                $and: [
                  { '_id': req.params.climbId },
                  { '_id': { $in: user.climbs } }
                ]
              });
            if (!climb) {
                response.status = 404;
                response.message = `Climb with id '${req.params.climbId}' not found for this user`;
            } else {
                // Remove the climb ID from the user's climbs array
                user.climbs = user.climbs.filter(id => id.toString() !== req.params.climbId);
                await user.save();
                response.message = 'Climb deleted successfully';
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json(response);
};

module.exports = {
    userClimbCreate,
    userClimbReadOne,
    getAllClimbsForUser,
    userClimbUpdateOne,
    userClimbDeleteOne
};