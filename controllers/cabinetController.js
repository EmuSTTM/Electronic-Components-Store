const Cabinet = require("../models/cabinet");
const Brand = require("../models/brand")

const { body, validationResult } = require("express-validator");

// Display list of all Cabinets.
exports.cabinet_list = function (req, res, next) {
    Cabinet.find({}, "name brand dimension type price ")
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
exports.cabinet_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet delete GET");
};

// Handle Cabinet delete on POST.
exports.cabinet_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet delete POST");
};

// Display Cabinet update form on GET.
exports.cabinet_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet update GET");
};

// Handle Cabinet update on POST.
exports.cabinet_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet update POST");
};
