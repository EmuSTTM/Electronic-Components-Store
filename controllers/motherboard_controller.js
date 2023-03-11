const Motherboard = require("../models/motherboard");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const { body, validationResult } = require("express-validator");

const async = require("async");


// Configuraciones necesarias para añadir y eliminar imagenes. 
const deleteImage = require("../models/image");
const  { appConfig } = require('../config');
const { host } = appConfig;


// Display list of all Motherboards.
exports.motherboard_list = function (req, res, next) {
  Motherboard.find({}, "name brand chipset ram_slots max_ram price image")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_motherboard) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("motherboard/motherboard_list", {
        title: "Motherboard List",
        session: req.session,
        motherboard_list: list_motherboard,
      });
    });
};



// Display detail page for a specific Motherboard.
exports.motherboard_detail = (req, res, next) => {
  Motherboard.findById(req.params.id)
    .populate("brand")
    .exec((err, motherboard) => {
      if (err) {
        return next(err);
      }
      if (motherboard == null) {
        // No results
        const err = new Error("Motherboard not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("motherboard/motherboard_detail", {
        title: "Motherboard Detail",
        motherboard: motherboard,
        session: req.session,
        motherboard_brand: motherboard.brand,
      });
    });
};

// Display Motherboard create form on GET.
exports.motherboard_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("motherboard/motherboard_form", {
      title: "Add Motherboard",
      session: req.session,
      brands: brands,
    });
  });
};

