const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Holiday', HolidaySchema);