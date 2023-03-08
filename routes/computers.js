const express = require("express");
const router = express.Router();

const computerController = require("../controllers/computer_controller");

// Middleware of multers
const upload = require("../middlewares/uploadImage");
const setUserRole = require("../middlewares/setUserRole");

router.get("/", computerController.computer_list);
// El get y el post de CREATE están en las rutas index.
router.get("/:id", computerController.computer_detail);
router.get("/:id/delete", setUserRole, computerController.computer_delete_get);
router.post("/:id/delete", computerController.computer_delete_post);

router.get("/:id/update", setUserRole, computerController.computer_update_get);
router.post(
  "/:id/update",
  upload.single("image"),
  computerController.computer_update_post
);
// Los de update también estan en el index

module.exports = router;
