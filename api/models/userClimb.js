//user climb schema
const db = require('./db');
const areaSchema = require('./area.js');
const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     UserClimb:
 *       type: object
 *       required:
 *         - name
 *         - grade
 *         - date
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user climb.
 *         grade:
 *           type: string
 *           description: The grade of the user climb.
 *         description:
 *           type: string
 *           description: The description of the user climb.
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the user climb.
 */
const climbSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  description: String,
  date: { type: Date, default: Date.now, required: [true, "Date is required!"] },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'area' },
  //determines the specific route via the number
  //the correct numbers must be enforced inside the controller functions
  numberOrder: { type: Number, required: [true, "Number order is required!"] },
  //is pulled from the route database
  grade: { type: String, required: [true, "Grade is required!"] }
});

const UserClimb = mongoose.model('userClimb', climbSchema, 'UserClimbs');

module.exports = UserClimb