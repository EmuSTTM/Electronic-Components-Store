const GPU = require("../models/gpu");
const Brand = require("../models/brand");
const Computer = require("../models/computer");

const async = require("async");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

// Display list of all GPU.
exports.gpu_list = function (req, res, next) {
  GPU.find({}, "name brand model core_clock memory price image")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, list_gpu) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("gpu/gpu_list", {
        title: "GPU List",
        session: req.session,
        gpu_list: list_gpu,
      });
    });
};
// name: nombre de la tarjeta gráfica
// brand: marca de la tarjeta gráfica, se refiere a un objeto de la colección "Brand" mediante su ObjectId.
// model: modelo de la tarjeta gráfica
// memory: capacidad de memoria
// memory_type: tipo de memoria
// core_clock: velocidad de reloj de núcleo
// boost_clock: velocidad de reloj de impulso
// stream_processors: número de procesadores de flujo
// tdp: potencia térmica de diseño
// price: precio de la tarjeta gráfica

// Display detail page for a specific GPU.
exports.gpu_detail = (req, res, next) => {
  // gpu.findById(req.params.id)
  // .populate('brand')
  // .exec((err, gpu) => {
  //     if (err) {
  //         return next(err);
  //     }
  //     if (gpu == null) {
  //         const err = new Error("gpu not found");
  //         err.status = 404;
  //         return next(err);
  //     }
  //     res.render("gpu/gpu_detail", {
  //         title: "gpu Detail",
  //         gpu: gpu,
  //     });
  // });
  GPU.findById(req.params.id)
    .populate("brand")
    .exec((err, gpu) => {
      if (err) {
        return next(err);
      }
      if (gpu == null) {
        // No results
        const err = new Error("GPU not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("gpu/gpu_detail", {
        title: "GPU Detail",
        gpu: gpu,
        session: req.session,
        gpu_brand: gpu.brand,
      });
    });
};

// Display GPU create form on GET.
exports.gpu_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if (err) {
      return next(err);
    }
    res.render("gpu/gpu_form", {
      title: "Add gpu",
      brands: brands,
      session: req.session,
    });
  });
};

