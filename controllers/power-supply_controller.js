const PowerSupply = require("../models/power-supply");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const async = require("async");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

// Display list of all PowerSupply.
exports.powerSupply_list = function (req, res, next) {
  PowerSupply.find({}, "name brand model power certification price image")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_powerSupply) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("powerSupply/powerSupply_list", {
        title: "PowerSupply List",
        session: req.session,
        powerSupply_list: list_powerSupply,
      });
    });
};
// El campo name es requerido y debe ser una cadena de caracteres
// El campo brand es una clave foranea hacia el esquema Brand, es requerido
// El campo model es requerido y debe ser una cadena de caracteres
// El campo power es requerido, debe ser un número y debe ser mayor a 0
// El campo certification es un arreglo de strings, con una lista de valores posibles y su valor default.
// El campo price es requerido, debe ser un número y debe ser mayor a 0

// Display detail page for a specific PowerSupply.
exports.powerSupply_detail = (req, res, next) => {
  PowerSupply.findById(req.params.id)
    .populate("brand")
    .exec((err, powerSupply) => {
      if (err) {
        return next(err);
      }
      if (powerSupply == null) {
        // No results
        const err = new Error("Power Supply not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("powerSupply/powerSupply_detail", {
        title: "Power Supply Detail",
        powerSupply: powerSupply,
        session: req.session,
        powerSupply_brand: powerSupply.brand,
      });
    });
};

// Display PowerSupply create form on GET.
exports.powerSupply_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("powerSupply/powerSupply_form", {
      title: "Add powerSupply",
      session: req.session,
      brands: brands,
    });
  });
};

// Handle PowerSupply create on POST.
exports.powerSupply_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
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
  // Validate and sanitize the certification field.
  body("certification", "Certification is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Validate and sanitize the price field.
  body("price", "powerSupply price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a powerSupply object with escaped and trimmed data.
    const powerSupply = new PowerSupply({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      power: req.body.power,
      certification: req.body.certification,
      price: req.body.price,
      image: req.file.filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("powerSupply/powerSupply_form", {
          title: "Add powerSupply",
          brands: brands,
          session: req.session,
          powerSupply,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if powerSupply with same name already exists.
      PowerSupply.findOne({ name: req.body.name }).exec(
        (err, found_powerSupply) => {
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
              // powerSupply saved. Redirect to powerSupply detail page.
              res.redirect(powerSupply.url);
            });
          }
        }
      );
    }
  },
];

// Display powerSupply delete form on GET.
exports.powerSupply_delete_get = (req, res, next) => {
  async.parallel(
    {
      powerSupply(callback) {
        PowerSupply.findById(req.params.id).exec(callback);
      },
      powerSupply_computers(callback) {
        Computer.find({ powerSupply: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.powerSupply == null) {
        res.redirect("/components/powerSupplies");
      }
      res.render("powerSupply/powerSupply_delete", {
        title: "Remove powerSupply",
        powerSupply: results.powerSupply,
        session: req.session,
        powerSupply_computers: results.powerSupply_computers,
      });
    }
  );
};

// Handle powerSupply delete on POST.
exports.powerSupply_delete_post = (req, res, next) => {
  async.parallel(
    {
      powerSupply(callback) {
        powerSupply.findById(req.body.powerSupplyid).exec(callback);
      },
      powerSupply_computers(calblack) {
        Computer.find({ powerSupply: req.body.powerSupplyid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.powerSupply == null) {
        res.redirect("/components/powerSupplies");
      }

      if (results.powerSupply_computers.length > 0) {
        res.render("powerSupply/powerSupply_delete", {
          title: "Remove powerSupply",
          powerSupply: results.powerSupply,
          session: req.session,
          powerSupply_computers: results.powerSupply_computers,
        });
      }

      powerSupply.findByIdAndRemove(req.body.powerSupplyid, (err) => {
        if (err) {
          return next(err);
        }
        if (typeof results.powerSupply.image != undefined) {
          const ImageName = "public/images/" + results.powerSupply.image;

          if (fs.existsSync(ImageName)) {
            fs.unlinkSync(ImageName);
          }
        }

        // Success - go to powerSupply list
        res.redirect("/components/powerSupplies");
      });
    }
  );
};

// Display PowerSupply update form on GET.
exports.powerSupply_update_get = (req, res, next) => {
  async.parallel(
    {
      powerSupply(callback) {
        PowerSupply.findById(req.params.id).populate("brand").exec(callback);
      },
      powerSupply_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.powerSupply == null) {
        // No results.
        const err = new Error("powerSupply not found");
        err.status = 404;
        return next(err);
      }
      for (const brand of results.powerSupply_brands) {
        for (const powerSupplyBrand of results.powerSupply.brand) {
          if (brand._id.toString() === powerSupplyBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }
      res.render("powerSupply/powerSupply_form", {
        title: "Update powerSupply",
        powerSupply: results.powerSupply,
        session: req.session,
        brands: results.powerSupply_brands,
      });
    }
  );
};

// Handle powerSupply update on POST.
exports.powerSupply_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
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
  // Validate and sanitize the certification field.
  body("certification", "Certification is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Validate and sanitize the price field.
  body("price", "powerSupply price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a powerSupply object with escaped/trimmed data and old id.
    const powerSupply = new PowerSupply({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      power: req.body.power,
      certification: req.body.certification,
      price: req.body.price,
      _id: req.params.id,
    });

    if (typeof req.file !== "undefined") {
      powerSupply.image = req.file.filename;
    } else {
      powerSupply.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          powerSupply(callback) {
            PowerSupply.findById(req.params.id)
              .populate("brand")
              .exec(callback);
          },
          powerSupply_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.powerSupply == null) {
            // No results.
            const err = new Error("powerSupply not found");
            err.status = 404;
            return next(err);
          }
          for (const brand of results.powerSupply_brands) {
            for (const powerSupplyBrand of results.powerSupply.brand) {
              if (brand._id.toString() === powerSupplyBrand._id.toString()) {
                brand.checked = "true";
              }
            }
          }
          if (
            typeof results.powerSupply.image != undefined &&
            typeof req.file != "undefined"
          ) {
            const ImageName = "public/images/" + results.powerSupply.image;

            if (fs.existsSync(ImageName)) {
              fs.unlinkSync(ImageName);
            }
          }
          res.render("powerSupply/powerSupply_form", {
            title: "Update powerSupply",
            powerSupply: results.powerSupply,
            session: req.session,
            brands: results.powerSupply_brands,
            powerSupply,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    PowerSupply.findById(req.params.id, (err, powerSupply) => {
      if (err) {
        return next(err);
      }
      if (
        typeof powerSupply.image != undefined &&
        typeof req.file != "undefined"
      ) {
        const ImageName = "public/images/" + powerSupply.image;

        if (fs.existsSync(ImageName)) {
          fs.unlinkSync(ImageName);
        }
      }
    });
    // Data from form is valid. Update the record.
    PowerSupply.findByIdAndUpdate(
      req.params.id,
      powerSupply,
      {},
      (err, thepowerSupply) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to powerSupply detail page.

        res.redirect(thepowerSupply.url);
      }
    );
  },
];
