const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const CPU = require("../models/cpu");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply = require("../models/powerSupply");
const RAM = require("../models/ram");
const Storage = require("../models/storage");
const Computer = require("../models/computer");

const { body, validationResult } = require("express-validator");

const async = require("async");
const fs = require("fs");

// Display list of all Computers.
exports.computer_list = (req, res, next) => {
  Computer.find(
    {},
    "name brand cpu gpu motherboard ram storage powerSupply price image"
  )
    .sort({ name: 1 })
    .populate("cabinet")
    .populate("brand")
    .populate("cpu")
    .populate("gpu")
    .populate("motherboard")
    .populate("ram")
    .populate("storage")
    .populate("powerSupply")
    .exec(function (err, list_computers) {
      if (err) {
        return next(err);
      }

      // Add the price of each computer
      const computedComputers = list_computers.map((computer) => {
        // Para calcular el total de price, se requiere sumar los precios de todas las rams y storages primero
        const totalRam = computer.ram.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price;
        }, 0);

        const totalStorage = computer.storage.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue.price;
          },
          0
        );

        // console.log(totalRam, totalStorage, computer.cabinet.price, computer.cpu.price,
        //   computer.gpu.price, computer.motherboard.price, computer.powerSupply.price)

        if (
          computer.cabinet &&
          computer.cpu &&
          computer.gpu &&
          computer.motherboard &&
          totalRam &&
          totalStorage &&
          computer.powerSupply
        ) {
          computer.price =
            computer.cabinet.price +
            computer.cpu.price +
            computer.gpu.price +
            computer.motherboard.price +
            totalRam +
            totalStorage +
            computer.powerSupply.price;
          // console.log(computer.price);
        }

        // console.log(typeof computer.cabinet, typeof computer.cpu, typeof computer.gpu,
        //   typeof computer.motherboard, typeof totalRam,
        //   typeof totalStorage, typeof computer.powerSupply)

        // console.log(typeof computer.price)
        if (typeof computer.price == "undefined") {
          computer.price = 000;
        }

        return computer;
      });

      //Successful, so render
      res.render("computer/computer_list", {
        title: "Computer List",
        computer_list: computedComputers,
        session: req.session,
      });
    });
};

// Display detail page for a specific computer.
exports.computer_detail = (req, res, next) => {
  // Populate all components to access their properties
  Computer.findById(req.params.id)
    .populate("brand")
    .populate("cabinet")
    .populate("cpu")
    .populate("gpu")
    .populate("motherboard")
    .populate("ram")
    .populate("storage")
    .populate("powerSupply")
    .exec((err, computer) => {
      if (err) {
        return next(err);
      }
      if (computer == null) {
        // No results
        const err = new Error("computer not found");
        err.status = 404;
        return next(err);
      }

      const totalRam = computer.ram.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price;
      }, 0);

      const totalStorage = computer.storage.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.price;
        },
        0
      );

      if (
        computer.cabinet &&
        computer.cpu &&
        computer.gpu &&
        computer.motherboard &&
        totalRam &&
        totalStorage &&
        computer.powerSupply
      ) {
        computer.price =
          computer.cabinet.price +
          computer.cpu.price +
          computer.gpu.price +
          computer.motherboard.price +
          totalRam +
          totalStorage +
          computer.powerSupply.price;
      }
      console.log(typeof computer.price);
      if (typeof computer.price == "undefined") {
        computer.price = 000;
      }

      // Todo sucedió correctamente
      res.render("computer/computer_detail", {
        title: "Computer Detail",
        computer: computer,
        session: req.session,
      });
    });
};

// Display computer create form on GET.
exports.computer_create_get = (req, res, next) => {
  async.parallel(
    {
      brands(callback) {
        Brand.find({ name: { $in: ["AMD", "Intel"] } }, callback);
      },
      cabinet(callback) {
        Cabinet.find(callback).populate("brand");
      },
      cpu(callback) {
        CPU.find(callback).populate("brand");
      },
      gpu(callback) {
        GPU.find(callback).populate("brand");
      },
      motherboard(callback) {
        Motherboard.find(callback).populate("brand");
      },
      ram(callback) {
        RAM.find(callback).populate("brand");
      },
      storage(callback) {
        Storage.find(callback).populate("brand");
      },
      powerSupply(callback) {
        PowerSupply.find(callback).populate("brand");
      },
    },
    (err, results) => {
      res.render("computer/computer_form", {
        title: "Add computer",
        brands: results.brands,
        cabinets: results.cabinet,
        cpus: results.cpu,
        gpus: results.gpu,
        motherboards: results.motherboard,
        rams: results.ram,
        storages: results.storage,
        powerSupplies: results.powerSupply,
        session: req.session,
      });
    }
  );
};

