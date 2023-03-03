var express = require("express");
var router = express.Router();
const computerController = require("../controllers/computer_controller");
const indexController = require("../controllers/index_controller");
const cartController = require("../controllers/cart_controller");
// Middleware of multers
const upload = require("../middlewares/uploadImage");

/* GET home page. */
router.get("/", indexController.index);

router.get("/cart", cartController.index);
router.post("/cart", cartController.cart_computer);
// router.post('/cart', cartController.buy);

router.get("/pcBuild", computerController.computer_create_get);
router.post(
  "/pcBuild",
  upload.single("image"),
  computerController.computer_create_post
);

router.get("/pcBuild/:id/update", computerController.computer_update_get);
router.post(
  "/pcBuild/:id/update",
  upload.single("image"),
  computerController.computer_update_post
);
module.exports = router;
