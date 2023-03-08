const express = require("express");
const router = express.Router();

const brandController = require("../controllers/brand_controller");
const cabinetController = require("../controllers/cabinet_controller");
const cpuController = require("../controllers/cpu_controller");
const gpuController = require("../controllers/gpu_controller");
const motherboardController = require("../controllers/motherboard_controller");
const powerSupplyController = require("../controllers/power-supply_controller");
const ramController = require("../controllers/ram_controller");
const storageController = require("../controllers/storage_controller");

// Middleware of multers
const upload = require("../middlewares/uploadImage");

// Middleware of users actions
const setUserRole = require("../middlewares/setUserRole");

// Index routes
router.get("/", (req, res, next) => {
  res.redirect("/");
});

// Brand routes
router.get("/brands", brandController.brand_list);
router.get("/brand/create", setUserRole, brandController.brand_create_get);
router.post(
  "/brand/create",
  upload.single("image"),
  brandController.brand_create_post
);
router.get("/brand/:id", brandController.brand_detail);
router.get("/brand/:id/delete", setUserRole, brandController.brand_delete_get);
router.post("/brand/:id/delete", brandController.brand_delete_post);
router.get("/brand/:id/update", setUserRole, brandController.brand_update_get);
router.post(
  "/brand/:id/update",
  upload.single("image"),
  brandController.brand_update_post
);

// Cabinet routes
router.get("/cabinets", cabinetController.cabinet_list);
router.get(
  "/cabinet/create",
  setUserRole,
  cabinetController.cabinet_create_get
);
router.post(
  "/cabinet/create",
  upload.single("image"),
  cabinetController.cabinet_create_post
);
router.get("/cabinet/:id", cabinetController.cabinet_detail);
router.get(
  "/cabinet/:id/delete",
  setUserRole,
  cabinetController.cabinet_delete_get
);
router.post("/cabinet/:id/delete", cabinetController.cabinet_delete_post);
router.get(
  "/cabinet/:id/update",
  setUserRole,
  cabinetController.cabinet_update_get
);
router.post(
  "/cabinet/:id/update",
  upload.single("image"),
  cabinetController.cabinet_update_post
);

// CPU routes
router.get("/cpus", cpuController.cpu_list);
router.get("/cpu/create", setUserRole, cpuController.cpu_create_get);
router.post(
  "/cpu/create",
  upload.single("image"),
  cpuController.cpu_create_post
);
router.get("/cpu/:id", cpuController.cpu_detail);
router.get("/cpu/:id/delete", setUserRole, cpuController.cpu_delete_get);
router.post("/cpu/:id/delete", cpuController.cpu_delete_post);
router.get("/cpu/:id/update", setUserRole, cpuController.cpu_update_get);
router.post(
  "/cpu/:id/update",
  upload.single("image"),
  cpuController.cpu_update_post
);

// GPU routes
router.get("/gpus", gpuController.gpu_list);
router.get("/gpu/create", setUserRole, gpuController.gpu_create_get);
router.post(
  "/gpu/create",
  upload.single("image"),
  gpuController.gpu_create_post
);
router.get("/gpu/:id", gpuController.gpu_detail);
router.get("/gpu/:id/delete", setUserRole, gpuController.gpu_delete_get);
router.post("/gpu/:id/delete", gpuController.gpu_delete_post);
router.get("/gpu/:id/update", setUserRole, gpuController.gpu_update_get);
router.post(
  "/gpu/:id/update",
  upload.single("image"),
  gpuController.gpu_update_post
);

// Motherboard routes
router.get("/motherboards", motherboardController.motherboard_list);
router.get(
  "/motherboard/create",
  setUserRole,
  motherboardController.motherboard_create_get
);
router.post(
  "/motherboard/create",
  upload.single("image"),
  motherboardController.motherboard_create_post
);
router.get("/motherboard/:id", motherboardController.motherboard_detail);
router.get(
  "/motherboard/:id/delete",
  setUserRole,
  motherboardController.motherboard_delete_get
);
router.post(
  "/motherboard/:id/delete",
  motherboardController.motherboard_delete_post
);
router.get(
  "/motherboard/:id/update",
  setUserRole,
  motherboardController.motherboard_update_get
);
router.post(
  "/motherboard/:id/update",
  upload.single("image"),
  motherboardController.motherboard_update_post
);

// PowerSupply routes
router.get("/powerSupplies", powerSupplyController.powerSupply_list);
router.get(
  "/powerSupply/create",
  setUserRole,
  powerSupplyController.powerSupply_create_get
);
router.post(
  "/powerSupply/create",
  upload.single("image"),
  powerSupplyController.powerSupply_create_post
);
router.get("/powerSupply/:id", powerSupplyController.powerSupply_detail);
router.get(
  "/powerSupply/:id/delete",
  setUserRole,
  powerSupplyController.powerSupply_delete_get
);
router.post(
  "/powerSupply/:id/delete",
  powerSupplyController.powerSupply_delete_post
);
router.get(
  "/powerSupply/:id/update",
  setUserRole,
  powerSupplyController.powerSupply_update_get
);
router.post(
  "/powerSupply/:id/update",
  upload.single("image"),
  powerSupplyController.powerSupply_update_post
);

// Ram routes
router.get("/rams", ramController.ram_list);
router.get("/ram/create", setUserRole, ramController.ram_create_get);
router.post(
  "/ram/create",
  upload.single("image"),
  ramController.ram_create_post
);
router.get("/ram/:id", ramController.ram_detail);
router.get("/ram/:id/delete", setUserRole, ramController.ram_delete_get);
router.post("/ram/:id/delete", ramController.ram_delete_post);
router.get("/ram/:id/update", setUserRole, ramController.ram_update_get);
router.post(
  "/ram/:id/update",
  upload.single("image"),
  ramController.ram_update_post
);

// Storage routes
router.get("/storages", storageController.storage_list);
router.get(
  "/storage/create",
  setUserRole,
  storageController.storage_create_get
);
router.post(
  "/storage/create",
  upload.single("image"),
  storageController.storage_create_post
);
router.get("/storage/:id", storageController.storage_detail);
router.get(
  "/storage/:id/delete",
  setUserRole,
  storageController.storage_delete_get
);
router.post("/storage/:id/delete", storageController.storage_delete_post);
router.get(
  "/storage/:id/update",
  setUserRole,
  storageController.storage_update_get
);
router.post(
  "/storage/:id/update",
  upload.single("image"),
  storageController.storage_update_post
);

module.exports = router;
