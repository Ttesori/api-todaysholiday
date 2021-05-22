const Holiday = require('../models/Holiday');

module.exports = {
  getHolidays: async (req, res) => {
    try {
      const results = await Holiday.find();
      res.json(results);
    } catch (err) {
      console.log(err);
    }
  },
  getHolidaysByMonth: async (req, res) => {
    try {
      let results = await Holiday.find({ month: req.params.month });
      res.json(results);
    } catch (err) {
      console.log(err);
    }
  },
  getHolidaysByMonthDay: async (req, res) => {
    try {
      let results = await Holiday.find({ month: req.params.month, day: req.params.day });
      res.json(results);
    } catch (err) {
      console.log(err);
    }
  },
  postHoliday: async (req, res) => {
    console.log(req.body);
    try {
      if (req.body.name && req.body.month && req.body.day) {
        let holiday = {
          name: req.body.name,
          month: parseInt(req.body.month),
          day: parseInt(req.body.day)
        }
        let resp = await Holiday.create(holiday);
        res.json(resp);
      } else {
        res.send('Not added to DB - missing parameters');
      }
    } catch (err) {
      console.log(err)
    }
  },
  putHoliday: async (req, res) => {
    console.log(req.body.id, req.body.update)
    try {
      let resp = await Holiday.findOneAndUpdate(
        { _id: req.body.id },
        req.body.update);
      console.log('Holiday updated...');
      res.status(200).json(resp);
    }
    catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  deleteHoliday: async (req, res) => {
    try {
      let result = await Holiday.deleteOne({ _id: req.body.id });
      res.status(200).json(result.deletedCount);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  searchHolidays: async (req, res) => {
    try {
      let query = decodeURIComponent(req.query.s);
      let regex = new RegExp(query, 'i')
      let result = await Holiday.find({ name: regex }).exec();
      res.json(result);
    } catch (error) {
      console.log(err);
      res.status(400).json(err);
    }

  }
}