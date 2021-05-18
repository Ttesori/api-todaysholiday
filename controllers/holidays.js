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
  // you were here -- just updated the route to include whichever vars are passed in the update object. So youll needt o update postman for prod once you push the update. On view, you were working on deleting a holiday and being able to update name of holiday from UI
  putHoliday: async (req, res) => {
    try {
      let resp = await Holiday.findOneAndUpdate(
        { _id: req.body.id },
        req.body.update);
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
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}