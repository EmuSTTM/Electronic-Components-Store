const mongoose = require('mongoose');


const gpuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: [{ //brands are in a array, because it's necesary for storage most of one brand
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }],
    model: {
        type: String,
        required: true
    },
    memory: {
        type: String,
        match: /^\d+( GB| TB)$/,
        required: true
    },
    memory_type: {
        type: String,
        enum: ['GDDR5', 'GDDR6', 'GDDR7'],
        required: true
    },
    core_clock: {
        type: String,
        match: /^\d+ MHz$/,
        required: true
    },
    boost_clock: {
        type: String,
        match: /^\d+ MHz$/,
        required: true
    },
    stream_processors: {
        type: Number,
        min: 0,
        required: true
    },
    tdp: {
        type: Number,
        min: 0,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    image: { 	
        type: String, 
    },
});

gpuSchema.virtual('url').get(function() {
    return `/components/gpu/${this._id}`
  })

const GPU = mongoose.model('GPU', gpuSchema);
module.exports = GPU;

/*
name: nombre de la tarjeta gráfica
brand: marca de la tarjeta gráfica, se refiere a un objeto de la colección "Brand" mediante su ObjectId.
model: modelo de la tarjeta gráfica
memory: capacidad de memoria
memory_type: tipo de memoria
core_clock: velocidad de reloj de núcleo
boost_clock: velocidad de reloj de impulso
stream_processors: número de procesadores de flujo
tdp: potencia térmica de diseño
price: precio de la tarjeta gráfica
Los campos de "memory" y "clock" utilizan expresiones regulares para validar que sean cadenas con el formato "X GB" o "X TB" y "X MHz", respectivamente.

const GPU = require('./GPU');
const Brand = require('./Brand');

async function addGPU() {
    try {
        // Primero se busca o crea un brand existente
        let brand = await Brand.findOne({ name: 'brandName' });
        if (!brand) {
            brand = await new Brand({ name: 'brandName' }).save();
        }

        // Luego se crea un nuevo objeto GPU
        const newGPU = new GPU({
            name: 'nameGPU',
            brand: brand._id,
            model: 'modelGPU',
            memory: '8 GB',
            memory_type: 'GDDR6',
            core_clock: '1500 MHz',
            boost_clock: '1750 MHz',
            stream_processors: 3072,
            tdp: 150,
            price: 400
        });

        // Se guarda el objeto GPU
        const savedGPU = await newGPU.save();
        console.log(savedGPU);
    } catch (err) {
        console.error(err);
    }
}

addGPU();


*/