const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Event = require('../models/event');
const Area = require('../models/area');
const User = require('../models/user');

/**
 * @openapi
 * /events/{eventId}:
 *   get:
 *     summary: Retrieve details of a specific event
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved event details
 *         content:
 *           application/json:
 *             example:
 *               event:
 *                 nameOfAuthor: John Doe
 *                 image: public/images/climb.jpg
 *                 description: Exciting climbing event
 *                 date: 2023-12-10T12:00:00.000Z
 *                 area: 5fc9a618ab6e8e15a1c8e2ab
 *                 price: 6a
 *                 maxParticipants: 5
 *                 currentNumParticipants: 2
 *                 participants: [5fc9a618ab6e8e15a1c8e2ac, 5fc9a618ab6e8e15a1c8e2ad]
 *               status: OK
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
const eventReadOne = async (req, res) => {
    const { eventId } = req.params;
    if (!eventId)
      res
        .status(400)
        .json({ message: "Path parameter 'eventId' is required." });
    else {
      try {
        let event = await Event.findById(eventId)
          .exec();
        if (!event){
            res.status(404).json({
            message: `event with id '${req.params.eventId}' not found`,
            });
        } else {
            res.status(200).json({
                event: {
                    id: event.id,
                    name: event.name,
                    author: event.author,
                    image: event.image,
                    description: event.description,
                    date: event.date,
                    area: event.area,
                    price: event.price,
                    maxParticipants: event.maxParticipants,
                    currentNumParticipants: event.currentNumParticipants,
                    participants: event.participants,
                },
                status: "OK"
              });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
};



/**
 * @openapi
 * /events:
 *   get:
 *     summary: Retrieve a list of events
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to retrieve (default is 10)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved list of events
 *         content:
 *           application/json:
 *             example:
 *               events:
 *                 - nameOfAuthor: John Doe
 *                   image: public/images/climb.jpg
 *                   description: Exciting climbing event
 *                   date: 2023-12-10T12:00:00.000Z
 *                   area: 5fc9a618ab6e8e15a1c8e2ab
 *                   price: 6a
 *                   maxParticipants: 5
 *                   currentNumParticipants: 2
 *                   participants: [5fc9a618ab6e8e15a1c8e2ac, 5fc9a618ab6e8e15a1c8e2ad]
 *               status: OK
 *       404:
 *         description: No events found
 *       500:
 *         description: Internal Server Error
 */
const getAllEvents = async (req, res) => {
    let nResults = parseInt(req.query.nResults);
    nResults = isNaN(nResults) ? 10 : nResults;
    try {
        let events = await Event.aggregate([
            //the most "popular" events are shown first
            { $sort: {currentParticipants: -1}},
            { $limit: nResults },
          ]);
        console.log(events); // Log the result of the database query
        if (!events || events.length == 0) {
          res.status(404).json({ message: "No events found." });
          return;
        }
        res.status(200).json({ events, status: "OK" });

    } catch (err) {
        console.error(err); // Log any errors that occur
        res.status(500).json({ message: err.message });
    }
};

/**
 * @openapi
 * /event/{userId}:
 *   post:
 *     summary: Create a new event
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the author/user
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *           example:
 *             name: Exciting climbing event
 *             image: public/images/climb.jpg
 *             description: This is a description of the event
 *             date: 2023-12-10T12:00:00.000Z
 *             area: 5fc9a618ab6e8e15a1c8e2ab
 *             price: 100
 *             maxParticipants: 5
 *             currentNumParticipants: 0
 *             participants: [5fc9a618ab6e8e15a1c8e2ab]
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User, Area, or Route not found
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - jwt: []
 */
const eventCreate = async (req, res) => {

    try {
        if (req.params.userId !== req.auth.userId) {
            return res.status(401).json({ message: "Unautorized: You can only delete your own profile." });
        }

        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });

        }else if(!user.is_guide){
            return res.status(400).json({ message: 'User MUST be a guide to create event' });
        }
        
        const area = await Area.findById(req.body.area);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }
        
        // const route = area.routes.find(route => route.numberOrder === req.body.numberOrder);
        // if (!route) {
        //     return res.status(400).json({ message: 'The route with this route number does not exists in this area' });
        // }
        if (!req.body.name || !req.body.description){
            return res.status(400).json({ message: 'Name and Description are necessary and are not present' });
        }
        const stringId = req.body._id;
        const objectId = new ObjectId(stringId);
        //console.log("objesssssssssssssssssssssssssssssssssssss", objectId)

        const newEvent = new Event({
        _id: objectId,
        name: req.body.name,
        author: user,
        nameOfAuthor: req.body.nameOfAuthor,
        image: req.body.image,
        description: req.body.description,
        date: req.body.date,
        area: area,
        price: req.body.price, // Use the price from the route
        maxParticipants: req.body.maxParticipants,
        });
    
        try {
            const event = await newEvent.save();
            res.status(201).json(event);
        } catch (err) {
            res.status(400).json(err);
        }

    } catch (err) {
        console.error(err); // Log any errors that occur
        res.status(500).json({ message: err.message });
    }
};


/**
 * @openapi
 * /event/{eventId}/users/{userId}:
 *   put:
 *     summary: Update details of a specific event by the author
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the author/user
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nameOfAuthor: Updated Author
 *             description: Updated description
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Bad Request or Unauthorized
 *       404:
 *         description: User or Event not found
 *       500:
 *         description: Internal Server Error
 */
