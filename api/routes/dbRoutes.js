// dbRoutes.js
const express = require('express');
const router = express.Router();
const ctrlDB = require('../controllers/ctrlDB');

router.get('/', ctrlDB.showDBManagementPage);
router.post('/clear', ctrlDB.clearDatabase);
router.post('/seed', ctrlDB.seedDatabase);

module.exports = router;
