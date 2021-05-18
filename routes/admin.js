const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/:month', adminController.getHolidaysByMonth);

module.exports = router;