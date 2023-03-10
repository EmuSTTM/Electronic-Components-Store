const CPU = require("../models/cpu");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const { body, validationResult } = require("express-validator");
const async = require("async");


// Configuraciones necesarias para añadir y eliminar imagenes. 
const deleteImage = require("../models/image");
const  { appConfig } = require('../config');
const { host } = appConfig;

// Display list of all cpus.
exports.cpu_list = (req, res, next) => {
  CPU.find(
    {},
    "name brand model core_count thread_count clock_speed socket price image frecuency_ram"
  )
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_cpu) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("cpu/cpu_list", {
        title: "CPU List",
        cpu_list: list_cpu,
        session: req.session,
      });
    });
};

// Display detail page for a specific cpu.
exports.cpu_detail = (req, res, next) => {
  CPU.findById(req.params.id)
    .populate("brand")
    .exec((err, cpu) => {
      if (err) {
        return next(err);
      }
      if (cpu == null) {
        // No results
        const err = new Error("cpu not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("cpu/cpu_detail", {
        title: "cpu Detail",
        cpu: cpu,
        cpu_brand: cpu.brand,
        session: req.session,
      });
    });
};

// Display cpu create form on GET.
exports.cpu_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("cpu/cpu_form", {
      title: "Add cpu",
      brands: brands,
      session: req.session,
    });
  });
};

// Handle cpu create on POST.
exports.cpu_create_post = [
  // Validate and sanitize the fiels.
  body("name", "cpu name is required").trim().isLength({ min: 1 }).escape(),
  body("brand", "cpu brand is required").escape(),
  body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
  body("coreCount", "cpu memory is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("threadCount", "memory type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("clockSpeed", "cpu core_clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("frecuencyRam", "cpu core_frecuency_ram is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("socket", "boost clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "stream processors is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cpu object with escaped and trimmed data.
    const cpu = new CPU({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      core_count: req.body.coreCount,
      thread_count: req.body.threadCount,
      clock_speed: req.body.clockSpeed,
      socket: req.body.socket,
      frecuency_ram: req.body.frecuencyRam,
      price: req.body.price,
    });

    if (typeof req.file !== "undefined") {
      cpu.image = `${host}/image/${req.file.filename}`;
      cpu.imgId = req.file.id;
    } 

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("cpu/cpu_form", {
          title: "Add cpu",
          brands: brands,
          cpu,
          errors: errors.array(),
          session: req.session,
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if cpu with same name already exists.
      CPU.findOne({ name: req.body.name }).exec((err, found_cpu) => {
        if (err) {
          return next(err);
        }
        if (found_cpu) {
          // cpu exists, redirect to its detail page.
          res.redirect(found_cpu.url);
        } else {
          cpu.save((err) => {
            if (err) {
              return next(err);
            }
            // cpu saved. Redirect to cpu detail page.
            res.redirect(cpu.url);
          });
        }
      });
    }
  },
];

// Display cpu delete form on GET.
exports.cpu_delete_get = (req, res, next) => {
  async.parallel(
    {
      cpu(callback) {
        CPU.findById(req.params.id).exec(callback);
      },
      cpu_computers(callback) {
        Computer.find({ cpu: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.cpu == null) {
        res.redirect("/components/cpus");
      }
      res.render("cpu/cpu_delete", {
        title: "Remove cpu",
        cpu: results.cpu,
        cpu_computers: results.cpu_computers,
        session: req.session,
      });
    }
  );
};

// Handle cpu delete on POST.
exports.cpu_delete_post = (req, res, next) => {
  async.parallel(
    {
      cpu(callback) {
        CPU.findById(req.body.cpuid).exec(callback);
      },
      cpu_computers(callback) {
        Computer.find({ cpu: req.body.cpuid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.cpu == null) {
        res.redirect("/components/cpus");
      }

      if (results.cpu_computers.length > 0) {
        res.render("cpu/cpu_delete", {
          title: "Remove cpu",
          cpu: results.cpu,
          cpu_computers: results.cpu_computers,
          session: req.session,
        });
      }

      CPU.findByIdAndRemove(req.body.cpuid, (err) => {
        if (err) {
          return next(err);
        }
        if (
          typeof results.cpu.image != undefined &&
          typeof results.cpu.imgId != "undefined"
        ) {
          deleteImage(results.cpu.imgId)
        }

        // Success - go to cpu list
        res.redirect("/components/cpus");
      });
    }
  );
};

// Display cpu update form on GET.
exports.cpu_update_get = (req, res, next) => {
  async.parallel(
    {
      cpu(callback) {
        CPU.findById(req.params.id).populate("brand").exec(callback);
      },
      cpu_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.cpu == null) {
        // No results.
        const err = new Error("cpu not found");
        err.status = 404;
        return next(err);
      }
      for (const brand of results.cpu_brands) {
        if (brand._id.toString() === results.cpu.brand._id.toString()) {
          brand.checked = "true";
        }
      }
      res.render("cpu/cpu_form", {
        title: "Update cpu",
        cpu: results.cpu,
        session: req.session,
        brands: results.cpu_brands,
      });
    }
  );
};

// Display cpu update form on POST.
exports.cpu_update_post = [
  // Validate and sanitize the fiels.
  body("name", "cpu name is required").trim().isLength({ min: 1 }).escape(),
  body("brand", "cpu brand is required").escape(),
  body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
  body("coreCount", "cpu memory is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("threadCount", "memory type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("clockSpeed", "cpu core_clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("frecuencyRam", "cpu core_frecuency_ram is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("socket", "boost clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "stream processors is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cpu object with escaped/trimmed data and old id.
    const cpu = new CPU({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      core_count: req.body.coreCount,
      thread_count: req.body.threadCount,
      clock_speed: req.body.clockSpeed,
      frecuency_ram: req.body.frecuencyRam,
      socket: req.body.socket,
      price: req.body.price,
      _id: req.params.id,
    });
    if (typeof req.file !== "undefined") {
      cpu.image = `${host}/image/${req.file.filename}`;
      cpu.imgId = req.file.id;
    } else {
      cpu.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          cpu(callback) {
            CPU.findById(req.params.id).populate("brand").exec(callback);
          },
          cpu_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.cpu == null) {
            // No results.
            const err = new Error("cpu not found");
            err.status = 404;
            return next(err);
          }
          for (const brand of results.cpu_brands) {
            if (brand._id.toString() === results.cpu.brand._id.toString()) {
              brand.checked = "true";
            }
          }
          if (
            typeof results.cpu.image != undefined &&
            typeof results.cpu.imgId != "undefined"
          ) {
            deleteImage(results.cpu.imgId)
          }

          res.render("cpu/cpu_form", {
            title: "Update cpu",
            cpu: results.cpu,
            brands: results.cpu_brands,
            session: req.session,
            cpu,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    CPU.findById(req.params.id, (err, cpu) => {
      if (err) {
        return next(err);
      }
      if (
        typeof cpu.image != undefined &&
        typeof req.file != "undefined" &&
        typeof cpu.imgId != "undefined"
      ) {
        deleteImage(cpu.imgId)
      }
    });

    // Data from form is valid. Update the record.
    CPU.findByIdAndUpdate(req.params.id, cpu, {}, (err, thecpu) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to cpu detail page.

      res.redirect(thecpu.url);
    });
  },
];
