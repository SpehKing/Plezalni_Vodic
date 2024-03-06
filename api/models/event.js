const db = require('./db');
const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *       properties:
 *         author:
 *           type: string
 *           format: objectId
 *           description: The author (reference to 'user' model).
 *         name:
 *           type: string
 *           description: The name of the event. Required.
 *         image:
 *           type: string
 *           description: The image URL for the event. Defaults to 'public/images/climb.jpg'.
 *         description:
 *           type: string
 *           description: The description of the event. Required.
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the event. Defaults to the current date and time. Required.
 *         area:
 *           type: string
 *           description: The ID of the area (reference to 'area' model).
 *         price:
 *           type: integer
 *           format: int32
 *           description: The price of the event. Required.
 *         maxParticipants:
 *           type: integer
 *           format: int32
 *           default: 5
 *           minimum: 1
 *           description: The maximum number of participants allowed. Defaults to 5.
 *         currentNumParticipants:
 *           type: integer
 *           format: int32
 *           default: 0
 *           description: The current number of participants. Constantly updated.
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: An array of participant referencing a user in the 'User' collection.
 */
const eventSchema = new mongoose.Schema({
    // MUST CHANGE openAPI comment if CHANGES are made to userSchema
    _id: { type: mongoose.Schema.Types.ObjectId, ref: '_id', required: [true, "Id is required!"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: [true, "Author is required!"] },
    name: { type: String, required: [true, "Name of event is required!"] },
    image: {type: String, default: 'public/images/climb.jpg' },
    description: { type: String, required: [true, "Description of event is required!"] },
    date: { type: String, default: Date.now, required: [true, "Date of event is required!"] },
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'area' },
    price: { type: Number, required: [true, "Price is required!"] },
    maxParticipants: {type: Number, default: 5, min: 1},
    currentNumParticipants: {type: Number, default: 0}, //is constantly updated
    participants: [{ type: String, ref: 'user' }]
});

const Event = mongoose.model('event', eventSchema, 'Events');

module.exports = Event;