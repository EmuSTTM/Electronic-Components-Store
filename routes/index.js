var express = require('express');
var router = express.Router();
const computer_controller = require("../controllers/computerController");
const index_controller = require("../controllers/indexController");

// Middleware of multers 
const upload = require("../middlewares/uploadImage");

/* GET home page. */
router.get('/', index_controller.index);


router.get("/pcBuild", computer_controller.computer_create_get);
router.post("/pcBuild", upload.single('image'), computer_controller.computer_create_post);

router.get("/pcBuild/:id/update", computer_controller.computer_update_get)
router.post("/pcBuild/:id/update", upload.single('image'), computer_controller.computer_update_post)
module.exports = router;

