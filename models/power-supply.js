const mongoose = require("mongoose");
const { Schema } = mongoose;

const PowerSupplySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  brand: [
    {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  ],
  model: {
    type: String,
    required: true,
  },
  power: {
    type: Number,
    min: 0,
    required: true,
  },
  certification: {
    type: [String],
    enum: [
      "80+ Bronze",
      "80+ Silver",
      "80+ Gold",
      "80+ Platinum",
      "80+ Titanium",
    ],
    default: "80+ Bronze",
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

PowerSupplySchema.virtual("url").get(function () {
  return `/components/powerSupply/${this._id}`;
});

module.exports = mongoose.model("Power Supply", PowerSupplySchema);

