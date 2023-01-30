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



// Display list of all Computers.
exports.computer_list = (req, res, next) => {
    Computer.find({}, "name brand cpu gpu motherboard ram storage powerSupply price image")
      .sort({ name: 1 })
      .populate("brand")
      .populate("cpu")
      .populate("gpu")
      .populate("motherboard")
      .populate("ram")
      .populate("storage")
      .populate("powerSupply")
      .exec(function (err, list_computer) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("computer/computer_list", { title: "Computer List", computer_list: list_computer });
      });
}

// Display detail page for a specific computer.
exports.computer_detail = (req, res, next) => {

    // Populate all components to access their properties
    Computer.findById(req.params.id)
      .populate('brand')
      .populate("cpu")
      .populate("gpu")
      .populate("motherboard")
      .populate("ram")
      .populate("storage")
      .populate("powerSupply")
      .exec(
    (err, computer) => {
      if(err){
        return next(err);
      }
      if(computer == null){
        // No results
        const err = new Error("computer not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("computer/computer_detail",{
        title:"Computer Detail",
        computer:computer,
      })
    })
  };

// Display computer create form on GET.
exports.computer_create_get = (req, res, next) => {
    async.parallel({
        brands(callback){
            Brand.find(callback)
          },
        cpu(callback){
          CPU.find(callback)
        },
        gpu(callback){
          GPU.find(callback)
        },
        motherboard(callback){
          Motherboard.find(callback)
        },
        ram(callback){
          RAM.find(callback)
        },
        storage(callback){
          Storage.find(callback)
        },
        powerSupply(callback){
          PowerSupply.find(callback)
        }, 
      },
      (err, results) =>{

        /////////////////////////////////////////////////////////////////
        // ver el la funcion del map, necesito que solo me pase amd e intel. Hay que preguntar a laia como se hace
        // for (const brand in results.brands) {
        //     if (brand.name == "AMD" || brand.name == "Intel"){
        //         results.brands.p
        //     } 
        // }
      res.render("computer/computer_form", {
        title:"Add computer",
        brands: results.brands,
        cpu: results.cpu,
        gpu: results.gpu,
        motherboard: results.motherboard,
        ram: results.ram,
        storage: results.storage,
        powerSupply: results.powerSupply,

      })
    })
  };

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


