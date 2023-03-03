const express = require("express");
const router = express.Router();

const computer_controller = require("../controllers/computerController");

// Middleware of multers
const upload = require("../middlewares/uploadImage");

router.get("/", computer_controller.computer_list);
// El get y el post de CREATE están en las rutas index.
router.get("/:id", computer_controller.computer_detail);
router.get("/:id/delete", computer_controller.computer_delete_get);
router.post("/:id/delete", computer_controller.computer_delete_post);

router.get("/:id/update", computer_controller.computer_update_get);
router.post(
  "/:id/update",
  upload.single("image"),
  computer_controller.computer_update_post
);
// Los de update también estan en el index

module.exports = router;
