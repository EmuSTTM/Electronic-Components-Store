var express = require("express");
var router = express.Router();
const computer_controller = require("../controllers/computerController");
const index_controller = require("../controllers/indexController");
const cart_controller = require("../controllers/cartController");
// Middleware of multers
const upload = require("../middlewares/uploadImage");

/* GET home page. */
router.get("/", index_controller.index);

router.get("/cart", cart_controller.index);
router.post("/cart", cart_controller.cart_computer);
// router.post('/cart', cart_controller.buy);

router.get("/pcBuild", computer_controller.computer_create_get);
router.post(
  "/pcBuild",
  upload.single("image"),
  computer_controller.computer_create_post
);

router.get("/pcBuild/:id/update", computer_controller.computer_update_get);
router.post(
  "/pcBuild/:id/update",
  upload.single("image"),
  computer_controller.computer_update_post
);
module.exports = router;
