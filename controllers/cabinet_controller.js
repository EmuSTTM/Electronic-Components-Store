const Cabinet = require("../models/cabinet");
const Brand = require("../models/brand");
const Computer = require("../models/computer");


const async = require("async");
const { body, validationResult, check } = require("express-validator");

// Configuraciones necesarias para añadir y eliminar imagenes. 
const deleteImage = require("../models/image");
const  { appConfig } = require('../config');
const { host } = appConfig;


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
      res.render("cabinet/cabinet_list", {
        title: "Cabinet List",
        cabinet_list: list_cabinet,
        session: req.session,
      });
    });
};

exports.cabinet_detail = (req, res, next) => {
  Cabinet.findById(req.params.id)
    .populate("brand")
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
        session: req.session,
      });
    });
};

// Display Cabinet create form on GET.
exports.cabinet_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("cabinet/cabinet_form", {
      title: "Add Cabinet",
      brands: brands,
      session: req.session,
    });
  });
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
  body("name", "Cabinet name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "Cabinet brand is required").escape(),
  // Validate and sanitize the dimension field.
  body("dimension", "Cabinet dimension is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the type field.
  body("type", "Cabinet type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_5_25 field.
  body("bay_5_25", "Cabinet bay_5_25 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the bay_3_5 field.
  body("bay_3_5", "Cabinet bay_3_5 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the bay_2_5 field.
  body("bay_2_5", "Cabinet bay_2_5 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the price field.
  body("price", "Cabinet price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

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
      price: req.body.price,
    });

    if (typeof req.file !== "undefined") {
      cabinet.image = `${host}/image/${req.file.filename}`;
      cabinet.imgId = req.file.id;
    } 
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("cabinet/cabinet_form", {
          title: "Add Cabinet",
          brands: brands,
          cabinet,
          errors: errors.array(),
          session: req.session,
        });
      });
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
  },
];

// Display Cabinet delete form on GET.
exports.cabinet_delete_get = (req, res, next) => {
  async.parallel(
    {
      cabinet(callback) {
        Cabinet.findById(req.params.id).exec(callback);
      },
      cabinet_computers(callback) {
        Computer.find({ cabinet: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.cabinet == null) {
        res.redirect("/components/cabinets");
      }
      res.render("cabinet/cabinet_delete", {
        title: "Remove Cabinet",
        cabinet: results.cabinet,
        cabinet_computers: results.cabinet_computers,
        session: req.session,
      });
    }
  );
};

// Handle Cabinet delete on POST.
exports.cabinet_delete_post = (req, res, next) => {
  async.parallel(
    {
      cabinet(callback) {
        Cabinet.findById(req.body.cabinetid).exec(callback);
      },
      cabinet_computers(callback) {
        Computer.find({ cabinet: req.body.cabinetid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.cabinet == null) {
        res.redirect("/components/cabinets");
      }

      if (results.cabinet_computers.length > 0) {
        res.render("cabinet/cabinet_delete", {
          title: "Remove Cabinet",
          cabinet: results.cabinet,
          cabinet_computers: results.cabinet_computers,
          session: req.session,
        });
      }

      Cabinet.findByIdAndRemove(req.body.cabinetid, (err) => {
        if (err) {
          return next(err);
        }
        if (
          typeof results.cabinet.image != undefined &&
          typeof results.cabinet.imgId != "undefined"
        ) {
          deleteImage(results.cabinet.imgId)
        }

        // Success - go to cabinet list
        res.redirect("/components/cabinets");
      });
    }
  );
};

// Display cabinet update form on GET.
exports.cabinet_update_get = (req, res, next) => {
  async.parallel(
    {
      cabinet(callback) {
        Cabinet.findById(req.params.id).populate("brand").exec(callback);
      },
      cabinet_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
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
        title: "Update cabinet",
        cabinet: results.cabinet,
        brands: results.cabinet_brands,
        session: req.session,
      });
    }
  );
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
  body("name", "Cabinet name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "Cabinet brand is required").escape(),
  // Validate and sanitize the dimension field.
  body("dimension", "Cabinet dimension is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the type field.
  body("type", "Cabinet type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the bay_5_25 field.
  body("bay_5_25", "Cabinet bay_5_25 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the bay_3_5 field.
  body("bay_3_5", "Cabinet bay_3_5 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the bay_2_5 field.
  body("bay_2_5", "Cabinet bay_2_5 is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the price field.
  body("price", "Cabinet price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cabinet object with escaped/trimmed data and old id.
    const cabinet = new Cabinet({
      name: req.body.name,
      brand: req.body.brand,
      dimension: req.body.dimension,
      type: req.body.type,
      bay_5_25: req.body.bay_5_25,
      bay_3_5: req.body.bay_3_5,
      bay_2_5: req.body.bay_2_5,
      price: req.body.price,
      _id: req.params.id,
    });
    if (typeof req.file !== "undefined") {
      cabinet.image = `${host}/image/${req.file.filename}`;
      cabinet.imgId = req.file.id;
    } else {
      cabinet.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          cabinet(callback) {
            Cabinet.findById(req.params.id).populate("brand").exec(callback);
          },
          cabinet_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
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
          if (
            typeof results.cabinet.image != undefined &&
            typeof req.file != "undefined" &&
            typeof results.cabinet.imgId != "undefined"
          ) {
            deleteImage(results.cabinet.imgId)
          }

          res.render("cabinet/cabinet_form", {
            title: "Update cabinet",
            cabinet: results.cabinet,
            brands: results.cabinet_brands,
            cabinet,
            errors: errors.array(),
            session: req.session,
          });
        }
      );
      return;
    }
    Cabinet.findById(req.params.id, (err, cabinet) => {
      if (err) {
        return next(err);
      }
      if (
        typeof cabinet.image != undefined &&
        typeof req.file != "undefined" &&
        typeof cabinet.imgId != "undefined"
      ) {
        deleteImage(cabinet.imgId)
      }
    });

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
