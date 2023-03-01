
const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const CPU = require("../models/cpu");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply = require("../models/powerSupply");
const RAM = require("../models/ram");
const Storage = require("../models/storage");
const Computer = require("../models/computer");

const { body, validationResult } = require("express-validator");


const async = require("async");
const fs = require("fs");

exports.index = function (req, res, next) {
    // res.send('Está hecho el carrito nashe')
    res.render('cart', {title:"Shopping Cart"})

};


exports.cart_computer = function (req, res, next) {
    res.render('cart', {title:"Shopping Cart"})
}