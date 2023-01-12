const RAM = require("../models/ram");

// Display list of all Ram.
exports.ram_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Ram list");
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
