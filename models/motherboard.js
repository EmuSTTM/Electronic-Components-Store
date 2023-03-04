const mongoose = require("mongoose");

const motherboardSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  chipset: {
    type: String,
    // enum: ['Intel H370', 'AMD B450', 'Intel Z490'],
    required: true,
  },

  max_ram: {
    type: Number,
    min: 0,
    required: true,
  },
  image: {
    type: String,
  },

  // properties for compatibilities
  ram_slots: {
    type: Number,
    min: 0,
    required: true,
  },
  // For the CPU and for the ram
  frecuency_ram: {
    type: Number,
    required: true,
  },
  // For the cpu
  socket: {
    type: String,
    required: true,
  },

  // For the cabinet and for the GPU
  type: {
    type: String,
    enum: ["ITX", "M-ATX", "ATX"],
    required: true,
  },
  // For the ram sockets
  socket_ram: {
    type: String,
    enum: ["DDR3", "DDR4", "DDR5"],
    required: true,
  },

  //  This comprobation it's for the storages compatibility
  sockets_v2: {
    type: Number,
    required: true,
  },

  sockets_sata: {
    type: Number,
    required: true,
  },
});

motherboardSchema.virtual("url").get(function () {
  return `/components/motherboard/${this._id}`;
});

const Motherboard = mongoose.model("Motherboard", motherboardSchema);

module.exports = Motherboard;


