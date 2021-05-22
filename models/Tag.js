const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

TagSchema.methods.getTagUses = function (tagname) {
  return 10;
}

module.exports = mongoose.model('Tag', TagSchema);