// Handle GPU create on POST.
exports.gpu_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "GPU name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "GPU brand is required").escape(),
  // Validate and sanitize the memory field.

  // Validate and sanitize the model field.
  body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
  body("memory", "GPU memory is required").trim().isLength({ min: 1 }).escape(),
  body("memory_type", "memory type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the core_clock field.
  body("core_clock", "GPU core_clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("boost_clock", "boost clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stream_processors", "stream processors is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the tdp field.
  body("tdp", "GPU tdp is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("price", "GPU price is required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a GPU object with escaped and trimmed data.
    const gpu = new GPU({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      memory: req.body.memory,
      memory_type: req.body.memory_type,
      core_clock: req.body.core_clock,
      boost_clock: req.body.boost_clock,
      stream_processors: req.body.stream_processors,
      tdp: req.body.tdp,
      price: req.body.price,
      image: req.file.filename,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Brand.find((err, brands) => {
        if (err) {
          return next(err);
        }
        res.render("gpu/gpu_form", {
          title: "Add GPU",
          brands: brands,
          gpu,
          session: req.session,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid.
      // Check if GPU with same name already exists.
      GPU.findOne({ name: req.body.name }).exec((err, found_gpu) => {
        if (err) {
          return next(err);
        }
        if (found_gpu) {
          // GPU exists, redirect to its detail page.
          res.redirect(found_gpu.url);
        } else {
          gpu.save((err) => {
            if (err) {
              return next(err);
            }
            // GPU saved. Redirect to GPU detail page.
            res.redirect(gpu.url);
          });
        }
      });
    }
  },
];

// Display gpu delete form on GET.
exports.gpu_delete_get = (req, res, next) => {
  async.parallel(
    {
      gpu(callback) {
        GPU.findById(req.params.id).exec(callback);
      },
      gpu_computers(callback) {
        Computer.find({ gpu: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.gpu == null) {
        res.redirect("/components/gpus");
      }
      res.render("gpu/gpu_delete", {
        title: "Remove gpu",
        gpu: results.gpu,
        session: req.session,
        gpu_computers: results.gpu_computers,
      });
    }
  );
};

// Handle gpu delete on POST.
exports.gpu_delete_post = (req, res, next) => {
  async.parallel(
    {
      gpu(callback) {
        GPU.findById(req.body.gpuid).exec(callback);
      },
      gpu_computers(calblack) {
        Computer.find({ gpu: req.body.gpuid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.gpu == null) {
        res.redirect("/components/gpus");
      }

      if (results.gpu_computers.length > 0) {
        res.render("gpu/gpu_delete", {
          title: "Remove gpu",
          gpu: results.gpu,
          session: req.session,
          gpu_computers: results.gpu_computers,
        });
      }

      GPU.findByIdAndRemove(req.body.gpuid, (err) => {
        if (err) {
          return next(err);
        }
        if (typeof results.gpu.image != undefined) {
          const ImageName = "public/images/" + results.gpu.image;

          if (fs.existsSync(ImageName)) {
            fs.unlinkSync(ImageName);
          }
        }

        // Success - go to gpu list
        res.redirect("/components/gpus");
      });
    }
  );
};

// Display GPU update form on GET.
exports.gpu_update_get = (req, res, next) => {
  async.parallel(
    {
      gpu(callback) {
        GPU.findById(req.params.id).populate("brand").exec(callback);
      },
      gpu_brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.gpu == null) {
        // No results.
        const err = new Error("gpu not found");
        err.status = 404;
        return next(err);
      }
      for (const brand of results.gpu_brands) {
        for (const gpuBrand of results.gpu.brand) {
          if (brand._id.toString() === gpuBrand._id.toString()) {
            brand.checked = "true";
          }
        }
      }
      res.render("gpu/gpu_form", {
        title: "Update gpu",
        session: req.session,
        gpu: results.gpu,
        brands: results.gpu_brands,
      });
    }
  );
};
exports.gpu_update_post = [
  //   (req, res, next) => {
  //   GPU.findById(req.params.id,
  //       (err, gpu) => {
  //         if (err) {
  //           return next(err);
  //         }

  //         if (typeof req.file == "undefined" || req.body.image == "undefined"){
  //           req.body.image = gpu.image;
  //         }
  //       })
  // },

  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.brand)) {
      req.body.brand =
        typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "GPU name is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "GPU brand is required").escape(),
  // Validate and sanitize the memory field.

  // Validate and sanitize the model field.
  body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
  body("memory", "GPU memory is required").trim().isLength({ min: 1 }).escape(),
  body("memory_type", "memory type is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the core_clock field.
  body("core_clock", "GPU core_clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("boost_clock", "boost clock is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stream_processors", "stream processors is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the tdp field.
  body("tdp", "GPU tdp is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the price field.
  body("price", "GPU price is required").trim().isLength({ min: 1 }).escape(),

  // Process check().not().isEmpty().withMessage('gpu image is required'),request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a gpu object with escaped/trimmed data and old id.
    const gpu = new GPU({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      memory: req.body.memory,
      memory_type: req.body.memory_type,
      core_clock: req.body.core_clock,
      boost_clock: req.body.boost_clock,
      stream_processors: req.body.stream_processors,
      tdp: req.body.tdp,
      price: req.body.price,

      _id: req.params.id,
    });
    if (typeof req.file !== "undefined") {
      gpu.image = req.file.filename;
    } else {
      gpu.image = req.body.last_image;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          gpu(callback) {
            GPU.findById(req.params.id).populate("brand").exec(callback);
          },
          gpu_brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.gpu == null) {
            // No results.
            const err = new Error("gpu not found");
            err.status = 404;
            return next(err);
          }
          for (const brand of results.gpu_brands) {
            for (const gpuBrand of results.gpu.brand) {
              if (brand._id.toString() === gpuBrand._id.toString()) {
                brand.checked = "true";
              }
            }
          }
          if (
            typeof results.gpu.image != undefined &&
            typeof req.file != "undefined"
          ) {
            const ImageName = "public/images/" + results.gpu.image;

            if (fs.existsSync(ImageName)) {
              fs.unlinkSync(ImageName);
            }
          }

          res.render("gpu/gpu_form", {
            title: "Update gpu",
            session: req.session,
            gpu: results.gpu,
            brands: results.gpu_brands,
            gpu,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    GPU.findById(req.params.id, (err, gpu) => {
      if (err) {
        return next(err);
      }
      if (typeof gpu.image != "undefined" && typeof req.file != "undefined") {
        const ImageName = "public/images/" + gpu.image;

        if (fs.existsSync(ImageName)) {
          fs.unlinkSync(ImageName);
        }
      }
    });

    // Data from form is valid. Update the record.
    GPU.findByIdAndUpdate(req.params.id, gpu, {}, (err, thegpu) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to gpu detail page.

      res.redirect(thegpu.url);
    });
  },
];
