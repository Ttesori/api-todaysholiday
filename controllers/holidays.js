const Holiday = require('../models/Holiday');
const Tag = require('../models/Tag');

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
      let results = await Holiday.find({ month: req.params.month }).populate('tags');
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

  },
  addTagToHoliday: async (req, res) => {
    try {
      let newTagMaybe = req.body.tagname.toLowerCase();
      let tag = await Tag.findOne({ name: newTagMaybe });
      if (!tag) {
        // Create new tag
        console.log('Creating new tag');
        let newTag = new Tag({
          name: req.body.tagname
        });
        tag = await newTag.save();
      }
      let holiday = await Holiday.findOne({ _id: req.body.holiday_id });
      if (!holiday) res.status(404).send('Holiday not found');
      holiday.tags = [{ _id: tag._id }];
      let result = await holiday.save();
      res.status(200).json(result);
    } catch (err) {
      console.log(err)
    }
  },
  getTags: async (req, res) => {
    try {

    } catch (error) {

    }
  }
}