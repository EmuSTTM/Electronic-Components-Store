const mongoose = require('mongoose');


const motherboardSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand', 
        required: true 
    },
    price: { 
        type: Number, 
        min: 0, 
        required: true 
    },
    chipset: { 
        type: String, 
        enum: ['Intel H370', 'AMD B450', 'Intel Z490'], 
        required: true 
    },
    ramSlots: { 
        type: Number, 
        min: 0, 
        required: true 
    },
    maxRam: { 
        type: String, 
        match: /^\d+( GB| TB)$/, 
        required: true 
    },
});

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