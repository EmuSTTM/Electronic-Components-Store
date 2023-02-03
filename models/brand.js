const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
});


brandSchema.virtual('url').get(function() {
  return `/components/brand/${this._id}`
})

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;