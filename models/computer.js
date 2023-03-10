const mongoose = require("mongoose");

const computerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  cabinet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabinet",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  cpu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CPU",
    required: true,
  },
  gpu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GPU",
    required: true,
  },
  motherboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Motherboard",
    required: true,
  },
  powerSupply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Power Supply",
    required: true,
  },
  ram: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RAMModel",
      required: true,
    },
  ],
  storage: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
  ],
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  imgId: {
    type: String,
  },
});

computerSchema.virtual("url").get(function () {
  return `/computers/${this._id}`;
});

const Computer = mongoose.model("Computer", computerSchema);
module.exports = Computer;
