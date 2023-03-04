const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ["HDD", "SSD", "SSHD", "NVMe"],
    required: true,
  },
  capacity: {
    type: String,
    match: /^\d+( GB| TB)$/,
    required: true,
  },
  speed: {
    type: String,
    match: /^\d+ RPM$/,
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

storageSchema.virtual("url").get(function () {
  return `/components/storage/${this._id}`;
});

const Storage = mongoose.model("Storage", storageSchema);
module.exports = Storage;
