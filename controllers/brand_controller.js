const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply = require("../models/power-supply");
const RamSchema = require("../models/ram");
const Storage = require("../models/storage");
const Computer = require("../models/computer");
const CPU = require("../models/cpu");

const deleteImage = require("../models/image");

const async = require("async");
const { body, validationResult } = require("express-validator");


const  { appConfig } = require('../config');
const { host } = appConfig;


// Display list of all Brands. Brand list it's a it useless
exports.brand_list = function (req, res, next) {
  Brand.find({}, "name image")
    .sort({ name: 1 })
    .exec(function (err, list_brand) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("brand/brand_list", {
        title: "Brand List",
        brand_list: list_brand,
        session: req.session,
      });
    });
};

// Display detail page for a specific Brand.
exports.brand_detail = (req, res, next) => {
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_cabinets(callback) {
        Cabinet.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_gpus(callback) {
        GPU.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_motherboards(callback) {
        Motherboard.find({
          brand: { $elemMatch: { $eq: req.params.id } },
        }).exec(callback);
      },
      brand_powersupplies(callback) {
        PowerSupply.find({
          brand: { $elemMatch: { $eq: req.params.id } },
        }).exec(callback);
      },
      brand_rams(callback) {
        RamSchema.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_storages(callback) {
        Storage.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_cpus(callback) {
        CPU.find({ brand: req.params.id }).exec(callback);
      },
      brand_computers(callback) {
        Computer.find({ brand: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("brand/brand_detail", {
        title: "Brand Detail",
        brand: results.brand,
        brand_cabinets: results.brand_cabinets,
        brand_gpus: results.brand_gpus,
        brand_motherboards: results.brand_motherboards,
        brand_powersupplies: results.brand_powersupplies,
        brand_rams: results.brand_rams,
        brand_cpus: results.brand_cpus,
        brand_computers: results.brand_computers,
        brand_storages: results.brand_storages,
        session: req.session,
      });
    }
  );
};

// Display Brand create form on GET.
exports.brand_create_get = (req, res, next) => {
  res.render("brand/brand_form", { title: "Add Brand", session: req.session });
};

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "Brand name is required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a brand object with escaped and trimmed data.
    const brand = new Brand({
      name: req.body.name,
    });


    if (typeof req.file !== "undefined") {
      brand.image = `${host}/image/${req.file.filename}`;
      brand.imgId = req.file.id;
    } 
    if (typeof req.body.description !== "undefined") {
      brand.description = req.body.description;
    }

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      console.log(errors);
      res.render("brand/brand_form", {
        title: "Create Brand",
        brand,
        errors: errors.array(),
        session: req.session,
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
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_cabinets(callback) {
        Cabinet.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_gpus(callback) {
        GPU.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_motherboards(callback) {
        Motherboard.find({
          brand: { $elemMatch: { $eq: req.params.id } },
        }).exec(callback);
      },
      brand_powersupplies(callback) {
        PowerSupply.find({
          brand: { $elemMatch: { $eq: req.params.id } },
        }).exec(callback);
      },
      brand_rams(callback) {
        RamSchema.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
      brand_cpus(callback) {
        CPU.find({ brand: req.params.id }).exec(callback);
      },
      brand_computers(callback) {
        Computer.find({ brand: req.params.id }).exec(callback);
      },
      brand_storages(callback) {
        Storage.find({ brand: { $elemMatch: { $eq: req.params.id } } }).exec(
          callback
        );
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results
        res.redirect("/components/brands");
      }

      res.render("brand/brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        brand_cabinets: results.brand_cabinets,
        brand_gpus: results.brand_gpus,
        brand_cpus: results.brand_cpus,
        brand_computers: results.brand_computers,
        brand_motherboards: results.brand_motherboards,
        brand_powersupplies: results.brand_powersupplies,
        brand_rams: results.brand_rams,
        brand_storages: results.brand_storages,
        session: req.session,
      });
    }
  );
};

// Handle Brand delete on POST.
exports.brand_delete_post = (req, res, next) => {
  /* 
  Aquí utilizamos el parámetro "body.brandid" para evitar bugs, ya que si
  alguien intenta cambiar la url, no podrá eliminar otro brand. Ya que acá no comprobamos
  si el brand existe como si hacemos en el get
  */

  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.body.brandid).exec(callback);
      },
      brand_cabinets(callback) {
        Cabinet.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(
          callback
        );
      },
      brand_gpus(callback) {
        GPU.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(
          callback
        );
      },
      brand_motherboards(callback) {
        Motherboard.find({
          brand: { $elemMatch: { $eq: req.body.brandid } },
        }).exec(callback);
      },
      brand_cpus(callback) {
        CPU.find({ brand: req.body.brandid }).exec(callback);
      },
      brand_computers(callback) {
        Computer.find({ brand: req.body.brandid }).exec(callback);
      },
      brand_powersupplies(callback) {
        PowerSupply.find({
          brand: { $elemMatch: { $eq: req.body.brandid } },
        }).exec(callback);
      },
      brand_rams(callback) {
        RamSchema.find({
          brand: { $elemMatch: { $eq: req.body.brandid } },
        }).exec(callback);
      },
      brand_storages(callback) {
        Storage.find({ brand: { $elemMatch: { $eq: req.body.brandid } } }).exec(
          callback
        );
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (
        results.brand_cabinets.length > 0 ||
        results.brand_gpus.length > 0 ||
        results.brand_motherboards.length > 0 ||
        results.brand_powersupplies.length > 0 ||
        results.brand_rams.length > 0 ||
        results.brand_storages.length > 0
      ) {
        res.render("brand/brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_cabinets: results.brand_cabinets,
          brand_gpus: results.brand_gpus,
          brand_motherboards: results.brand_motherboards,
          brand_powersupplies: results.brand_powersupplies,
          brand_rams: results.brand_rams,
          brand_computers: results.brand_computers,
          brand_cpus: results.brand_cpus,
          brand_storages: results.brand_storages,
          session: req.session,
        });
        return;
      }
      if (results.brand == null) {
        // No results
        res.redirect("/components/brands");
      }
      Brand.findByIdAndRemove(req.body.brandid, (err) => {
        if (err) {
          return next(err);
        }
        if (
          typeof results.brand.image != undefined &&
          typeof results.brand.imgId != "undefined"
        ) {
          deleteImage(results.brand.imgId)
        }
        res.redirect("/components/brands");
      });
    }
  );
};

// Display Brand update form on GET.
exports.brand_update_get = (req, res, next) => {
  Brand.findById(req.params.id).exec((err, brand) => {
    if (err) {
      return next(err);
    }
    if (brand == null) {
      // No results.
      const err = new Error("brand not found");
      err.status = 404;
      return next(err);
    }
    res.render("brand/brand_form", {
      title: "Update Brand",
      brand: brand,
      session: req.session,
    });
  });
};

// Handle Brand update on POST.
exports.brand_update_post = [
  body("name", "Brand name is required ").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.name,
      _id: req.params.id,
    });

    if (typeof req.file !== "undefined") {
      brand.image = `${host}/image/${req.file.filename}`;
      brand.imgId = req.file.id;
    } else {
      brand.image = req.body.last_image;
    }
    if (typeof req.body.description !== "undefined") {
      brand.description = req.body.description;
    }

    if (!errors.isEmpty()) {
      Brand.findById(req.params.id).exec((err, brand) => {
        if (err) {
          return next(err);
        }
        if (brand == null) {
          // No results.
          const err = new Error("brand not found");
          err.status = 404;
          return next(err);
        }
        if (
          typeof brand.image != undefined &&
          typeof req.file != "undefined" &&
          typeof brand.imgId != "undefined"
        ) {
          deleteImage(brand.imgId)
        }
        res.render("brand/brand_form", {
          title: "Update Brand",
          brand: brand,
          errors: errors.array(),
          session: req.session,
        });
      });
      return;
    }

    Brand.findById(req.params.id, (err, brand) => {
      if (err) {
        return next(err);
      }
      if (
        typeof brand.image != undefined &&
        typeof req.file != "undefined" &&
        typeof brand.imgId != "undefined"
      ) {
        deleteImage(brand.imgId)
      }
    });
    // Data from form is valid. Update the record.
    Brand.findByIdAndUpdate(req.params.id, brand, {}, (err, thebrand) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to brand detail page.

      res.redirect(thebrand.url);
    });
  },
];
