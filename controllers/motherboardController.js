const Motherboard = require("../models/motherboard");

// Display list of all Motherboards.
exports.motherboard_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard list");
};

// Display detail page for a specific Motherboard.
exports.motherboard_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Motherboard detail: ${req.params.id}`);
};

// Display Motherboard create form on GET.
exports.motherboard_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard create GET");
};

// Handle Motherboard create on POST.
exports.motherboard_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard create POST");
};

// Display Motherboard delete form on GET.
exports.motherboard_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard delete GET");
};

// Handle Motherboard delete on POST.
exports.motherboard_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard delete POST");
};

// Display Motherboard update form on GET.
exports.motherboard_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard update GET");
};

// Handle Motherboard update on POST.
exports.motherboard_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Motherboard update POST");
};
