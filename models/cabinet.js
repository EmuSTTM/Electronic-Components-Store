const mongoose = require('mongoose');


const cabinetSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },
    brand: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true 
    }],
    dimension: { 
        type: String,
        required: true 
    },
    type: {
        type: String,
        enum: ['ATX', 'micro-ATX', 'mini-ITX'],
        required: true
    },
    bay_5_25: {
        type: Number,
        min: 0,
        required: true
    },
    bay_3_5: {
        type: Number,
        min: 0,
        required: true
    },
    bay_2_5: {
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


cabinetSchema.virtual('url').get(function() {
    return `/components/cabinet/${this._id}`
  })
const Cabinet = mongoose.model('Cabinet', cabinetSchema);

module.exports = Cabinet;

/*
name: nombre del gabinete
brand: marca del gabinete
dimension: dimensiones del gabinete (Longitud x Altura x Ancho)
type: tipo de placa base (ATX, micro-ATX, mini-ITX)
bay_5_25: número de bahías de 5.25"
bay_3_5: número de bahías de 3.5"
bay_2_5: número de bahías de 2.5"
price: precio del gabinete

const Cabinet = require('./Cabinet');
const Brand = require('./Brand');

async function addCabinet() {
    try {
        // Primero se busca o crea un brand existente
        let brand = await Brand.findOne({ name: 'brandName' });
        if (!brand) {
            brand = await new Brand({ name: 'brandName' }).save();
        }

        // Luego se crea un nuevo objeto Cabinet
        const newCabinet = new Cabinet({
            name: 'nameCabinet',
            brand: brand._id,
            dimension: '20x40x60 cm',
            type: 'ATX',
            bay_5_25: 3,
            bay_3_5: 2,
            bay_2_5: 1,
            price: 150
        });

        // Se guarda el objeto Cabinet
        const savedCabinet = await newCabinet.save();
        console.log(savedCabinet);
    } catch (err) {
        console.error(err);
    }
}

addCabinet();

 */
