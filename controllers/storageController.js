const Storage = require("../models/storage");

// Display list of all Storage.
exports.storage_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage list");
};

// Display detail page for a specific Storage.
exports.storage_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Storage detail: ${req.params.id}`);
};

// Display Storage create form on GET.
exports.storage_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage create GET");
};

// Handle Storage create on POST.
exports.storage_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage create POST");
};

// Display Storage delete form on GET.
exports.storage_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage delete GET");
};

// Handle Storage delete on POST.
exports.storage_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage delete POST");
};

// Display Storage update form on GET.
exports.storage_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage update GET");
};

// Handle Storage update on POST.
exports.storage_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Storage update POST");
};
