const RAM = require("../models/ram");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const async = require("async");
const { body, validationResult } = require("express-validator");
const fs = require("fs");



// Display list of all Ram. // brand model size speed type price
exports.ram_list = function (req, res, next) {
    RAM.find({}, "brand model size speed type price name image")
      .sort({ speed: 1 })
      .populate("brand")
      .exec(function (err, list_ram) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("ram/ram_list", { title: "Ram List", ram_list: list_ram });
      });
  };

// Display detail page for a specific Ram.
exports.ram_detail = (req, res, next) => {
  RAM.findById(req.params.id)
  .populate("brand")
  .exec(
(err, ramSchema) => {
  if(err){
    return next(err);
  }
  if(ramSchema == null){
    // No results
    const err = new Error("RAM not found");
    err.status = 404;
    return next(err);
  }
  // Todo sucedió correctamente
  res.render("ram/ram_detail",{
    title:"RAM Detail",
    ram: ramSchema,
  })
})
};

// // Display detail page for a specific ram.
// exports.ram_detail = (req, res, next) => {
//   ram.findById(req.params.id)
//   .populate("brand")
//   .exec(
// (err, ram) => {
//   if(err){
//     return next(err);
//   }
//   if(ram == null){
//     // No results
//     const err = new Error("speed Supply not found");
//     err.status = 404;
//     return next(err);
//   }
//   // Todo sucedió correctamente
//   res.render("ram/ram_detail",{
//     title:"speed Supply Detail",
//     ram: ram,
//   })
// })
// };

