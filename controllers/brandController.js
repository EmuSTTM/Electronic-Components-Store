const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply =  require("../models/powerSupply");
const RamSchema = require("../models/ram");
const Storage = require("../models/storage");

const async = require("async");
const {body, validationResult } = require("express-validator");
const fs = require("fs");


// Display list of all Brands. Brand list it's a it useless
exports.brand_list = function (req, res, next) {
    Brand.find({}, "name image")
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
      PowerSupply.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_rams(callback){
      RamSchema.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_storages(callback){
      Storage.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
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
exports.brand_create_get = (req, res, next) => {
  res.render("brand/brand_form", {title: "Add Brand"});
};

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "Brand name is required").trim().isLength({ min: 1 }).escape(),
  

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(req.file.filename)
    // Create a brand object with escaped and trimmed data.
    const brand = new Brand({ 
      name: req.body.name,
    });
    if (typeof req.file.filename !== "undefined") {
      brand.image = req.file.filename;
    }
    if (typeof req.body.description !== "undefined") {
      brand.description = req.body.description;
    }

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      console.log(errors)
      res.render("brand/brand_form", {
        title: "Create Brand",
        brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Brand with same name already exists.
      Brand.findOne({ name: req.body.name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }

        if (found_brand) {
          // Brand exists, redirect to its detail page.
          res.redirect(found_brand.url);
        } else {
          brand.save((err) => {
            if (err) {
              return next(err);
            }
            // Brand saved. Redirect to brand detail page.
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];


// Display Brand delete form on GET.
exports.brand_delete_get = (req, res, next) => {
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
      PowerSupply.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_rams(callback){
      RamSchema.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
    brand_storages(callback){
      Storage.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(callback);
    },
  },
  (err, results)=> {
    if (err) {
      return next(err);
    }
    if(results.brand == null){
      // No results
      res.redirect("/components/brands")
    }
    res.render("brand/brand_delete", {
      title: "Delete Brand",
      brand: results.brand,
      brand_cabinets : results.brand_cabinets,
      brand_gpus : results.brand_gpus,
      brand_motherboards: results.brand_motherboards,
      brand_powersupplies : results.brand_powersupplies,
      brand_rams : results.brand_rams,
      brand_storages : results.brand_storages,
      
    })
  })
};

// Handle Brand delete on POST.
exports.brand_delete_post = (req, res, next) => {
  // Aquí utilizamos el parámetro "body.brandid" para evitar bugs, ya que si
  // alguien intenta cambiar la url, no podrá eliminar otro brand. Ya que acá no comprobamos
  // si el brand existe como si hacemos en el get
  async.parallel({
    brand(callback){
      Brand.findById(req.body.brandid).exec(callback);
    },
    brand_cabinets(callback){
      Cabinet.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
    brand_gpus(callback){
      GPU.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
    brand_motherboards(callback){
      Motherboard.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
    brand_powersupplies(callback){
      PowerSupply.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
    brand_rams(callback){
      RamSchema.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
    brand_storages(callback){
      Storage.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(callback);
    },
  },
  (err, results) => {
    if (err) {
      return next(err);
    }
    if(results.brand_cabinets.isLength > 0 || 
      results.brand_gpus.isLength > 0 ||
      results.brand_motherboards.isLength > 0 ||
      results.brand_powersupplies.isLength > 0 ||
      results.brand_rams.isLength > 0 ||
      results.brand_storages.isLength > 0){

        res.render("brand/brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_cabinets : results.brand_cabinets,
          brand_gpus : results.brand_gpus,
          brand_motherboards: results.brand_motherboards,
          brand_powersupplies : results.brand_powersupplies,
          brand_rams : results.brand_rams,
          brand_storages : results.brand_storages,
          
        });
        return
      }
      if(results.brand == null){
        // No results
        res.redirect("/components/brands")
      }
      Brand.findByIdAndRemove(req.body.brandid, (err) => {
        if(err){
          return next(err);
        };
        if(typeof results.brand.image != undefined){
          const ImageName = "public/images/" + results.brand.image
  
          if(fs.existsSync(ImageName)){
            fs.unlinkSync(ImageName);
        }
        } 
        res.redirect("/components/brands")
      })

  })
};

// Display Brand update form on GET.
exports.brand_update_get = (req, res, next) => {
  Brand.findById(req.params.id).exec((err, brand) =>{
    if (err){
      return next(err);
    };
    res.render("brand/brand_form", {
    title :"Update Brand",
    brand: brand,
  })
  })
};

// Handle Brand update on POST.
exports.brand_update_post = async (req, res, next) => {
  try {
    const brandToDeleteImage = await Brand.findById(req.params.id).exec();
    if (brandToDeleteImage && brandToDeleteImage.image) {
      const ImageName = "public/images/" + brandToDeleteImage.image;
      if (fs.existsSync(ImageName)) {
        fs.unlinkSync(ImageName);
      }
    }

    const brand = new Brand({
      name: req.body.name,
      
      _id: req.params.id
    });

    if (typeof req.file.filename !== "undefined") {
      brand.image = req.file.filename;
    }
    if (typeof req.body.description !== "undefined") {
      brand.description = req.body.description;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, brand, {});
    res.redirect(updatedBrand.url);
  } catch (err) {
    return next(err);
  }
};
