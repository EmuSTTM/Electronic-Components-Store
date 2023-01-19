const PowerSupply = require("../models/powerSupply");
const async = require("async");
const { body, validationResult } = require("express-validator");

const Brand = require("../models/brand");

// Display list of all PowerSupply.
exports.powerSupply_list = function (req, res, next) {
    PowerSupply.find({}, "name brand model power certifications price")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_powerSupply) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("powerSupply/powerSupply_list", { title: "PowerSupply List", powerSupply_list: list_powerSupply });
      });
  };
// El campo name es requerido y debe ser una cadena de caracteres
// El campo brand es una clave foranea hacia el esquema Brand, es requerido
// El campo model es requerido y debe ser una cadena de caracteres
// El campo power es requerido, debe ser un número y debe ser mayor a 0
// El campo certifications es un arreglo de strings, con una lista de valores posibles y su valor default.
// El campo price es requerido, debe ser un número y debe ser mayor a 0


// Display detail page for a specific PowerSupply.
exports.powerSupply_detail = (req, res, next) => {
    PowerSupply.findById(req.params.id)
    .populate("brand")
    .exec(
  (err, powerSupply) => {
    if(err){
      return next(err);
    }
    if(powerSupply == null){
      // No results
      const err = new Error("Power Supply not found");
      err.status = 404;
      return next(err);
    }
    // Todo sucedió correctamente
    res.render("powerSupply/powerSupply_detail",{
      title:"Power Supply Detail",
      powerSupply: powerSupply,
      powerSupply_brand: powerSupply.brand,
    })
  })
};

// Display PowerSupply create form on GET.
exports.powerSupply_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if(err){
      return next(err);
    }
    res.render("powerSupply/powerSupply_form", {
      title:"Add powerSupply",
      brands: brands,
    })
  })
};

// Handle PowerSupply create on POST.
exports.powerSupply_create_post = [ 
  // Convert the brand to an array.  
(req, res, next) => {    
 if (!Array.isArray(req.body.brand)) {
   req.body.brand = typeof req.body.brand === "undefined" ? [] : [req.body.brand];
   }
   next();
 },
 // Validate and sanitize the name field.
 body("name", "PowerSupply name is required")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 // Validate and sanitize the brand field.
 body("brand.*", "powerSupply brand is required").escape(),
 // Validate and sanitize the model field.
 body("model", "model is required").trim().isLength({ min: 1 }).escape(),
 // Validate and sanitize the power field.
 body("power", "Power is required").trim().isLength({ min: 1 }).escape(),
 // Validate and sanitize the certifications field.
 body("certifications", "Certification is required").trim().isLength({ min: 3 }).escape(),
 // Validate and sanitize the price field.
 body("price", "powerSupply price is required").trim().isLength({ min: 1 }).escape(),
 // Process request after validation and sanitization.
 (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   // Create a powerSupply object with escaped and trimmed data.
   const powerSupply = new  PowerSupply({
     name: req.body.name,
     brand: req.body.brand,
     model: req.body.model,
     power: req.body.power,
     certifications: req.body.certifications,
     price: req.body.price
   });

   if (!errors.isEmpty()) {
       // There are errors. Render the form again with sanitized values/error messages.
       Brand.find((err, brands) => {
         if(err){
           return next(err);
         }
         res.render("powerSupply/powerSupply_form", {
           title:"Add powerSupply",
           brands: brands,
           powerSupply,
           errors: errors.array(),
         })
       })
       return;
   } else {
       // Data from form is valid.
       // Check if powerSupply with same name already exists.
        PowerSupply.findOne({ name: req.body.name }).exec((err, found_powerSupply) => {
         if (err) {
             return next(err);
         }
         if (found_powerSupply) {
           // powerSupply exists, redirect to its detail page.
           res.redirect(found_powerSupply.url);
         } else {
           powerSupply.save((err) => {
             if (err) {
               return next(err);
               }
               // powerSupplysaved. Redirect to powerSupply detail page.
               res.redirect(powerSupply.url);
               });
           }
         });
       }
 }
];

// Display PowerSupply delete form on GET.
exports.powerSupply_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply delete GET");
};

// Handle PowerSupply delete on POST.
exports.powerSupply_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply delete POST");
};

// Display PowerSupply update form on GET.
exports.powerSupply_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply update GET");
};

// Handle PowerSupply update on POST.
exports.powerSupply_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply update POST");
};
