const db = require('./db');
const climbSchema = require('./userClimb');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - birthday
 *         - email
 *         - password
 *         - hash
 *         - salt
 *         - is_guide
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         surname:
 *           type: string
 *           description: The user's surname.
 *         birthday:
 *           type: string
 *           format: date
 *           description: The user's birthday.
 *         bio:
 *           type: string
 *           default: ''
 *           description: The user's bio.
 *         email:
 *           type: string
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *         publicKey:
 *           type: string
 *           default: ''
 *           description: The user's public key for ETH account.
 *         hash:  
 *            type: string
 *            description: The user's hash.
 *         salt:
 *            type: string
 *            description: The user's salt.
 *         is_guide:
 *           type: boolean
 *           default: false
 *           description: Whether the user is a guide or not.
 *         climbs:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *             description: ObjectId referencing a climb in the 'Climb' collection.
 *         profile_picture:
 *           type: string
 *           default: 'public/images/pp/default-profile-picture.jpg'
 *           description: The user's profile picture.
 *       Authentication:
 *         type: object
 *         description: Authentication token of the user.
 *         properties:
 *           token:
 *           type: string
 *           description: JWT token
 *           example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZWRmNDhmOTUzOTViMTlhNjc1ODgiLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0MzUwNDA0MTgsImlhdCI6MTQzNDQzNTYxOH0.GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE
 *         required:
 *           - token
 */

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  birthday: Date,
  email: String,
  password: String,
  publicKey: {type: String, default: ''},
  profile_picture: {
    type: String,
    default: 'public/images/pp/default-profile-picture.jpg'
  },
  is_guide: {
    type: Boolean,
    default: false
  },
  climbs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userClimb' }],
  bio: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
});

// Create a Mongoose model
// Model names in singular, collection names in plural
const User = mongoose.model('user', userSchema, 'Users');

module.exports = User;