// Handle Motherboard create on POST.
exports.motherboard_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the fields.
  body("name", "Motherboard name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand.*", "Motherboard brand is required").escape(),
  body("chipset", "Chipset is required").trim().isLength({ min: 1 }).escape(),
  body("ram_slots", "Ram slots is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("max_ram", "Max Ram is required").trim().isLength({ min: 1 }).escape(),
  body("price", "Motherboard price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("frecuency_ram", "Frecuency Ram is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("socket", "Socket is required").trim().isLength({ min: 1 }).escape(),
  body("socket_ram", "Socket RAM is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type", "Motherboard type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("sockets_v2", "Sockets V2 are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("sockets_sata", "Sockets SATA are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Motherboard object with escaped and trimmed data.
    const motherboard = new Motherboard({
      name: req.body.name,
      brand: req.body.brand,
      chipset: req.body.chipset,
      ram_slots: req.body.ram_slots,
      max_ram: req.body.max_ram,
      price: req.body.price,
      frecuency_ram: req.body.frecuency_ram,
      socket: req.body.socket,
      type: req.body.type,
      socket_ram: req.body.socket_ram,
      sockets_sata: req.body.sockets_sata,
      sockets_v2: req.body.sockets_v2,
    });

    if (typeof req.file !== "undefined") {
      motherboard.image = `${host}/image/${req.file.filename}`;
      motherboard.imgId = req.file.id;
    } 

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("motherboard/motherboard_form", {
          title: "Add Motherboard",
          brands: brands,
          motherboard,
          session: req.session,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if motherboard with same name already exists.
      Motherboard.findOne({ name: req.body.name }).exec(
        (err, found_motherboard) => {
          if (err) {
            return next(err);
          }
          if (found_motherboard) {
            // Motherboard exists, redirect to its detail page.
            res.redirect(found_motherboard.url);
          } else {
            motherboard.save((err) => {
              if (err) {
                return next(err);
              }
              // Motherboardsaved. Redirect to Motherboard detail page.
              res.redirect(motherboard.url);
            });
          }
        }
      );
    }
  },
];

// Display motherboard delete form on GET.
exports.motherboard_delete_get = (req, res, next) => {
  async.parallel(
    {
      motherboard(callback) {
        Motherboard.findById(req.params.id).exec(callback);
      },
      motherboard_computers(callback) {
        Computer.find({ motherboard: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.motherboard == null) {
        res.redirect("/components/motherboards");
      }
      res.render("motherboard/motherboard_delete", {
        title: "Remove motherboard",
        motherboard: results.motherboard,
        session: req.session,
        motherboard_computers: results.motherboard_computers,
      });
    }
  );
};

// Handle motherboard delete on POST.
exports.motherboard_delete_post = (req, res, next) => {
  async.parallel(
    {
      motherboard(callback) {
        Motherboard.findById(req.body.motherboardid).exec(callback);
      },
      motherboard_computers(callback) {
        Computer.find({ motherboard: req.body.motherboardid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.motherboard == null) {
        res.redirect("/components/motherboards");
      }

      if (results.motherboard_computers.length > 0) {
        res.render("motherboard/motherboard_delete", {
          title: "Remove motherboard",
          motherboard: results.motherboard,
          session: req.session,
          motherboard_computers: results.motherboard_computers,
        });
      }

      Motherboard.findByIdAndRemove(req.body.motherboardid, (err) => {
        if (err) {
          return next(err);
        }
        if (
          typeof results.motherboard.image != undefined &&
          typeof results.motherboard.imgId != "undefined"
        ) {
          deleteImage(results.motherboard.imgId)
        }

        // Success - go to motherboard list
        res.redirect("/components/motherboards");
      });
    }
  );
};

// Display motherboard update form on GET.
exports.motherboard_update_get = (req, res, next) => {
  async.parallel(
    {
      motherboard(callback) {
        Motherboard.findById(req.params.id).populate("brand").exec(callback);
      },
      motherboard_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.motherboard == null) {
        // No results.
        const err = new Error("motherboard not found");
        err.status = 404;
        return next(err);
      }
      for (const brand of results.motherboard_brands) {
        for (const motherboardBrand of results.motherboard.brand) {
          if (brand._id.toString() === motherboardBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }

      res.render("motherboard/motherboard_form", {
        title: "Update motherboard",
        motherboard: results.motherboard,
        session: req.session,
        brands: results.motherboard_brands,
      });
    }
  );
};

// Handle Motherboard update on POST.
exports.motherboard_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "Motherboard name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand.*", "Motherboard brand is required").escape(),
  body("chipset", "Chipset is required").trim().isLength({ min: 1 }).escape(),
  body("ram_slots", "Ram slots is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("max_ram", "Max Ram is required").trim().isLength({ min: 1 }).escape(),
  body("price", "Motherboard price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("frecuency_ram", "Frecuency Ram is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("socket", "Socket is required").trim().isLength({ min: 1 }).escape(),
  body("socket_ram", "Socket Ram is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type", "Motherboard type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("sockets_v2", "Sockets V2 are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("sockets_sata", "Sockets SATA are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a motherboard object with escaped/trimmed data and old id.
    const motherboard = new Motherboard({
      name: req.body.name,
      brand: req.body.brand,
      chipset: req.body.chipset,
      ramSlots: req.body.ram_slots,
      maxRam: req.body.max_ram,
      price: req.body.price,
      frecuency_ram: req.body.frecuency_ram,
      socket: req.body.socket,
      socket_ram: req.body.socket_ram,
      sockets_sata: req.body.sockets_sata,
      sockets_v2: req.body.sockets_v2,
      type: req.body.type,

      _id: req.params.id,
    });

    if (typeof req.file !== "undefined") {
      motherboard.image = `${host}/image/${req.file.filename}`;
      motherboard.imgId = req.file.id;
    } else {
      motherboard.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          motherboard(callback) {
            Motherboard.findById(req.params.id)
              .populate("brand")
              .exec(callback);
          },
          motherboard_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.motherboard == null) {
            // No results.
            const err = new Error("motherboard not found");
            err.status = 404;
            return next(err);
          }
          for (const brand of results.motherboard_brands) {
            for (const motherboardBrand of results.motherboard.brand) {
              if (brand._id.toString() === motherboardBrand._id.toString()) {
                brand.checked = "true";
              }
            }
          }
          if (
            typeof results.motherboard.image != undefined &&
            typeof results.motherboard.imgId != "undefined" &&
            typeof req.file != "undefined"
          ) {
            deleteImage(results.motherboard.imgId)
          }
          res.render("motherboard/motherboard_form", {
            title: "Update motherboard",
            motherboard: results.motherboard,
            session: req.session,
            brands: results.motherboard_brands,
            motherboard,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    Motherboard.findById(req.params.id, (err, motherboard) => {
      if (err) {
        return next(err);
      }
      if (
        typeof motherboard.image != undefined &&
        typeof req.file != "undefined" &&
        typeof motherboard.imgId != "undefined"
      ) {
        deleteImage(motherboard.imgId)
      }
    });

    // Data from form is valid. Update the record.
    Motherboard.findByIdAndUpdate(
      req.params.id,
      motherboard,
      {},
      (err, themotherboard) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to motherboard detail page.

        res.redirect(themotherboard.url);
      }
    );
  },
];
