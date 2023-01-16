const mongoose = require('mongoose');


const storageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    type: {
        type: String,
        enum: ['HDD', 'SSD','SSHD', 'NVMe'],
        required: true
    },
    capacity: {
        type: String,
        match: /^\d+( GB| TB)$/,
        required: true
    },
    speed: {
        type: String,
        match: /^\d+ RPM$/,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    }
});

storageSchema.virtual('url').get(function() {
    return `/components/storage/${this._id}`
  })

const Storage = mongoose.model('Storage', storageSchema);
module.exports = Storage;




/*
const mongoose = require('mongoose');
const Storage = require('./Storage');

mongoose.connect('mongodb://localhost:27017/hardware', { useNewUrlParser: true });

const storage = new Storage({
    name: 'Seagate Barracuda 2TB',
    brand: 'Seagate',
    type: 'HDD',
    capacity: '2 TB',
    interface: 'SATA',
    price: 50
});

storage.save((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Storage added successfully!');
    }
    mongoose.connection.close();
});

*/