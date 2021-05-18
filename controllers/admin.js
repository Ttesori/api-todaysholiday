const Holiday = require('../models/Holiday');

module.exports = {
  getHolidaysByMonth: async (req, res) => {
    try {
      let results = await Holiday.find({ month: req.params.month }).sort({ day: 1 });
      let month = parseInt(req.params.month);
      res.render('admin-index.ejs', {
        data: {
          results: results,
          months: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          currMonth: month,
          prevMonth: month === 1 ? 12 : month - 1,
          nextMonth: month === 12 ? 1 : month + 1
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}