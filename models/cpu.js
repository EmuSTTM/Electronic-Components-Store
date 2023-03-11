const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cpuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    //brands are in a array, because it's necesary for storage most of one brand
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  core_count: {
    type: Number,
    required: true,
  },
  thread_count: {
    type: Number,
    required: true,
  },
  clock_speed: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  socket: {
    type: String,
    required: true,
  },
  frecuency_ram: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  imgId: {
    type: String,
  },
});

cpuSchema.virtual("url").get(function () {
  return `/components/cpu/${this._id}`;
});
const CPU = mongoose.model("CPU", cpuSchema);

module.exports = CPU;
