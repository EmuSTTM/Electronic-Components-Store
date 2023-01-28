const express = require("express");
const router = express.Router();

const computer_controller = require("../controllers/computerController");

// Middleware of multers 
const upload = require("../middlewares/uploadImage");




router.get("/", computer_controller.computer_list);
// El get y el post de CREATE están en las rutas index.
router.get("/computer/:id", computer_controller.computer_detail);
router.get("/computer/:id/delete", computer_controller.computer_delete_get)
router.post("/computer/:id/delete", computer_controller.computer_delete_post)
// Los de update también estan en el index

module.exports = router;