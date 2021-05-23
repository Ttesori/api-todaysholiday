const Tag = require('../models/Tag');
const Holidays = require('../models/Holiday');

module.exports = {
  getTags: async (req, res) => {
    try {
      let result = await Tag.find().sort({ name: 1 });
      if (!result) res.status(404).send('Tags not found');
      res.status(200).json(result);
    } catch (err) {
      console.log(err)
    }
  },
  addNewTag: async (req, res) => {
    try {
      let newTagMaybe = req.body.tagname.toLowerCase();
      if (!newTagMaybe) return res.status(400).send('Tag name cannot be blank')
      let tag = await Tag.findOne({ name: newTagMaybe });
      if (!tag) {
        // Create new tag
        let newTag = new Tag({
          name: req.body.tagname
        });
        tag = await newTag.save();
      }
      if (!tag) return res.status(400).send('Something went wrong');
      res.status(200).json(tag);
    } catch (err) {
      console.log(err)
    }
  },
  updateTag: async (req, res) => {
    try {
      let newTagMaybe = req.body.tagname.toLowerCase();
      if (!newTagMaybe) return res.status(400).send('Tag name cannot be blank')
      let result = await Tag.findByIdAndUpdate(req.body.id, { name: newTagMaybe });
      if (!result) return res.status(404).send('Cannot find tag name.');
      res.status(200).json(result);
    } catch (err) {
      console.log(err)
    }
  },
  deleteTag: async (req, res) => {
    try {
      let tagIdToDelete = req.body.id;
      let holidaysWithTag = await Holidays.find({ tags: tagIdToDelete }).countDocuments();
      if (holidaysWithTag === 0) {
        // Proceed with deleting
        let result = await Tag.findOneAndDelete({ _id: tagIdToDelete });
        res.status(200).json(result);
      } else {
        // Return error
        res.status(400).json({ error: 'Cannot remove tag, uses must be 0' });
      }

    } catch (err) {
      console.log(err);
    }
  }
}