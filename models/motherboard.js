const mongoose = require('mongoose');


const motherboardSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    brand: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand', 
        required: true 
    }],
    price: { 
        type: Number, 
        min: 0, 
        required: true 
    },
    chipset: { 
        type: String, 
        // enum: ['Intel H370', 'AMD B450', 'Intel Z490'], 
        required: true 
    },
    
    max_ram: { 
        type: Number,  
        required: true 
    },
    image: { 	
        type: String, 
    },
    
    // properties for compatibilities
    ram_slots: { 
        type: Number, 
        min: 0, 
        required: true 
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
        enum: ['ITX', 'M-ATX', 'ATX'],
        required: true,
    
    },
    // For the ram sockets
    socket_ram: {
        type: String,
        enum: ['DDR3', 'DDR4', 'DDR5'],
        required: true,
    },

    //  I need the add this comprobation in the motherboards
    // socket_v2: {
    //     type: Number,
    //     required: true,
    // }

});

motherboardSchema.virtual('url').get(function() {
    return `/components/motherboard/${this._id}`
  })

const Motherboard = mongoose.model('Motherboard', motherboardSchema);

module.exports = Motherboard;

/*
En el atributo "name" se valida que sea un string y que no esté vacío.
En el atributo "brand" se valida que sea un ObjectId válido y que haga referencia a un objeto de la colección "Brand".
En el atributo "price" se valida que sea un número mayor o igual a cero.
En el atributo "chipset" se valida que el valor sea uno de los valores especificados en el enumerado.
En el atributo "ramSlots" se valida que sea un número mayor o igual a cero.
En el atributo "maxRam" se valida que sea una cadena con el formato "X GB" o "X TB".
*/