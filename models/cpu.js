const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cpuSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand: { //brands are in a array, because it's necesary for storage most of one brand
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    model: {
        type: String,
        required: true
    },
    coreCount: {
        type: Number,
        required: true
    },
    threadCount: {
        type: Number,
        required: true
    },
    clockSpeed: {
        type: String,
        match: /^\d+ MHz$/,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    socket: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});


cpuSchema.virtual('url').get(function() {
    return `/components/cpu/${this._id}`
  })
const CPU = mongoose.model('CPU', cpuSchema);

module.exports = CPU;