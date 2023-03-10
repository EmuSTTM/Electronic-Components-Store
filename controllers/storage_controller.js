const Storage = require("../models/storage");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const async = require("async");
const { body, validationResult } = require("express-validator");



// Configuraciones necesarias para añadir y eliminar imagenes. 
const deleteImage = require("../models/image");
const  { appConfig } = require('../config');
const { host } = appConfig;

// Display list of all Storage.
exports.storage_list = function (req, res, next) {
  Storage.find({}, "name brand type speed price image")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_storage) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("storage/storage_list", {
        title: "Storage List",
        session: req.session,
        storage_list: list_storage,
      });
    });
};



// Display detail page for a specific Storage.
exports.storage_detail = (req, res) => {
  Storage.findById(req.params.id)
    .populate("brand")
    .exec((err, storage) => {
      if (err) {
        return next(err);
      }
      if (storage == null) {
        // No results
        const err = new Error("Storage not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("storage/storage_detail", {
        title: "Storage Detail",
        session: req.session,
        storage: storage,
      });
    });
};

// Display Storage create form on GET.
exports.storage_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("storage/storage_form", {
      title: "Add storage",
      session: req.session,
      brands: brands,
    });
  });
};

// Handle Storage create on POST.
exports.storage_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "storage name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "storage brand is required").escape(),
  // Validate and sanitize the type field.
  body("type", "type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the capacity field.
  body("capacity", "capacity is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the speed field.
  body("speed", "speed is required").trim().isLength({ min: 3 }).escape(),
  // Validate and sanitize the price field.
  body("price", "storage price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a storage object with escaped and trimmed data.
    const storage = new Storage({
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      capacity: req.body.capacity,
      speed: req.body.speed,
      price: req.body.price,
    });

    if (typeof req.file !== "undefined") {
      storage.image = `${host}/image/${req.file.filename}`;
      storage.imgId = req.file.id;
    } 

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("storage/storage_form", {
          title: "Add storage",
          session: req.session,
          brands: brands,
          storage,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if storage with same name already exists.
      Storage.findOne({ name: req.body.name }).exec((err, found_storage) => {
        if (err) {
          return next(err);
        }
        if (found_storage) {
          // storage exists, redirect to its detail page.
          res.redirect(found_storage.url);
        } else {
          storage.save((err) => {
            if (err) {
              return next(err);
            }
            // storagesaved. Redirect to storage detail page.
            res.redirect(storage.url);
          });
        }
      });
    }
  },
];

// Display storage delete form on GET.
exports.storage_delete_get = (req, res, next) => {
  async.parallel(
    {
      storage(callback) {
        Storage.findById(req.params.id).exec(callback);
      },
      storage_computers(callback) {
        Computer.find({ storage: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.storage == null) {
        res.redirect("/components/storages");
      }
      res.render("storage/storage_delete", {
        title: "Remove storage",
        storage: results.storage,
        session: req.session,
        storage_computers: results.storage_computers,
      });
    }
  );
};

// Handle storage delete on POST.
exports.storage_delete_post = (req, res, next) => {
  async.parallel(
    {
      storage(callback) {
        Storage.findById(req.body.storageid).exec(callback);
      },
      storage_computers(callback) {
        Computer.find({ storage: req.body.storageid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.storage == null) {
        res.redirect("/components/storages");
      }

      if (results.storage_computers.length > 0) {
        res.render("storage/storage_delete", {
          title: "Remove storage",
          session: req.session,
          storage: results.storage,
          storage_computers: results.storage_computers,
        });
      }

      Storage.findByIdAndRemove(req.body.storageid, (err) => {
        if (err) {
          return next(err);
        }
        if (
          typeof results.storage.image != undefined &&
          typeof results.storage.imgId != "undefined"
        ) {
          deleteImage(results.storage.imgId)
        }

        // Success - go to storage list
        res.redirect("/components/storages");
      });
    }
  );
};

// Display storage update form on GET.
exports.storage_update_get = (req, res, next) => {
  async.parallel(
    {
      storage(callback) {
        Storage.findById(req.params.id).populate("brand").exec(callback);
      },
      storage_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.storage == null) {
        // No results.
        const err = new Error("storage not found");
        err.status = 404;
        return next(err);
      }
      for (const brand of results.storage_brands) {
        for (const storageBrand of results.storage.brand) {
          if (brand._id.toString() === storageBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }
      res.render("storage/storage_form", {
        title: "Update storage",
        storage: results.storage,
        session: req.session,
        brands: results.storage_brands,
      });
    }
  );
};

// Handle storage update on POST.
exports.storage_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "storage name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "storage brand is required").escape(),
  // Validate and sanitize the type field.
  body("type", "type is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the capacity field.
  body("capacity", "capacity is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the speed field.
  body("speed", "speed is required").trim().isLength({ min: 3 }).escape(),
  // Validate and sanitize the price field.
  body("price", "storage price is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a storage object with escaped/trimmed data and old id.
    const storage = new Storage({
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      capacity: req.body.capacity,
      speed: req.body.speed,
      price: req.body.price,
      _id: req.params.id,
    });

    if (typeof req.file !== "undefined") {
      storage.image = `${host}/image/${req.file.filename}`;
      storage.imgId = req.file.id;
    } else {
      storage.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          storage(callback) {
            Storage.findById(req.params.id).populate("brand").exec(callback);
          },
          storage_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.storage == null) {
            // No results.
            const err = new Error("storage not found");
            err.status = 404;
            return next(err);
          }
          for (const brand of results.storage_brands) {
            for (const storageBrand of results.storage.brand) {
              if (brand._id.toString() === storageBrand._id.toString()) {
                brand.checked = "true";
              }
            }
          }
          if (
            typeof results.storage.image != undefined &&
            typeof results.storage.imgId != "undefined" &&
            typeof req.file != "undefined"
          ) {
            deleteImage(results.storage.imgId)
          }
          res.render("storage/storage_form", {
            title: "Update storage",
            storage: results.storage,
            session: req.session,
            brands: results.storage_brands,
            storage,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Storage.findById(req.params.id, (err, storage) => {
      if (err) {
        return next(err);
      }
      if (
        typeof storage.image != undefined &&
        typeof req.file != "undefined" &&
        typeof storage.imgId != "undefined"
      ) {
        deleteImage(storage.imgId)
      }
    });

    // Data from form is valid. Update the record.
    Storage.findByIdAndUpdate(req.params.id, storage, {}, (err, thestorage) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to storage detail page.

      res.redirect(thestorage.url);
    });
  },
];
