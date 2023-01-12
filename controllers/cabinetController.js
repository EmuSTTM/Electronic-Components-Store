const Cabinet = require("../models/cabinet");

// Display list of all Cabinets.
exports.cabinet_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet list");
};

// Display detail page for a specific Cabinet.
exports.cabinet_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Cabinet detail: ${req.params.id}`);
};

// Display Cabinet create form on GET.
exports.cabinet_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet create GET");
};

// Handle Cabinet create on POST.
exports.cabinet_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet create POST");
};

// Display Cabinet delete form on GET.
exports.cabinet_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet delete GET");
};

// Handle Cabinet delete on POST.
exports.cabinet_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet delete POST");
};

// Display Cabinet update form on GET.
exports.cabinet_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet update GET");
};

// Handle Cabinet update on POST.
exports.cabinet_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Cabinet update POST");
};
