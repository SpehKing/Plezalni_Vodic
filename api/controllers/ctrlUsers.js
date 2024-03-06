require('dotenv').config();
const User = require('../models/user'); //import model
const userClimb = require('../models/userClimb'); //import model
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');






/**
 * @openapi
 * /login:
 *   post:
 *     summary: Confirm User Sign-In
 *     tags:
 *       - Users
 *     description: |
 *       Handles the confirmation of user sign-in.
 *
 *       This endpoint expects a JSON payload with the user's email and password for authentication.
 *
 *       Responses:
 *       - 200: Successful sign-in with a JSON object containing a success message and user information.
 *       - 401: Invalid email or password.
 *       - 500: Internal Server Error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       '200':
 *         description: Successful sign-in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User signed in successfully!
 *                 user:
 *                   type: object
 *                   description: User information.
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Invalid email or password.
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal Server Error.
 */
const confirmSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email: email });

    if (!user) {
      // No user found with the provided email
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    console.log(user.isVerified)

    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email is not verified. Please verify your email before signing in.' });
    }

    // User found, now compare the passwords
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Passwords don't match
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Passwords match, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, is_guide: user.is_guide },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
      message: 'User signed in successfully!',
      user: user,
      token: token,
    });

  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

/**
 * @openapi
 * paths:
 *   /profile/{userId}:
 *     get:
 *       summary: Get user details by ID
 *       tags:
 *       - Users
 *       description: Retrieves user details based on the provided user ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user.
 *       responses:
 *         '200':
 *           description: Successful response with user details.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   userInstance:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                       surname:
 *                         type: string
 *                         description: The user's surname.
 *                       birthday:
 *                         type: string
 *                         format: date
 *                         description: The user's birthday.
 *                       publicKey:
 *                         type: string
 *                         description: The user's public key for ETH account.
 *                       email:
 *                         type: string
 *                         description: The user's email address.
 *                       climbs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           description: Details of climbs associated with the user.
 *                       status:
 *                         type: string
 *                         description: Status of the response (e.g., "OK").
 *         '404':
 *           description: User not found or missing information.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the error (e.g., "User with id '123' not found").
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the internal server error.
 */
