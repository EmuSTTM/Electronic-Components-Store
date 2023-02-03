const Brand = require("../models/brand");
const Cabinet = require("../models/cabinet");
const GPU = require("../models/gpu");
const Motherboard = require("../models/motherboard");
const PowerSupply = require("../models/powerSupply");
const RAM = require("../models/ram");
const Storage = require("../models/storage");
const CPU = require("../models/cpu");
const Computer = require("../models/computer");

const async = require("async");

exports.index = (req, res) => {
    async.parallel(
      {
        brand_count(callback) {
          Brand.countDocuments({}, callback);
        },
        cabinet_count(callback) {
          Cabinet.countDocuments({}, callback);
        },
        gpu_count(callback) {
          GPU.countDocuments({}, callback);
        },
        motherboard_count(callback) {
          Motherboard.countDocuments({}, callback);
        },
        power_supply_count(callback) {
          PowerSupply.countDocuments({}, callback);
        },
        ram_count(callback) {
          RAM.countDocuments({}, callback);
        },
        storage_count(callback) {
          Storage.countDocuments({}, callback);
        },
        cpu_count(callback) {
          CPU.countDocuments({}, callback);
        },
        computer_count(callback) {
          Computer.countDocuments({}, callback);
        },
      },
      (err, results) => {
        res.render("index", {
          title: "ECS Components",
          error: err,
          data: results,
        });
      }
    );
  };

//   exports.index = (req, res) => {
    //     Brand.
    //             res.render("index", {
    //           title: "ECS Components",
    //           error: "",
    //           data: "",
    //         })
    // }
    