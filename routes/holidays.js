const express = require('express');
const router = express.Router();
const holidaysController = require('../controllers/holidays');

router.get('/', holidaysController.getHolidays);
router.get('/:month', holidaysController.getHolidaysByMonth);
router.get('/:month/:day', holidaysController.getHolidaysByMonthDay);
router.post('/', holidaysController.postHoliday);
router.put('/', holidaysController.putHoliday);
router.delete('/', holidaysController.deleteHoliday);

module.exports = router;