const userReadOne = async (req, res) => {
  try {
    let userInstance = await User.findById(req.params.userId)
      .select("name surname birthday email profile_picture is_guide climbs bio publicKey")
      .populate('climbs')
      .exec();
    console.log(req.params.userId);
    if (!userInstance)
      res.status(404).json({
        message: `User with id '${req.params.userId}' not found`,
      });
    else if (!userInstance.name)
      res.status(404).json({ message: "No name found." });
    else {
      res.status(200).json({
        userInstance: {
          _id: userInstance._id,
          name: userInstance.name,
          surname: userInstance.surname,
          birthday: userInstance.birthday,
          email: userInstance.email,
          profile_picture: userInstance.profile_picture,
          publicKey: userInstance.publicKey,
          is_guide: userInstance.is_guide,  //Only method that serves is_guide
          climbs: userInstance.climbs,
          bio: userInstance.bio
        },
        status: "OK"
      });

    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users with an optional limit.
 *     parameters:
 *       - in: query
 *         name: nResults
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *         description: Number of results to retrieve (default is 10).
 *     responses:
 *       '200':
 *         description: A list of users and the status.
 *         content:
 *           application/json:
 *             example:
 *               users:
 *                 - id: 1
 *                   name: John
 *                   surname: Doe
 *                   birthday: 1990-01-01
 *                   email: john.doe@example.com
 *                   password: hashedPassword
 *                   publicKey: ''
 *                   profile_picture: 'public/images/pp/default-profile-picture.jpg'
 *                   is_guide: false
 *                   climbs: []
 *                   bio: ''
 *                   isVerified: true
 *                   verificationCode: abc123
 *               status: OK
 *       '404':
 *         description: No users found.
 *         content:
 *           application/json:
 *             example:
 *               message: No users found.
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: An internal server error occurred.
 *
 */
const userReadAll = async (req, res) => {
  let nResults = parseInt(req.query.nResults);
  nResults = isNaN(nResults) ? 100 : nResults;
  try {
    let users = await User.find({}).limit(nResults);

    if (users.length === 0)
      res.status(404).json({ message: "No users found." });
    else {
      res.status(200).json({users, status: "OK"});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/**
 * @openapi
 * paths:
 *   /signup:
 *     post:
 *       summary: Register a new user
 *       tags:
 *       - Users
 *       description: Registers a new user by saving their information to the database.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signupName:
 *                   type: string
 *                   description: The name of the user to be registered.
 *                 signupSurname:
 *                   type: string
 *                   description: The surname of the user to be registered.
 *                 signupBirthday:
 *                   type: string
 *                   format: date
 *                   description: The birthday of the user to be registered.
 *                 signupEmail:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user to be registered.
 *                 signupPassword:
 *                   type: string
 *                   format: password
 *                   description: The password of the user to be registered.
 *                 signupPublicKey:
 *                   type: string
 *                   description: The publicKey for ETH account of the user to be registered.
 *       responses:
 *         '200':
 *           description: User registered successfully.
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 description: Success message.
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 description: Details about the internal server error.
 */
const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If email exists, respond with an error message
      return res.status(400).json({ error: 'Email already exists. Please choose a different email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Generate a unique verification code
    const verificationCode = generateVerificationCode();

    const userData = {
      name: req.body.name,
      surname: req.body.surname,
      birthday: req.body.birthday,
      email: req.body.email,
      password: hashedPassword,
      publicKey: req.body.publicKey,
      verificationCode,
    };

    // Create a new user and save it to the database
    const user = new User(userData);
    await user.save();

    //console.log("e" + userData.email)
    // Send a verification email
    await sendVerificationEmail(user.email, verificationCode);

    // Respond with a success message or redirect to another page
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


/**
 * @openapi
 * paths:
 *   /profile/{userId}:
 *     put:
 *       summary: Update user details by ID
 *       tags:
 *       - Users
 *       description: Updates user details based on the provided user ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The updated name of the user.
 *                 surname:
 *                   type: string
 *                   description: The updated surname of the user.
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   description: The updated birthday of the user.
 *                 bio:
 *                   type: string
 *                   description: The updated bio of the user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The updated email address of the user.
 *                 climbs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Details of the updated climbs associated with the user.
 *       responses:
 *         '200':
 *           description: User details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '400':
 *           description: Bad Request. Missing required parameters.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the bad request.
 *         '401':
 *           description: Unauthorized. User not authorized to update the specified user.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the unauthorized request.
 *         '404':
 *           description: User not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the user not found.
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the internal server error.
 *       security:
 *         - jwt: []
 */
const updateUser = async (req, res) => {
  if (req.params.userId !== req.auth.userId) {
    return res.status(401).json({ message: "Forbidden: You can only update your own profile." });
  }
  if (!req.params.userId)
    res.status(400).json({
      message: "Path parameter 'userId' is required.",
    });
  else {
    try {
      let user = await User.findById(req.params.userId)
        .exec();
      if (!user)
        res.status(404).json({
          message: `user with id '${req.params.userId}' not found.`,
        });
      else {
        if (!req.body.name && !req.body.surname && !req.body.birthday
          && !req.body.email && !req.body.climbs) {
          res.status(400).json({
            message:
              "At least one parameter 'name' or 'surname' or 'birthday'" +
              "or 'email' or 'climbs' is required.",
          });
        } else {
            if (req.body.name) user.name = req.body.name;
            if (req.body.surname) user.surname = req.body.surname;
            if (req.body.birthday) user.birthday = req.body.birthday;
            if (req.body.email) user.email = req.body.email;
            if (req.body.profile_picture) user.profile_picture = req.body.profile_picture;
            if (req.body.bio) user.bio = req.body.bio;
            if (req.body.publicKey) user.publicKey = req.body.publicKey;
            //climbs can be edited seperately
            //if (req.body.climbs) user.climbs = req.body.climbs;
            await user.save();
            res.status(200).json(user);
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 * paths:
 *   /profile/{userId}:
 *     delete:
 *       summary: Delete a user by ID
 *       tags:
 *       - Users
 *       description: Deletes a user based on the provided user ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user to be deleted.
 *       responses:
 *         '204':
 *           description: User deleted successfully.
 *         '400':
 *           description: Bad Request. Missing required parameters.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the bad request.
 *         '401':
 *           description: Unauthorized. User not authorized to delete the specified user.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the unauthorized request.
 *         '404':
 *           description: Not Found. User not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the not found error.
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Details about the internal server error.
 *       security:
 *         - jwt: []
 */
const deleteUser = async (req, res) => {
  if (!req.params.userId) {
    return res.status(400).json({
      message: "Path parameter 'userId' is required.",
    });
  }

  // Check if req.params.userId and req.auth.userId match
  if (req.params.userId !== req.auth.userId) {
    return res.status(401).json({ message: "Forbidden: You can only delete your own profile." });
  }

  try {
    let user = await User.findById(req.params.userId).exec();
    if (!user) {
      return res.status(404).json({
        message: `User with id '${req.params.userId}' not found.`,
      });
    }

    // Use await to ensure the deletion is complete before responding
    await user.deleteOne();

    // Respond with a 204 No Content status
    res.status(204).send();
    // Alternatively, if you want to include a response body, you can do:
    // res.status(204).json({ status: "OK" });
  } catch (error) {
    // Handle any errors that might occur during the deletion
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Function to generate a random 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send a verification email
async function sendVerificationEmail(email, code) {
  console.log(email + " " + code)
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href="http://localhost:3000/api/verify?email=${email}&code=${code}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Set up nodemailer for sending emails (replace 'your_email' and 'your_email_password' with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

// Set up email verification endpoint

const verify = async (req, res) => {
  const { email, code } = req.query;
  console.log(req.query);

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }


    // Update user status to indicate email is verified
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    return res.redirect('http://localhost:4200/email-verification');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to send a password reset email
async function sendPasswordResetEmail(email, resetCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="http://localhost:3000/api/reset-password?email=${email}&code=${resetCode}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}

// Password reset endpoint
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate a unique reset code
    const resetCode = generateVerificationCode();

    // Save the reset code in the database
    user.verificationCode = resetCode;
    await user.save();

    // Send a password reset email
    await sendPasswordResetEmail(email, resetCode);

    return res.json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Route for resetting the password after clicking the link
const resetPasswordAfterClick = async (req, res) => {
  const { email, code } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the reset code matches
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid reset code.' });
    }



    // Clear the reset code in the database after use, if needed
    //user.verificationCode = null;
    await user.save();
    // Redirect to the Angular password reset component with email and code as query parameters
    const resetUrl = `http://localhost:4200/password-reset-complete?email=${email}&code=${code}`;
    return res.redirect(resetUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Route for resetting the password after submitting a form
const resetPasswordAfterForm = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the reset code matches
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid reset code.' });
    }

    // Update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset code in the database after use, if needed
    user.verificationCode = null;
    await user.save();

    return res.json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // Find the user based on the information in the JWT token
    const user = await User.findById(jwt_payload.userId);

    if (user) {
      // If the user is found, return it
      return done(null, user);
    } else {
      // If the user is not found, return false
      return done(null, false);
    }
  } catch (err) {
    // If an error occurs, pass it to the done callback with the error
    return done(err, false);
  }
}));

//method needed for linking comments to user profile
const getUsersId = async (req, res) => {
  try {
    //console.log(req);
    const { name, surname } = req.params;
    const user = await User.findOne({ name: name, surname: surname });
    if (user) {
      res.json({ userId: user._id });
    } else {
        res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  confirmSignIn,
  userReadOne,
  userReadAll,
  registerUser,
  updateUser,
  deleteUser,
  verify,
  resetPassword,
  resetPasswordAfterClick,
  resetPasswordAfterForm,
  authenticateJWT: passport.authenticate('jwt', { session: false }),
  getUsersId
};