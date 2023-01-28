const Cabinet = require("../models/cabinet");
const Brand = require("../models/brand")

const fs = require("fs");
const async = require("async")
const { body, validationResult, check } = require("express-validator");

// Display list of all Cabinets.
exports.cabinet_list = function (req, res, next) {
    Cabinet.find({}, "name brand dimension type price image")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_cabinet) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("cabinet/cabinet_list", { title: "Cabinet List", cabinet_list: list_cabinet });
      });
  };


  exports.cabinet_detail = (req, res, next) => {
      Cabinet.findById(req.params.id)
          .populate('brand')
          .exec((err, cabinet) => {
              if (err) {
                  return next(err);
              }
              if (cabinet == null) {
                  const err = new Error("Cabinet not found");
                  err.status = 404;
                  return next(err);
              }
              res.render("cabinet/cabinet_detail", {
                  title: "Cabinet Detail",
                  cabinet: cabinet,
              });
          });
  };

// Display Cabinet create form on GET.
exports.cabinet_create_get = (req, res, next) => {
    Brand.find((err, brands) => {
      if(err){
        return next(err);
      }
      res.render("cabinet/cabinet_form", {
        title:"Add Cabinet",
        brands: brands,
      })
    })
};

// Handle Cabinet create on POST.
exports.cabinet_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "Cabinet name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "Cabinet brand is required").escape(),
  // Validate and sanitize the dimension field.
  body("dimension", "Cabinet dimension is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the type field.
  body("type", "Cabinet type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_5_25 field.
  body("bay_5_25", "Cabinet bay_5_25 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_3_5 field.
  body("bay_3_5", "Cabinet bay_3_5 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_2_5 field.
  body("bay_2_5", "Cabinet bay_2_5 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("price", "Cabinet price is required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cabinet object with escaped and trimmed data.
    const cabinet = new Cabinet({
      name: req.body.name,
      brand: req.body.brand,
      dimension: req.body.dimension,
      type: req.body.type,
      bay_5_25: req.body.bay_5_25,
      bay_3_5: req.body.bay_3_5,
      bay_2_5: req.body.bay_2_5,
      image: req.file.filename,
      price: req.body.price
    });
    if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        Brand.find((err, brands) => {
          if(err){
            return next(err);
          }
          res.render("cabinet/cabinet_form", {
            title:"Add Cabinet",
            brands: brands,
            cabinet,
            errors: errors.array(),
          })
        })
        return;
    } else {
        // Data from form is valid.
        // Check if Cabinet with same name already exists.
        Cabinet.findOne({ name: req.body.name }).exec((err, found_cabinet) => {
          if (err) {
              return next(err);
          }
          if (found_cabinet) {
            // Cabinet exists, redirect to its detail page.
            res.redirect(found_cabinet.url);
          } else {
            cabinet.save((err) => {
              if (err) {
                return next(err);
              }
              // Cabinet saved. Redirect to cabinet detail page.
              res.redirect(cabinet.url);
          });
          }
        });
      }
  }
];
      
      
      
      
      

    




// Display Cabinet delete form on GET.
exports.cabinet_delete_get = (req, res, next) => {
  Cabinet.findById(req.params.id)
    .exec((err, cabinet) =>{
      if(err){
        return next(err);
      }
      if(cabinet == null){
        res.redirect("/components/cabinets")
      }
      res.render("cabinet/cabinet_delete", {
        title :"Remove Cabinet",
        cabinet : cabinet,
      })
    })
};

// Handle Cabinet delete on POST.
exports.cabinet_delete_post = (req, res, next) => {
  Cabinet.findById(req.body.cabinetid)
  .exec((err, cabinet) =>{
    if (err) {
      return next(err);
    }
    if(cabinet == null){
      res.redirect("/components/cabinets")
    }
    Cabinet.findByIdAndRemove(req.body.cabinetid, (err) => {
      if (err) {
        return next(err);
      }
      if(typeof cabinet.image != undefined){
        const ImageName = "public/images/" + cabinet.image

        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}

      // Success - go to cabinet list
      res.redirect("/components/cabinets");
    })
  })
};


// Display cabinet update form on GET.
exports.cabinet_update_get = (req, res, next) => {
  async.parallel({
      cabinet(callback){
        Cabinet.findById(req.params.id)
        .populate("brand")
        .exec(callback)
      },
      cabinet_brands(callback){
        Brand.find(callback)
      }
    },
    (err, results) =>{
      if (err) {
        return next(err);
      }
      if (results.cabinet == null) {
        // No results.
        const err = new Error("cabinet not found");
        err.status = 404;
        return next(err);
    }
    for (const brand of results.cabinet_brands) {
      for (const cabinetBrand of results.cabinet.brand) {
        if (brand._id.toString() === cabinetBrand._id.toString()) {
          brand.checked = "true";
        }
      }
    }
    res.render("cabinet/cabinet_form", {
      title :"Update cabinet",
      cabinet: results.cabinet,
      brands: results.cabinet_brands
    })
  })

};

// Handle cabinet update on POST.
exports.cabinet_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "Cabinet name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "Cabinet brand is required").escape(),
  // Validate and sanitize the dimension field.
  body("dimension", "Cabinet dimension is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the type field.
  body("type", "Cabinet type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_5_25 field.
  body("bay_5_25", "Cabinet bay_5_25 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_3_5 field.
  body("bay_3_5", "Cabinet bay_3_5 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_2_5 field.
  body("bay_2_5", "Cabinet bay_2_5 is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("price", "Cabinet price is required").trim().isLength({ min: 1 }).escape(),

  // Process check().not().isEmpty().withMessage('Cabinet image is required'),request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    // Create a cabinet object with escaped/trimmed data and old id.
    const cabinet = new Cabinet({
      name:req.body.name,
      brand: req.body.brand,
      dimension: req.body.dimension,
      type: req.body.type,
      bay_5_25: req.body.bay_5_25,
      bay_3_5: req.body.bay_3_5,
      bay_2_5: req.body.bay_2_5,
      price: req.body.price,
      _id: req.params.id,
    });
    if(typeof req.file.filename != undefined){
      cabinet.image = req.file.filename;
    } 
    
    if (!errors.isEmpty()) {
      async.parallel({
        cabinet(callback){
          Cabinet.findById(req.params.id)
          .populate("brand")
          .exec(callback)
        },
        cabinet_brands(callback){
          Brand.find(callback)
        }
      },
      (err, results) =>{
        if (err) {
          return next(err);
        }
        if (results.cabinet == null) {
          // No results.
          const err = new Error("cabinet not found");
          err.status = 404;
          return next(err);
      }
      for (const brand of results.cabinet_brands) {
        for (const cabinetBrand of results.cabinet.brand) {
          if (brand._id.toString() === cabinetBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }
      if(typeof results.cabinet.image != undefined){
        const ImageName = "public/images/" + results.cabinet.image;

        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}

      res.render("cabinet/cabinet_form", {
        title :"Update cabinet",
        cabinet: results.cabinet,
        brands: results.cabinet_brands,
        cabinet,
        errors: errors.array(),
      })
    })
      return;
    }
    Cabinet.findById(req.params.id, (err, cabinet) => {
      if (err) {
        return next(err);
      }
      if(typeof cabinet.image != undefined){
        const ImageName = "public/images/" + cabinet.image;

        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}
    })

    // Data from form is valid. Update the record.
    Cabinet.findByIdAndUpdate(req.params.id, cabinet, {}, (err, thecabinet) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to cabinet detail page.
      
      res.redirect(thecabinet.url);
    });
  },
];
