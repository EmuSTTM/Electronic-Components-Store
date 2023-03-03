#! /usr/bin/env node

// console.log('This script populates some test brands, cabinet and GPU to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/?retryWrites=true&w=majority');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
const Brand = require("./models/brand");
const Cabinet = require("./models/cabinet");
const GPU = require("./models/GPU");
// const Motherboard = require('./models/motherboard');
// const PowerSupply = require('./models/powerSupply');
// const RAM = require('./models/RAM');
// const Storage = require('./models/storage')

var mongoose = require("mongoose");
mongoose.set("strictQuery", false);
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var brands = [];
var cabinets = [];
var GPUs = [];
// var motherboards = [];
// var powerSupplies = [];
// var RAMs = [];
// var Storages = [];

// Function to create a Brand
function brandCreate(name, cb) {
  let brand = new Brand({ name: name });

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

// Function to create a Cabinet
function cabinetCreate(
  name,
  brand,
  dimension,
  type,
  bay_5_25,
  bay_3_5,
  bay_2_5,
  price,
  cb
) {
  cabinetdetail = {
    name: name,
    dimension: dimension,
    type: type,
    bay_5_25: bay_5_25,
    bay_3_5: bay_3_5,
    bay_2_5: bay_2_5,
    price: price,
  };
  if (brand != false) cabinetdetail.brand = brand;

  let cabinet = new Cabinet(cabinetdetail);
  cabinet.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Cabinet: " + cabinet);
    cabinets.push(cabinet);
    cb(null, cabinet);
  });
}

function gpuCreate(
  name,
  brand,
  model,
  memory,
  memory_type,
  core_clock,
  boost_clock,
  stream_processors,
  tdp,
  price,
  cb
) {
  gpudetail = {
    name: name,
    model: model,
    memory: memory,
    memory_type: memory_type,
    core_clock: core_clock,
    boost_clock: boost_clock,
    stream_processors: stream_processors,
    tdp: tdp,
    price: price,
  };
  if (brand != false) gpudetail.brand = brand;

  let gpu = new GPU(gpudetail);
  gpu.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New GPU" + gpu);
    GPUs.push(gpu);
    cb(null, gpu);
  });
}

// name: nombre de la tarjeta gráfica
// brand: marca de la tarjeta gráfica, se refiere a un objeto de la colección "Brand" mediante su ObjectId.
// model: modelo de la tarjeta gráfica
// memory: capacidad de memoria
// memory_type: tipo de memoria
// core_clock: velocidad de reloj de núcleo
// boost_clock: velocidad de reloj de impulso
// stream_processors: número de procesadores de flujo
// tdp: potencia térmica de diseño
// price: precio de la tarjeta gráfica

/* 
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
*/

function createBrands(cb) {
  async.series(
    [
      // Este va con async series en lugar de parallel, porque necesitamos que se ejecuten en orden
      function (callback) {
        brandCreate("AMD", callback);
      },
      function (callback) {
        brandCreate("ASUS", callback);
      },
      function (callback) {
        brandCreate("Asrock", callback);
      },
      function (callback) {
        brandCreate("Gygabyte", callback);
      },
      function (callback) {
        brandCreate("Intel", callback);
      },
      function (callback) {
        brandCreate("NVIDIA", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createCabinets(cb) {
  async.parallel(
    [
      function (callback) {
        cabinetCreate(
          "Cabinet Sentey F10 RGB M-ATX",
          [brands[2]],
          "20x40x60 cm",
          "ATX",
          1,
          0,
          1,
          18450,
          callback
        );
      },
      function (callback) {
        cabinetCreate(
          "Cabinet Jalatec JT-LX72 RGB",
          [brands[1]],
          "20x43x37 cm",
          "ATX",
          0,
          2,
          4,
          19500,
          callback
        );
      },
      function (callback) {
        cabinetCreate(
          "Cabinet Antex NX400 ARGB",
          [brands[1]],
          "23x46x42",
          "ATX",
          0,
          2,
          5,
          19800,
          callback
        );
      },
    ],
    cb
  );
}

function createGPUs(cb) {
  async.parallel(
    [
      function (callback) {
        gpuCreate(
          "GPU XFX RADEON RX 6600 XT",
          [brands[0]],
          "RX 6600 XT",
          "8 GB",
          "GDDR6",
          "2586 MHz",
          "16000 MHz",
          2048,
          160,
          140850,
          callback
        );
      },
      function (callback) {
        gpuCreate(
          "GPU ASUS RADEON RX 6900 XT",
          [brands[0], brands[1]],
          "RX 6900 XT",
          "16 GB",
          "GDDR6",
          "2365 MHz",
          "16000 MHz",
          5120,
          380,
          513700,
          callback
        );
      },
    ],
    cb
  );
}
/* 
const newGPU = new GPU({
    name: 'nameGPU',
    brand: brand._id,
    model: 'modelGPU',
    memory: '8 GB',
    memory_type: 'GDDR6',
    core_clock: '1500 MHz',
    boost_clock: '1750 MHz',
    stream_processors: 3072,
    tdp: 150, //consumo de watts
    price: 400
});
*/

async.series(
  [createBrands, createCabinets, createGPUs],
  function (err, results) {
    if (err) {
      console.log("FINALL ERR: " + err);
    } else {
      console.log("Resultados agregados correctamente");
    }
    mongoose.connection.close();
  }
);