// Display Computer CREATE form on POST.
exports.computer_create_post = [
  (req, res, next) => {
    // convert multiple parameters to arrays
    if (!Array.isArray(req.body.storages)) {
      let storages = req.body.storages;
      storages = storages.split(",");
      req.body.storages = storages;
      // req.body.storages = typeof req.body.storages === "undefined" ? [] : [req.body.storages];
    }
    if (!Array.isArray(req.body.rams)) {
      let rams = req.body.rams;
      rams = rams.split(",");
      req.body.rams = rams;
    }

    next();
  },
  body("brand", "Brand is required").trim().isLength({ min: 1 }).escape(),
  body("cabinet", "Cabinet is required").trim().isLength({ min: 1 }).escape(),
  body("cpu", "CPU is required").trim().isLength({ min: 1 }).escape(),
  body("motherboard", "Motherboard is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("powerSupply", "PowerSupply is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("rams.*", "RAMs are required").trim().isLength({ min: 1 }).escape(),
  body("storages.*", "Storages are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    // we need to search all the components to check the compatibility
    async.parallel(
      {
        brand(callback) {
          Brand.findById(req.body.brand, callback);
        },
        cabinet(callback) {
          Cabinet.findById(req.body.cabinet, callback);
        },
        cpu(callback) {
          CPU.findById(req.body.cpu, callback);
        },
        gpu(callback) {
          GPU.findById(req.body.gpu, callback);
        },
        motherboard(callback) {
          Motherboard.findById(req.body.motherboard, callback);
        },
        rams(callback) {
          RAM.find({ _id: { $in: req.body.rams } }, callback);
        },
        storages(callback) {
          Storage.find({ _id: { $in: req.body.storages } }, callback);
        },
        powerSupply(callback) {
          PowerSupply.findById(req.body.powerSupply, callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Aquí debería hacer las verificaciones de los componentes
        const compatibilityErrors = [];

        let mother_brand_id = results.motherboard.brand.find((id) =>
          id.equals(results.brand._id)
        );
        console.log(results.motherboard.brand);
        console.log(results.motherboard.brand[0]);
        console.log(mother_brand_id);
        console.log(results.brand._id);
        if (
          results.brand._id.toString() != results.cpu.brand.toString() ||
          results.brand._id.toString() != mother_brand_id.toString()
        ) {
          compatibilityErrors.push(
            "CPU or/and motherboard must be compatible with the brand "
          );
        }

        // Compatibilidad del socket
        if (results.motherboard.socket != results.cpu.socket) {
          compatibilityErrors.push(
            "Motherboard must be compatible with the CPU"
          );
        }

        // Compatibilidad del gabinete con la motherboard
        if (
          results.cabinet.type == "ITX" &&
          results.motherboard.type != "ITX"
        ) {
          compatibilityErrors.push(
            "Cabinet must be compatible with the motherboard"
          );
        }
        if (
          results.cabinet.type == "M-ATX" &&
          results.motherboard.type == "ATX"
        ) {
          compatibilityErrors.push(
            "Cabinet must be compatible with the motherboard"
          );
        }

        // Compatibilidad de la RAM a la mother
        for (let ram of results.rams) {
          if (ram.speed > results.motherboard.frecuency_ram) {
            compatibilityErrors.push(
              "RAM speed must be compatible with the motherboard frecuency"
            );
          }
          console.log(ram);
          console.log(ram);
          console.log(ram);
          if (ram.type != results.motherboard.socket_ram) {
            compatibilityErrors.push(
              "RAM type must be compatible with the motherboard socket"
            );
          }
        }

        // Agregar validaciones de frecuencias entre las RAMS y de peso
        const speeds = results.rams.map((obj) => obj.speed);
        const uniqueSpeed = new Set(speeds);

        if (uniqueSpeed.speed > 1) {
          compatibilityErrors.push(
            "It's recommended that the rams have the same frequency"
          );
        }

        const sizes = results.rams.map((obj) => obj.size);
        const uniqueSize = new Set(sizes);

        if (uniqueSize.size > 1) {
          compatibilityErrors.push(
            "It's recommended that the rams have the same size"
          );
        }

        // Agregar validación de que no se agreguen más rams que las que soporta la mother
        if (results.motherboard.ram_slots < req.body.rams.length) {
          compatibilityErrors.push("The motherboard can't have that many RAMS");
        }

        // Agregar validaciones si la mother tiene entradas V2 y SSD sufientes.

        const computer = new Computer({
          name: req.body.name,
          description: req.body.description,
          brand: results.brand,
          cabinet: results.cabinet,
          cpu: results.cpu,
          gpu: results.gpu,
          motherboard: results.motherboard,
          ram: results.rams,
          storage: results.storages,
          powerSupply: results.powerSupply,
        });

        if (typeof req.file.filename != "undefined") {
          computer.image = req.file.filename;
        }
        if (typeof req.body.description != "undefined") {
          computer.description = req.body.description;
        }
        console.log(computer);

        if (!errors.isEmpty() || compatibilityErrors.length != 0) {
          // There are errors. Render the form again with sanitized values/error messages.
          async.parallel(
            {
              brands(callback) {
                Brand.find({ name: { $in: ["AMD", "Intel"] } }, callback);
              },
              cpu(callback) {
                CPU.find(callback).populate("brand");
              },
              cabinet(callback) {
                Cabinet.find(callback).populate("brand");
              },
              gpu(callback) {
                GPU.find(callback).populate("brand");
              },
              motherboard(callback) {
                Motherboard.find(callback).populate("brand");
              },
              ram(callback) {
                RAM.find(callback).populate("brand");
              },
              storage(callback) {
                Storage.find(callback).populate("brand");
              },
              powerSupply(callback) {
                PowerSupply.find(callback).populate("brand");
              },
            },
            (err, results) => {
              res.render("computer/computer_form", {
                title: "Add computer",
                brands: results.brands,
                cabinets: results.cabinet,
                cpus: results.cpu,
                gpus: results.gpu,
                motherboards: results.motherboard,
                rams: results.ram,
                storages: results.storage,
                powerSupplies: results.powerSupply,
                computer: computer,
                errors: errors.array(),
                errors_compatibility: compatibilityErrors,
                session: req.session,
              });
            }
          );
          return;
        } else {
          // Data from form is valid.
          // Check if ram with same name already exists.
          Computer.findOne({ name: req.body.name }).exec(
            (err, found_computer) => {
              if (err) {
                return next(err);
              }
              if (found_computer) {
                // computer exists, redirect to its detail page.
                res.redirect(found_computer.url);
              } else {
                computer.save((err) => {
                  if (err) {
                    return next(err);
                  }
                  // computer saved. Redirect to Computer detail page.
                  res.redirect(computer.url);
                });
              }
            }
          );
        }
      }
    );
  },
];

// Display computer delete form on GET.
exports.computer_delete_get = (req, res, next) => {
  Computer.findById(req.params.id).exec((err, computer) => {
    if (err) {
      return next(err);
    }
    if (computer == null) {
      res.redirect("/computers/");
    }
    res.render("computer/computer_delete", {
      title: "Remove computer",
      computer: computer,
      session: req.session,
    });
  });
};

// Handle computer delete on POST.
exports.computer_delete_post = (req, res, next) => {
  Computer.findById(req.body.computerid).exec((err, computer) => {
    if (err) {
      return next(err);
    }
    if (computer == null) {
      res.redirect("/components/computers");
    }
    Computer.findByIdAndRemove(req.body.computerid, (err) => {
      if (err) {
        return next(err);
      }
      if (typeof computer.image != undefined) {
        const ImageName = "public/images/" + computer.image;

        if (fs.existsSync(ImageName)) {
          fs.unlinkSync(ImageName);
        }
      }
      // Success - go to author list
      res.redirect("/computers/");
    });
  });
};

// Display Computer update form on GET.
exports.computer_update_get = (req, res, next) => {
  async.parallel(
    {
      computer(callback) {
        Computer.findById(req.params.id)
          .populate("brand")
          .populate("cabinet")
          .populate("cpu")
          .populate("gpu")
          .populate("motherboard")
          .populate("powerSupply")
          .populate("ram")
          .populate("storage")
          .exec(callback);
      },
      brands(callback) {
        Brand.find({ name: { $in: ["AMD", "Intel"] } }, callback);
      },
      cabinet(callback) {
        Cabinet.find(callback).populate("brand");
      },
      cpu(callback) {
        CPU.find(callback).populate("brand");
      },
      gpu(callback) {
        GPU.find(callback).populate("brand");
      },
      motherboard(callback) {
        Motherboard.find(callback).populate("brand");
      },
      ram(callback) {
        RAM.find(callback).populate("brand");
      },
      storage(callback) {
        Storage.find(callback).populate("brand");
      },
      powerSupply(callback) {
        PowerSupply.find(callback).populate("brand");
      },
    },
    (err, results) => {
      res.render("computer/computer_update", {
        title: "Update Computer",
        brands: results.brands,
        cabinets: results.cabinet,
        cpus: results.cpu,
        gpus: results.gpu,
        motherboards: results.motherboard,
        rams: results.ram,
        storages: results.storage,
        powerSupplies: results.powerSupply,
        computer: results.computer,
        session: req.session,
      });
    }
  );
};
// Display Computer update form on POST.
exports.computer_update_post = [
  (req, res, next) => {
    // convert multiple parameters to arrays
    if (typeof req.body.storage0 !== "undefined") {
      if (typeof req.body.storage1 !== "undefined") {
        req.body.storages = [req.body.storage0, req.body.storage1];
      } else {
        req.body.storages = [req.body.storage0];
      }
    }

    if (typeof req.body.ram0 !== "undefined") {
      if (typeof req.body.ram1 !== "undefined") {
        req.body.rams = [req.body.ram0, req.body.ram1];
      } else {
        req.body.rams = [req.body.ram0];
      }
    } else {
      req.body.rams = [];
    }

    if (!Array.isArray(req.body.rams)) {
      req.body.rams =
        typeof req.body.rams === "undefined" ? [] : [req.body.rams];
    }
    if (!Array.isArray(req.body.storages)) {
      req.body.storages =
        typeof req.body.storages === "undefined" ? [] : [req.body.storages];
    }
    console.log(req.body.brand);
    console.log(req.params.id);
    console.log(req.body.cpu);
    console.log(req.body.name);
    next();
  },

  body("brand", "Brand is required").trim().isLength({ min: 1 }).escape(),
  body("cabinet", "Cabinet is required").trim().isLength({ min: 1 }).escape(),
  body("cpu", "CPU is required").trim().isLength({ min: 1 }).escape(),
  body("motherboard", "Motherboard is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("powerSupply", "PowerSupply is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("rams.*", "RAMs are required").trim().isLength({ min: 1 }).escape(),
  body("storages.*", "Storages are required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    // we need to search all the components to check the compatibility
    async.parallel(
      {
        brand(callback) {
          Brand.findById(req.body.brand, callback);
        },
        cabinet(callback) {
          Cabinet.findById(req.body.cabinet, callback);
        },
        cpu(callback) {
          CPU.findById(req.body.cpu, callback);
        },
        gpu(callback) {
          GPU.findById(req.body.gpu, callback);
        },
        motherboard(callback) {
          Motherboard.findById(req.body.motherboard, callback);
        },
        rams(callback) {
          RAM.find({ _id: { $in: req.body.rams } }, callback);
        },
        storages(callback) {
          Storage.find({ _id: { $in: req.body.storages } }, callback);
        },
        powerSupply(callback) {
          PowerSupply.findById(req.body.powerSupply, callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Aquí debería hacer las verificaciones de los componentes
        const compatibilityErrors = [];

        let mother_brand_id = results.motherboard.brand.find((id) =>
          id.equals(results.brand._id)
        );

        if (!mother_brand_id) {
          compatibilityErrors.push(
            `The brand of the motherboard (${results.motherboard.brand.name}) is not compatible 
            with the selected CPU brand (${results.brand.name}).`
          );
        }

        // Compatibilidad del socket
        if (results.motherboard.socket != results.cpu.socket) {
          compatibilityErrors.push(
            "Motherboard must be compatible with the CPU"
          );
        }

        // Compatibilidad del gabinete con la motherboard
        if (
          results.cabinet.type == "ITX" &&
          results.motherboard.type != "ITX"
        ) {
          compatibilityErrors.push(
            "Cabinet must be compatible with the motherboard"
          );
        }
        if (
          results.cabinet.type == "M-ATX" &&
          results.motherboard.type == "ATX"
        ) {
          compatibilityErrors.push(
            "Cabinet must be compatible with the motherboard"
          );
        }

        // Compatibilidad de la RAM a la mother
        for (let ram of results.rams) {
          if (ram.speed > results.motherboard.frecuency_ram) {
            compatibilityErrors.push(
              "RAM speed must be compatible with the motherboard frecuency"
            );
          }
          if (ram.type != results.motherboard.socket_ram) {
            compatibilityErrors.push(
              "RAM type must be compatible with the motherboard socket"
            );
          }
        }

        // Agregar validaciones de frecuencias entre las RAMS y de peso
        const speeds = results.rams.map((obj) => obj.speed);
        const uniqueSpeed = new Set(speeds);

        if (uniqueSpeed.speed > 1) {
          compatibilityErrors.push(
            "It's recommended that the rams have the same frequency"
          );
        }

        const sizes = results.rams.map((obj) => obj.size);
        const uniqueSize = new Set(sizes);

        if (uniqueSize.size > 1) {
          compatibilityErrors.push(
            "It's recommended that the rams have the same size"
          );
        }

        // Agregar validación de que no se agreguen más rams que las que soporta la mother
        if (results.motherboard.ram_slots < req.body.rams.length) {
          compatibilityErrors.push("The motherboard can't have that many RAMS");
        }

        // Agregar validaciones si la mother tiene entradas V2 y SSD sufientes.

        const computer = new Computer({
          name: req.body.name,
          description: req.body.description,
          brand: results.brand,
          cabinet: results.cabinet,
          cpu: results.cpu,
          gpu: results.gpu,
          motherboard: results.motherboard,
          ram: results.rams,
          storage: results.storages,
          powerSupply: results.powerSupply,
          _id: req.params.id,
        });

        if (typeof req.body.description != "undefined") {
          computer.description = req.body.description;
        }

        if (typeof req.file !== "undefined") {
          computer.image = req.file.filename;
        } else {
          computer.image = req.body.last_image;
        }
        console.log(computer);

        if (!errors.isEmpty() || compatibilityErrors.length != 0) {
          async.parallel(
            {
              computer(callback) {
                Computer.findById(req.params.id)
                  .populate("brand")
                  .populate("cabinet")
                  .populate("cpu")
                  .populate("gpu")
                  .populate("motherboard")
                  .populate("powerSupply")
                  .populate("ram")
                  .populate("storage")
                  .exec(callback);
              },
              brands(callback) {
                Brand.find({ name: { $in: ["AMD", "Intel"] } }, callback);
              },
              cabinet(callback) {
                Cabinet.find(callback).populate("brand");
              },
              cpu(callback) {
                CPU.find(callback).populate("brand");
              },
              gpu(callback) {
                GPU.find(callback).populate("brand");
              },
              motherboard(callback) {
                Motherboard.find(callback).populate("brand");
              },
              ram(callback) {
                RAM.find(callback).populate("brand");
              },
              storage(callback) {
                Storage.find(callback).populate("brand");
              },
              powerSupply(callback) {
                PowerSupply.find(callback).populate("brand");
              },
            },
            (err, results) => {
              if (
                typeof results.computer.image != undefined &&
                typeof req.file != "undefined"
              ) {
                const ImageName = "public/images/" + results.computer.image;

                if (fs.existsSync(ImageName)) {
                  fs.unlinkSync(ImageName);
                }
              }

              res.render("computer/computer_update", {
                title: "Update Computer",
                brands: results.brands,
                cabinets: results.cabinet,
                cpus: results.cpu,
                gpus: results.gpu,
                motherboards: results.motherboard,
                rams: results.ram,
                storages: results.storage,
                powerSupplies: results.powerSupply,
                computer: results.computer,
                session: req.session,
              });
            }
          );
          return;
        } else {
          // Data from form is valid.
          // Check if ram with same name already exists.
          Computer.findById(req.params.id, (err, found_computer) => {
            if (err) {
              return next(err);
            }

            if (
              typeof found_computer.image != undefined &&
              typeof req.file != "undefined"
            ) {
              const ImageName = "public/images/" + found_computer.image;

              if (fs.existsSync(ImageName)) {
                fs.unlinkSync(ImageName);
              }
            }
          });

          Computer.findByIdAndUpdate(
            req.params.id,
            computer,
            {},
            (err, thecomputer) => {
              if (err) return next(err);
              res.redirect(thecomputer.url);
            }
          );
        }
      }
    );
  },
];
