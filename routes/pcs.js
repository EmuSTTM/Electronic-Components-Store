const express = require("express");
const router = express.Router();

// Index routes
router.get("/", function(req, res, next) {
    res.render("pcs", {title : "Computers"});
});

module.exports = router;