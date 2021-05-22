const express = require('express');
const router = express.Router();
const holidaysController = require('../controllers/holidays');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', holidaysController.getHolidays);
router.post('/', isAuthenticated, holidaysController.postHoliday);
router.put('/', isAuthenticated, holidaysController.putHoliday);
router.delete('/', isAuthenticated, holidaysController.deleteHoliday);
router.get('/search', holidaysController.searchHolidays);
router.post('/tag', holidaysController.addTagToHoliday);
router.get('/:month', holidaysController.getHolidaysByMonth);
router.get('/:month/:day', holidaysController.getHolidaysByMonthDay);

module.exports = router;