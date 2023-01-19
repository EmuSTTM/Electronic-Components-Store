const mongoose = require('mongoose');

const RAMSchema = new mongoose.Schema({
    brand: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }],
    model: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: Number, 
        required: true,
        min: 0
    },
    speed: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        required: true,
        enum: ['DDR3', 'DDR4', 'DDR5']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    name: {
        type:String,
        required:true,
        min: 0
    }
});

RAMSchema.virtual('url').get(function() {
    return `/components/ram/${this._id}`
  })

module.exports = mongoose.model('RAMModel', RAMSchema); // If you put only "RAM" there will be an error


/*
La foreign key es "brand" y su valor se refiere a un _id existente en la colección Brand.
El esquema valida que los campos "size", "speed", "price" son números y requeridos, además de que son mayores que cero.
El campo "type" solamente puede tener los valores especificados en el enum, en este caso "DDR3", "DDR4", "DDR5".


<form action="/ram" method="post">
    <label for="brand">Brand:</label>
    <select id="brand" name="brand" required>
      <option value="brandId1">Brand 1</option>
      <option value="brandId2">Brand 2</option>
    </select>
    <br>
    <label for="model">Model:</label>
    <input type="text" id="model" name="model" required>
    <br>
    <label for="size">Size:</label>
    <input type="number" id="size" name="size" required>
    <br>
    <label for="speed">Speed:</label>
    <input type="number" id="speed" name="speed" required>
    <br>
    <label for="type">Type:</label>
    <select id="type" name="type" required>
      <option value="DDR3">DDR3</option>
      <option value="DDR4">DDR4</option>
      <option value="DDR5">DDR5</option>
    </select>
    <br>
    <label for="price">Price:</label>
    <input type="number" id="price" name="price" required>
    <br>
    <input type="submit" value="Add RAM">
</form>

const RAM = require('./models/ram');
app.post('/ram', (req, res) => {
    const newRAM = new RAM({
        brand: req.body.brand,
        model: req.body.model,
        size: req.body.size,
        speed: req.body.speed,
        type: req.body.type,
        price: req.body.price
    });
});


<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <style>
        .form-container {
            width: 30%;
            margin: 0 auto;
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <form action="/ram" method="post">
            <div class="form-group">
                <label for="brand">Brand:</label>
                <select class="form-control" id="brand" name="brand" required>
                  <option value="brandId1">Brand 1</option>
                  <option value="brandId2">Brand 2</option>
                </select>
            </div>
            <div class="form-group">
                <label for="model">Model:</label>
                <input type="text" class="form-control" id="model" name="model" required>
            </div>
            <div class="form-group">
                <label for="size">Size:</label>
                <input type="number" class="form-control" id="size" name="size" required>
            </div>
            <div class="form-group">
                <label for="speed">Speed:</label>
                <input type="number" class="form-control" id="speed" name="speed" required>
            </div>
            <div class="form-group">
                <label for="type">Type:</label>
                <select class="form-control" id="type" name="type" required>
                  <option value="DDR3">DDR3</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                </select>
            <div>
            <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" class="form-control" id="price" name="price" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            <div>
*/