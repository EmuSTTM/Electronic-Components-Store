const mongoose = require("mongoose");

const cabinetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  ],
  dimension: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ATX", "M-ATX", "ITX"],
    required: true,
  },
  bay_5_25: {
    type: Number,
    min: 0,
    required: true,
  },
  bay_3_5: {
    type: Number,
    min: 0,
    required: true,
  },
  bay_2_5: {
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
});

cabinetSchema.virtual("url").get(function () {
  return `/components/cabinet/${this._id}`;
});
const Cabinet = mongoose.model("Cabinet", cabinetSchema);

module.exports = Cabinet;

