//--------------------------------PREVOD--------------------------------
// AREA = PLEZALISCE
// ROUTE = PLEZALNA SMER

const db = require('./db');
const mongoose = require('mongoose');

// Comment
/**
 * @openapi
 * components:
 *  schemas:
 *   Comment:
 *    type: object
 *    description: Comment about climbing area location.
 *    properties:
 *     comment:
 *      type: object
 *      description: The comment object
 *      properties:
 *       author:
 *        type: string
 *        description: <b>name of the author</b> of the comment
 *        example: Jakob Lavrič
 *       rating:
 *        type: integer
 *        description: <b>rating</b> of the location
 *        minimum: 0
 *        maximum: 5
 *        example: 5
 *       comment:
 *        type: string
 *        description: <b>comment</b> about the location
 *        example: Interesting area with a few climbers.
 *      required:
 *       - author
 *       - rating
 *       - comment
 */
const commentSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId, 
    author: { type: String, required: [true, "Author is required!"] },
    rating: {
        type: Number,
        required: [true, "Rating is required!"],
        min: 0,
        max: 5,
    },
    comment: { type: String, required: [true, "Comment is required!"] },
    createdOn: { type: Date, default: Date.now },
});
// Route
/**
 * @openapi
 * components:
 *   schemas:
 *     Route:
 *       type: object
 *       required:
 *         - numberOrder
 *         - name
 *         - height
 *         - grade
 *       properties:
 *         numberOrder:
 *           type: number
 *           description: The number of the climbing route.
 *         name:
 *           type: string
 *           description: The name of the climbing route.
 *         height:
 *           type: number
 *           description: The height of the climbing route.
 *         grade:
 *           type: string
 *           description: The grade of the climbing route.
 */
const routeSchema = new mongoose.Schema({
    numberOrder: { type: Number, required: [true, "Number order is required!"] },
    name: { type: String, required: [true, "Name is required!"] },
    height: { type: Number, required: [true, "Height is required!"] },
    grade: { type: String, required: [true, "Grade is required!"] },
});
// Area 
/**
 * @openapi
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - best_period
 *         - characteristics
 *         - image
 *         - coordinates
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the climbing area.
 *         description:
 *           type: string
 *           description: The description of the climbing area.
 *         best_period:
 *           type: string
 *           description: The best period to visit the climbing area.
 *         characteristics:
 *           type: string
 *           description: The characteristics of the climbing area.
 *         image:
 *           type: string
 *           description: The image filename or path of the climbing area.
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: Geographic coordinates of the climbing area in the format [longitude, latitude].
 *         rating:
 *           type: number
 *           default: 0
 *           minimum: 0
 *           maximum: 5
 *           description: The overall rating of the climbing area (auto-calculated).
 *         routes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Route'
 *           description: List of climbing routes in the area.
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: List of comments related to the climbing area.           
 */
const areaSchema = new mongoose.Schema({
    // MUST change openAPI comment if CHANGES are applied to areaSchema

    /* // _id is automatically generated
    id: {
        type: Number,
        required: [true, "Unique identifier is required!"],
    },
    */
    name: { type: String, required: [true, "Name is required!"] },
    description: {
        type: String,
        required: [true, "Description is required!"],
    },
    best_period: {
        type: String,
        required: [true, "Best period is required!"],
    },
    characteristics: {
        type: String,
        required: [true, "Characteristics is required!"],
    },
    image: { 
        type: String, 
        required: [true, "Image filename or path is required!"] 
    },
    coordinates: {
        type: [Number],
        validate: {
          validator: (v) => Array.isArray(v) && v.length == 2,
          message: "Coordinates must be an array of two numbers!",
        },
        index: "2dsphere",
    },
    //Is calcuated automatically
    rating: { type: Number, default: 0, min: 0, max: 5 },
    routes: {
        type: [routeSchema]
    },
    comments: {
        type: [commentSchema],
    }
});
// Model names in singular, collection names in plural
module.exports = mongoose.model("AreaModel", areaSchema, "Areas");