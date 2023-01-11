const mongoose = require('mongoose');
const { Schema } = mongoose;

const PowerSupplySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId, 
        ref: 'Brand', 
        required: true
    },
    model: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        min: 0,
        required: true
    },
    certifications: {
        type: [String],
        enum: ['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium'],
        default: '80+ Bronze'
    },
    price: {
        type: Number,
        min: 0,
        required: true
    }
});

module.exports = mongoose.model('PowerSupply', PowerSupplySchema);


/*
El campo name es requerido y debe ser una cadena de caracteres
El campo brand es una clave foranea hacia el esquema Brand, es requerido
El campo model es requerido y debe ser una cadena de caracteres
El campo power es requerido, debe ser un número y debe ser mayor a 0
El campo certifications es un arreglo de strings, con una lista de valores posibles y su valor default.
El campo price es requerido, debe ser un número y debe ser mayor a 0
En cuanto a agregar un documento que cumpla con estas validaciones, podrías hacerlo mediante una función save() luego de crear una instancia del esquema:

const PowerSupply = require('../models/PowerSupply');

const powerSupply = new PowerSupply({
    name: "Supply CoolerMaster",
    brand: "5f40c4760fad2412b0d6f05f",
    model: "GX 650",
    power: 650,
    certifications: "80+ Bronze",
    price: 100
});

powerSupply.save().then(() => {
    console.log(powerSupply);
}).catch((error) => {
    console.log(error);
});

<form action="/powersupply" method="post">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>

    <label for="brand">Brand</label>
    <select id="brand" name="brand" required>
      <option value="brandId1">Brand 1</option>
      <option value="brandId2">Brand 2</option>
    </select>
    
    <label for="model">Model</label>
    <input type="text" id="model" name="model" required>

    <label for="power">Power</label>
    <input type="number" id="power" name="power" min="0" required>

    <label for="certifications">Certifications</label>
    <select id="certifications" name="certifications" required>
        <option value="80+ Bronze">80+ Bronze</option>
        <option value="80+ Silver">80+ Silver</option>
        <option value="80+ Gold">80+ Gold</option>
        <option value="80+ Platinum">80+ Platinum</option>
        <option value="80+ Titanium">80+ Titanium</option>
    </select>

    <label for="price">Price</label>
    <input type="number" id="price" name="price" min="0" required>
  
    <input type="submit" value="Create Power Supply">
</form>

Este formulario cuenta con todos los campos necesarios para rellenar toda la información solicitada en el esquema anterior, también utiliza atributos HTML5 como "min" para hacer validaciones en el lado del cliente, además de "required" para hacer campos obligatorios.
En el caso de la foreign key "brand", se hace uso de una lista desplegable.
Es importante notar que los valores de cada opción deberían ser el _id del objeto Brand guardado en la base de datos para así poder guardar correctamente la relación en la base de datos.

const express = require('express');
const router = express.Router();
const PowerSupply = require('../models/PowerSupply');

router.post('/powersupply', (req, res) => {
    const powerSupply = new PowerSupply({
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        power: req.body.power,
        certifications: req.body.certifications,
        price: req.body.price
    });

    powerSupply.save().then(() => {
        res.status(201).json(powerSupply);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = router;

*/