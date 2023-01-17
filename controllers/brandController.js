const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply =  require("../models/powerSupply");
const RamSchema = require("../models/ram");
const Storage = require("../models/storage");

const async = require("async");
const { body, validationResult } = require("express-validator");


// Display list of all Brands. Brand list it's a it useless
exports.brand_list = function (req, res, next) {
    Brand.find({}, "name")
      .sort({ name: 1 })
      .exec(function (err, list_brand) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("brand/brand_list", { title: "Brand List", brand_list: list_brand });
      });
  };
  

  
// Display detail page for a specific Brand.
exports.brand_detail = (req, res, next) => {
  async.parallel({
    brand(callback){
      Brand.findById(req.params.id).exec(callback);
    },
    brand_cabinets(callback){
      Cabinet.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_gpus(callback){
      GPU.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_motherboards(callback){
      Motherboard.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_powersupplies(callback){
      PowerSupply.find({ brand:req.params.id }).exec(callback);
    },
    brand_rams(callback){
      RamSchema.find({ brand:req.params.id }).exec(callback);
    },
    brand_storages(callback){
      Storage.find({ brand:req.params.id }).exec(callback);
    },
  },
  (err, results) => {
    if(err){
      return next(err);
    }
    if(results.brand == null){
      // No results
      const err = new Error("Brand not found");
      err.status = 404;
      return next(err);
    }
    // Todo sucedió correctamente
    res.render("brand/brand_detail",{
      title:"Brand Detail",
      brand: results.brand,
      brand_cabinets: results.brand_cabinets,
      brand_gpus : results.brand_gpus,
      brand_motherboards : results.brand_motherboards,
      brand_powersupplies : results.brand_powersupplies,
      brand_rams : results.brand_rams,
      brand_storages : results.brand_storages,
    })
  })
};

// Display Brand create form on GET.
exports.brand_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand create GET");
};

// Handle Brand create on POST.
exports.brand_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand create POST");
};

// Display Brand delete form on GET.
exports.brand_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand delete GET");
};

// Handle Brand delete on POST.
exports.brand_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand delete POST");
};

// Display Brand update form on GET.
exports.brand_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand update GET");
};

// Handle Brand update on POST.
exports.brand_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Brand update POST");
};
