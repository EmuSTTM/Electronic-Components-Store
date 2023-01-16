const RAM = require("../models/ram");

// Display list of all Ram. // brand model size speed type price
exports.ram_list = function (req, res, next) {
    RAM.find({}, "brand model size speed type price")
      .sort({ speed: 1 })
      .populate("brand")
      .exec(function (err, list_ram) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("ram/ram_list", { title: "Ram List", ram_list: list_ram });
      });
  };

// Display detail page for a specific Ram.
exports.ram_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Ram detail: ${req.params.id}`);
};

// Display Ram create form on GET.
exports.ram_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram create GET");
};

// Handle Ram create on POST.
exports.ram_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram create POST");
};

// Display Ram delete form on GET.
exports.ram_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram delete GET");
};

// Handle Ram delete on POST.
exports.ram_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram delete POST");
};

// Display Ram update form on GET.
exports.ram_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram update GET");
};

// Handle Ram update on POST.
exports.ram_update_post = (req,res) => {
    res.send("NOT IMPLEMENTED: Ram update POST")
};
