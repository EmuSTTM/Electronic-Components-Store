const mongoose = require("mongoose");

const RAMSchema = new mongoose.Schema({
  brand: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  ],
  model: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  speed: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ["DDR3", "DDR4", "DDR5"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

RAMSchema.virtual("url").get(function () {
  return `/components/ram/${this._id}`;
});

module.exports = mongoose.model("RAMModel", RAMSchema); // If you put only "RAM" there will be an error

