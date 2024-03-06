const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models/db.js');

const { expressjwt: jwt } = require("express-jwt");

const auth = jwt({
    secret: process.env.JWT_SECRET, 
    userProperty: "user",
    algorithms: ["HS256"],
});
  

const ctrlArea = require('../controllers/ctrlArea.js');
const ctrlUsers = require('../controllers/ctrlUsers.js');
const ctrlComments = require('../controllers/ctrlComments.js');
const ctrlUserClimb = require('../controllers/ctrlUserClimb.js');
const ctrlEvent = require('../controllers/ctrlEvent.js');


/**
* User
*/
router.post('/login', ctrlUsers.confirmSignIn);
router.get('/profile/:userId', ctrlUsers.userReadOne);
router.get('/profile/', ctrlUsers.userReadAll);
router.post('/signup', ctrlUsers.registerUser);
router.put('/profile/:userId', auth, logPayload, ctrlUsers.updateUser); //Restricted to authenticated users and admins
router.delete('/profile/:userId', auth, ctrlUsers.deleteUser); //Restricted to authenticated users and admins
router.get('/verify', ctrlUsers.verify);
router.post('/initiate-reset-password', ctrlUsers.resetPassword);
router.get('/reset-password', ctrlUsers.resetPasswordAfterClick);
router.post('/complete-reset-password', ctrlUsers.resetPasswordAfterForm);
router.get('/getUsersId/:name/:surname', ctrlUsers.getUsersId);

/**
 * Plezalisca
 */
// AreaCreate was removed because the admins manually add it in the database
router.get('/plezalisce', ctrlArea.areaReadAll);
router.get("/plezalisce/razdalja", ctrlArea.areaListByDistance);
router.get("/plezalisce/codelist/:codelist", ctrlArea.areaListCodelist ); 
router.get("/plezalisce/:areaId", ctrlArea.areaReadOne);

/**
 * Comments
 */
router.post("/plezalisce/:areaId/comments", auth, ctrlComments.commentsCreate);  //Restricted to authenticated users and admins
router.get("/plezalisce/:areaId/comments/:commentId",ctrlComments.commentsReadOne);

// not used // router.put("/plezalisce/:areaId/comments/:commentId",  auth, ctrlComments.commentsUpdateOne);  //Restricted to authenticated users and admins
router.delete("/plezalisce/:areaId/comments/:commentId", auth,  ctrlComments.commentsDeleteOne);  //Restricted to authenticated users and admins

/**
 * userClimb
 */
router.post("/profile/:userId/vzponi", auth, ctrlUserClimb.userClimbCreate);  //Restricted to admins and authenticated users
router.get("/profile/:userId/vzponi/:climbId", ctrlUserClimb.userClimbReadOne); 
router.get("/profile/:userId/vzponi", ctrlUserClimb.getAllClimbsForUser);
// update userClimb is not used due to lazyness
// router.put("/profile/:userId/vzponi/:climbId",auth,  ctrlUserClimb.userClimbUpdateOne); //Restricted to admins and authenticated users
router.delete("/profile/:userId/vzponi/:climbId", auth, ctrlUserClimb.userClimbDeleteOne); //Restricted to admins and authenticated users

/**
 * event
 */
 router.get("/event/:eventId", ctrlEvent.eventReadOne);
 router.get("/event", ctrlEvent.getAllEvents);
 router.post("/event/:userId",auth, ctrlEvent.eventCreate); //Restricted to admins 
 //router.put("/event/:eventId/:userId", ctrlEvent.eventUpdateOne);
 router.put("/event/:eventId/:userId", ctrlEvent.signupToEvent);
 router.delete("/event/:eventId/:userId",auth, ctrlEvent.eventDeleteOne);
 router.put("/event/:eventId/removeUser/:userToBeRemovedId/:userRequestingTheRemoval", ctrlEvent.removeUserFromEvent)


//This route handler matches both the root URL ("/") 
//and URLs that contain "/main_page" with or without ".html" at the end.

// TODO: switch to angular site rendering
//

function logPayload(req, res, next) {
    console.log(req.headers);
    console.log(req.user);
    next();
}

router.get('/test', auth, logPayload, (req, res) => {
    res.send('Check your console!');
  });

router.get('^/$|/main_page(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'main_page.html'));
    res.render("main_page.ejs");
});

router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
    res.render("login.ejs");
});

router.get('/map(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'map.html'));
    res.render("map.ejs");
});

router.get('/plezalisce(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'plezalisce.html'));
    res.render("plezalisce.ejs");
});

router.get('/profile(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'profile.html'));
    res.render("profile.ejs");
});

router.get('/signup(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
    res.render("signup.ejs");
});
router.get('/signup(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
    res.render("signup.ejs");
});
router.get('/db(.html)?', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
    res.render("dbManagement.ejs");
});

// page to test database

/*router.get('/get-all-documents', async (req, res) => {
    try {
      const documents = await db.getAllDocuments('users');   //name of collection for your local developement
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
});*/


module.exports = router;