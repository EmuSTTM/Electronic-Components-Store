const express = require("express");
const router = express.Router();

const brand_controller = require("../controllers/brandController");
const cabinet_controller = require("../controllers/cabinetController");
const gpu_controller = require("../controllers/gpuController");
const motherboard_controller = require("../controllers/motherboardController");
const powerSupply_controller = require("../controllers/powerSupplyController");
const ram_controller = require("../controllers/ramController");
const storage_controller = require("../controllers/storageController");

const components_controller = require("../controllers/componentsController");

// Index routes
router.get("/", components_controller.index);

// Brand routes
router.get("/brands", brand_controller.brand_list);
router.get("/brand/:id", brand_controller.brand_detail);
router.get("/brand/create", brand_controller.brand_create_get);
router.post("/brand/create", brand_controller.brand_create_post);
router.get("/brand/:id/delete", brand_controller.brand_delete_get);
router.post("/brand/:id/delete", brand_controller.brand_delete_post);
router.get("/brand/:id/update", brand_controller.brand_update_get);
router.post("/brand/:id/update", brand_controller.brand_update_post);

// Cabinet routes
router.get("/cabinets", cabinet_controller.cabinet_list);
router.get("/cabinet/:id", cabinet_controller.cabinet_detail);
router.get("/cabinet/create", cabinet_controller.cabinet_create_get);
router.post("/cabinet/create", cabinet_controller.cabinet_create_post);
router.get("/cabinet/:id/delete", cabinet_controller.cabinet_delete_get);
router.post("/cabinet/:id/delete", cabinet_controller.cabinet_delete_post);
router.get("/cabinet/:id/update", cabinet_controller.cabinet_update_get);
router.post("/cabinet/:id/update", cabinet_controller.cabinet_update_post);

// GPU routes
router.get("/gpus", gpu_controller.gpu_list);
router.get("/gpu/:id", gpu_controller.gpu_detail);
router.get("/gpu/create", gpu_controller.gpu_create_get);
router.post("/gpu/create", gpu_controller.gpu_create_post);
router.get("/gpu/:id/delete", gpu_controller.gpu_delete_get);
router.post("/gpu/:id/delete", gpu_controller.gpu_delete_post);
router.get("/gpu/:id/update", gpu_controller.gpu_update_get);
router.post("/gpu/:id/update", gpu_controller.gpu_update_post);

// Motherboard routes
router.get("/motherboards", motherboard_controller.motherboard_list);
router.get("/motherboard/:id", motherboard_controller.motherboard_detail);
router.get("/motherboard/create", motherboard_controller.motherboard_create_get);
router.post("/motherboard/create", motherboard_controller.motherboard_create_post);
router.get("/motherboard/:id/delete", motherboard_controller.motherboard_delete_get);
router.post("/motherboard/:id/delete", motherboard_controller.motherboard_delete_post);
router.get("/motherboard/:id/update", motherboard_controller.motherboard_update_get);
router.post("/motherboard/:id/update", motherboard_controller.motherboard_update_post);

// PowerSupply routes
router.get("/powerSupplies", powerSupply_controller.powerSupply_list);
router.get("/powerSupply/:id", powerSupply_controller.powerSupply_detail);
router.get("/powerSupply/create", powerSupply_controller.powerSupply_create_get);
router.post("/powerSupply/create", powerSupply_controller.powerSupply_create_post);
router.get("/powerSupply/:id/delete", powerSupply_controller.powerSupply_delete_get);
router.post("/powerSupply/:id/delete", powerSupply_controller.powerSupply_delete_post);
router.get("/powerSupply/:id/update", powerSupply_controller.powerSupply_update_get);
router.post("/powerSupply/:id/update", powerSupply_controller.powerSupply_update_post);

// Ram routes
router.get("/rams", ram_controller.ram_list);
router.get("/ram/:id", ram_controller.ram_detail);
router.get("/ram/create", ram_controller.ram_create_get);
router.post("/ram/create", ram_controller.ram_create_post);
router.get("/ram/:id/delete", ram_controller.ram_delete_get);
router.post("/ram/:id/delete", ram_controller.ram_delete_post);
router.get("/ram/:id/update", ram_controller.ram_update_get);
router.post("/ram/:id/update", ram_controller.ram_update_post);

// Storage routes
router.get("/storages", storage_controller.storage_list);
router.get("/storage/:id", storage_controller.storage_detail);
router.get("/storage/create", storage_controller.storage_create_get);
router.post("/storage/create", storage_controller.storage_create_post);
router.get("/storage/:id/delete", storage_controller.storage_delete_get);
router.post("/storage/:id/delete", storage_controller.storage_delete_post);
router.get("/storage/:id/update", storage_controller.storage_update_get);
router.post("/storage/:id/update", storage_controller.storage_update_post);

module.exports = router;