const eventUpdateOne = async (req, res) => {
    let response = { status: 200 };
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            let event = await Event.findById(req.params.eventId).exec();

            if (!event) {
                response.status = 404;
                response.message = `Event with id '${req.params.eventId}' not found for this user`;
            } else if(event.author._id !== req.params.userId){
                response.status = 401;
                response.message = `Event can not be changed by user '${req.params.userId}'`;
            } else{
                const updatedEvent = await Event.findOneAndUpdate(
                    { _id: req.params.eventId },
                    req.body,
                    //enables Mongoose validators, so it will validate the data 
                    //against your schema
                    { new: true, runValidators: true }
                ).exec();
                  
                response.event = updatedEvent;
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
 * /events/{eventId}/users/{userId}:
 *   post:
 *     summary: Sign up a user for a specific event
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to sign up for
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user signing up
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User, Event not found or Event Full
 *       500:
 *         description: Internal Server Error
 */
const signupToEvent = async (req, res) =>{
    let response = { status: 200 };
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            let event = await Event.findById(req.params.eventId).exec();

            if (!event) {
                response.status = 404;
                response.message = `Event with id '${req.params.eventId}' not found for this user`;
            } else if (event.maxParticipants == event.currentParticipants){
                response.status = 400;
                response.message = `Event with id '${req.params.eventId}' is full`;
            }else if (event.participants.
                some(user => user._id === req.params.userId)){
                response.status = 400;
                response.message = `User with id '${req.params.userId}' is already in this '${req.params.eventId}' event`;
            }else{
                const updatedEvent = await Event.findOneAndUpdate(
                    { _id: req.params.eventId },
                    {
                        $set: {
                            currentNumParticipants: event.currentNumParticipants + 1,
                            //participants: event.participants.push(user)
                        },
                        $push:{
                            participants: req.params.userId,
                        }
                    },
                    //enables Mongoose validators, so it will validate the data 
                    //against your schema
                    { new: true, runValidators: true }
                ).exec();
                  
                response.event = updatedEvent;
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json(response);
}


/**
 * @openapi
 * /event/{eventId}/{userId}:
 *   delete:
 *     summary: Delete a specific event by the author
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the author/user
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or Event not found
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - jwt: []
 */
const eventDeleteOne = async (req, res) => {
    let response = { status: 204 };
    try {
        if (req.params.userId !== req.auth.userId) {
            return res.status(401).json({ message: "Unautorized: You can only delete your own events." });
        }
        const user = await User.findById(req.params.userId);
        //console.log("printing out user",user);

        if (!user) {
            response.status = 404;
            response.message = `User with id '${req.params.userId}' not found`;
        } else {
            const event = await Event.findById(req.params.eventId);
            //console.log(event);
            if (!event) {
                response.status = 404;
                response.message = `Event with id '${req.params.eventId}' not found`;
            }else if(event.author.toString() !== req.params.userId){//myb not _id
                response.status = 401;
                response.message = `Event can not be deleted by user '${req.params.userId}'`;
            }  else {
                await Event.deleteOne({_id: req.params.eventId})
                response.message = 'Event deleted successfully';
            }
        }
    } catch (err) {
        response.status = 500;
        response.message = err.message;
    }
    res.status(response.status).json({ message: response.message });
};

/**
 * @openapi
 * /event/{eventId}/removeUser/{userToBeRemovedId}/{userRequestingTheRemoval}:
 *   put:
 *     summary: Remove a user from the participants of a specific event
 *     tags: 
 *      - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to remove the user from
 *         schema:
 *           type: string
 *       - in: path
 *         name: userToBeRemovedId
 *         required: true
 *         description: ID of the user to be removed
 *         schema:
 *           type: string
 *       - in: path
 *         name: userRequestingTheRemoval
 *         required: true
 *         description: ID of the user who want the removal
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: User not authorized to remove the specified user from the event
 *       404:
 *         description: User, Event, or Author not found
 *       500:
 *         description: Internal Server Error
 */
const removeUserFromEvent = async (req, res) => {
    let response = { status: 200 };
    try {
      const user = await User.findById(req.params.userToBeRemovedId);
      if (!user) {
        response.status = 404;
        response.message = `User with id '${req.params.userToBeRemovedId}' not found`;
      } else {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
          response.status = 404;
          response.message = `Event with id '${req.params.eventId}' not found`;
        } else if (event.author.toString() !== req.params.userRequestingTheRemoval &&
                   req.params.userRequestingTheRemoval !== req.params.userToBeRemovedId){
            response.status = 401;
            response.message = `User '${req.params.userToBeRemovedId}' can not be deleted from event by user '${req.params.userRequestingTheRemoval}'`;
        }else {  
          event.participants = event.participants.filter(participant => participant.toString() !== req.params.userToBeRemovedId);
          event.currentNumParticipants = Math.max(0, event.currentNumParticipants - 1);
          const updatedEvent = await event.save();
          response.event = updatedEvent;
        }
      }
    } catch (err) {
      response.status = 500;
      response.message = err.message;
    }
    res.status(response.status).json(response);
  };
  




module.exports = {
    eventReadOne,
    getAllEvents,
    eventCreate,
    eventUpdateOne,
    eventDeleteOne,
    signupToEvent,
    removeUserFromEvent
};