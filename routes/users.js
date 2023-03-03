var express = require("express");
var router = express.Router();

const userController = require("../controllers/user_controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("user_list is not create yet");
});

router.get("/cool", function (req, res, next) {
  res.send("You are so cool!");
});

router.get("/signup", userController.user_create_get);
router.post("/signup", userController.user_create_post);

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    const lastUrl = req.header("Referer") || "/";
    res.redirect(lastUrl);
  });
});

router.get("/login", userController.user_login_get);
router.post("/login", userController.user_login_post);

module.exports = router;
