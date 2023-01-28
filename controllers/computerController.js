const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply = require("../models/powerSupply");
const RAM = require("../models/ram");
const Storage = require("../models/storage");
const Computer = require("../models/computer");

const { body, validationResult } = require("express-validator");

const async = require("async");
const fs = require("fs");



// Display list of all Computers.
exports.computer_list = (req, res, next) => {
    res.render("computer/computer_list", {title:"Computer List"})
}

//  Display detail page for a specific Computer.
exports.computer_detail = (req, res, next) => {
    res.render("computer/computer_detail", {title:"Computer Detail"})
}

// Display Computer CREATE form on GET.
exports.computer_create_get = (req, res, next) => {
    res.render("computer/computer_form", {title:"PC Build Create"})
}

// Display Computer CREATE form on POST.
exports.computer_create_post = (req, res, next) => {
    res.send('Not implemented yet: computer create POST')
}

// Display Computer DELETE form on GET.
exports.computer_delete_get = (req, res, next) => {
    res.render("computer/computer_delete", {title:"Computer Delete"})
}

// Display Computer DELETE form on POST.
exports.computer_delete_post = (req, res, next) => {
    res.send('Not implemented yet: computer delete POST')
}

// Display Computer update form on GET.
exports.computer_update_get = (req, res, next) => {
    res.render("computer/computer_form", {title:"PC Build Update"})
}

// Display Computer update form on POST.
exports.computer_update_post = (req, res, next) => {
    res.send('Not implemented yet: computer update POST')
}


