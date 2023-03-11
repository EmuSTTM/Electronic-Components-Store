const mongoose = require("mongoose");

const gpuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: [
    {
      //brands are in a array, because it's necesary for storage most of one brand
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  ],
  model: {
    type: String,
    required: true,
  },
  memory: {
    type: String,
    match: /^\d+( GB| TB)$/,
    required: true,
  },
  memory_type: {
    type: String,
    enum: ["GDDR5", "GDDR6", "GDDR7"],
    required: true,
  },
  core_clock: {
    type: String,
    match: /^\d+ MHz$/,
    required: true,
  },
  boost_clock: {
    type: String,
    match: /^\d+ MHz$/,
    required: true,
  },
  stream_processors: {
    type: Number,
    min: 0,
    required: true,
  },
  tdp: {
    type: Number,
    min: 0,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  image: {
    type: String,
  },
  imgId: {
    type: String,
  },
});

gpuSchema.virtual("url").get(function () {
  return `/components/gpu/${this._id}`;
});

const GPU = mongoose.model("GPU", gpuSchema);
module.exports = GPU;