// Display Ram create form on GET.
exports.ram_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if(err){
      return next(err);
    }
    res.render("ram/ram_form", {
      title:"Add Ram",
      brands: brands,
    })
  })
};
// Handle Ram create on POST.
exports.ram_create_post = [ 
  // Convert the brand to an array.  
(req, res, next) => {    
 if (!Array.isArray(req.body.brand)) {
   req.body.brand = typeof req.body.brand === "undefined" ? [] : [req.body.brand];
   }
   next();
 },
 // Validate and sanitize the name field.
 body("name", "ram name is required")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 // Validate and sanitize the brand field.
 body("brand.*", "ram brand is required").escape(),
 // Validate and sanitize the model field.
 body("model", "model is required").trim().isLength({ min: 1 }).escape(),
 // Validate and sanitize the speed field.
 body("speed", "speed is required").trim().isLength({ min: 1 }).escape(),
 // Validate and sanitize the type field.
 body("type", "type is required").trim().isLength({ min: 3 }).escape(),
 // Validate and sanitize the price field.
 body("price", "ram price is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("size", "size is required").trim().isLength({ min: 1 }).escape(),
 // Process request after validation and sanitization.
 (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   // Create a ram object with escaped and trimmed data.
   const ram = new  RAM({
     name: req.body.name,
     brand: req.body.brand,
     model: req.body.model,
     speed: req.body.speed,
     type: req.body.type,
     price: req.body.price,
     size:req.body.size,
   });
   if (!req.file) {
      ram.image = req.file.filename;
   }

   if (!errors.isEmpty()) {
       // There are errors. Render the form again with sanitized values/error messages.
       Brand.find((err, brands) => {
         if(err){
           return next(err);
         }
         res.render("ram/ram_form", {
           title:"Add ram",
           brands: brands,
           ram,
           errors: errors.array(),
         })
       })
       return;
   } else {
       // Data from form is valid.
       // Check if ram with same name already exists.
        RAM.findOne({ name: req.body.name }).exec((err, found_ram) => {
         if (err) {
             return next(err);
         }
         if (found_ram) {
           // ram exists, redirect to its detail page.
           res.redirect(found_ram.url);
         } else {
           ram.save((err) => {
             if (err) {
               return next(err);
               }
               // ramsaved. Redirect to ram detail page.
               res.redirect(ram.url);
               });
           }
         });
       }
 }
];

// Display ram delete form on GET.
exports.ram_delete_get = (req, res, next) => {
  async.parallel({
    ram(callback) {
      RAM.findById(req.params.id).exec(callback)
    },
    ram_computers(callback){
      Computer.find({ ram:  req.params.id }).exec(callback);
    },
  },
  (err, results) => {
      if(err) {
        return next(err);
      }
      if(results.ram == null){
        res.redirect("/components/rams")
      }
      res.render("ram/ram_delete", {
        title :"Remove ram",
        ram : results.ram,
        ram_computers: results.ram_computers,
      })
    }
  )
};

// Handle ram delete on POST.
exports.ram_delete_post = (req, res, next) => {
  async.parallel({
    ram(callback) {
      RAM.findById(req.body.ramid).exec(callback)
    },
    ram_computers(calblack){
      Computer.find({ ram: req.body.ramid  }).exec(callback);
    },
  },
  (err, results) => {
    if (err) {
      return next(err);
    }

    if(results.ram == null) {
      res.redirect("/components/rams")
    }

    if(results.ram_computers.length > 0 ){
      res.render("ram/ram_delete", {
        title :"Remove ram",
        ram : results.ram,
        ram_computers: results.ram_computers,
      })
    }

    RAM.findByIdAndRemove(req.body.ramid, (err) => {
      if (err) {
        return next(err);
      }
      if(typeof results.ram.image != undefined){
        const ImageName = "public/images/" + results.ram.image

        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}

      // Success - go to ram list
      res.redirect("/components/rams");
    })
  })
};

// Display ram update form on GET.
exports.ram_update_get = (req, res, next) => {
  async.parallel({
      ram(callback){
        RAM.findById(req.params.id)
        .populate("brand")
        .exec(callback)
      },
      ram_brands(callback){
        Brand.find(callback)
      }
    },
    (err, results) =>{
      if (err) {
        return next(err);
      }
      if (results.ram == null) {
        // No results.
        const err = new Error("ram not found");
        err.status = 404;
        return next(err);
    }
    for (const brand of results.ram_brands) {
      for (const ramBrand of results.ram.brand) {
        if (brand._id.toString() === ramBrand._id.toString()) {
          brand.checked = "true";
        }
      }
    }
    res.render("ram/ram_form", {
      title :"Update ram",
      ram: results.ram,
      brands: results.ram_brands
    })
  })

};

// Handle ram update on POST.
exports.ram_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
// Validate and sanitize the name field.
  body("name", "ram name is required")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "ram brand is required").escape(),
  // Validate and sanitize the model field.
  body("model", "model is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the speed field.
  body("speed", "speed is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the type field.
  body("type", "type is required").trim().isLength({ min: 3 }).escape(),
  // Validate and sanitize the price field.
  body("price", "ram price is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("size", "size is required").trim().isLength({ min: 1 }).escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a ram object with escaped/trimmed data and old id.
    const ram = new RAM({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      speed: req.body.speed,
      type: req.body.type,
      price: req.body.price,
      size:req.body.size,
      _id: req.params.id,
    });

    if (typeof req.file !== 'undefined') {
      ram.image = req.file.filename;
    } else {
      ram.image = req.body.last_image;
    }
    

    if (!errors.isEmpty()) {
      async.parallel({
        ram(callback){
          RAM.findById(req.params.id)
          .populate("brand")
          .exec(callback)
        },
        ram_brands(callback){
          Brand.find(callback)
        }
      },
      (err, results) =>{
        if (err) {
          return next(err);
        }
        if (results.ram == null) {
          // No results.
          const err = new Error("ram not found");
          err.status = 404;
          return next(err);
      }
      for (const brand of results.ram_brands) {
        for (const ramBrand of results.ram.brand) {
          if (brand._id.toString() === ramBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }
      if(typeof results.ram.image != undefined && typeof req.file != 'undefined'){
        const ImageName = "public/images/" + results.ram.image;
  
        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}
      res.render("ram/ram_form", {
        title :"Update ram",
        ram: results.ram,
        brands: results.ram_brands,
        ram,
        errors: errors.array(),
      })
    })
      return;
    }
    RAM.findById(req.params.id, (err, ram) => {
      if (err) {
        return next(err);
      }
      if(typeof ram.image != undefined && typeof req.file != 'undefined'){
        const ImageName = "public/images/" + ram.image;

        if(fs.existsSync(ImageName)){
          fs.unlinkSync(ImageName);
      }}
    })
    // Data from form is valid. Update the record.
    RAM.findByIdAndUpdate(req.params.id, ram, {}, (err, theram) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to ram detail page.
      
      res.redirect(theram.url);
    });
  },
];
