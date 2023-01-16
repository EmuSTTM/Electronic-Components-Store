const PowerSupply = require("../models/powerSupply");

// Display list of all PowerSupply.
exports.powerSupply_list = function (req, res, next) {
    PowerSupply.find({}, "name brand model power certifications price")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_powerSupply) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("powerSupply/powerSupply_list", { title: "PowerSupply List", powerSupply_list: list_powerSupply });
      });
  };
// El campo name es requerido y debe ser una cadena de caracteres
// El campo brand es una clave foranea hacia el esquema Brand, es requerido
// El campo model es requerido y debe ser una cadena de caracteres
// El campo power es requerido, debe ser un número y debe ser mayor a 0
// El campo certifications es un arreglo de strings, con una lista de valores posibles y su valor default.
// El campo price es requerido, debe ser un número y debe ser mayor a 0


// Display detail page for a specific PowerSupply.
exports.powerSupply_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: PowerSupply detail: ${req.params.id}`);
};

// Display PowerSupply create form on GET.
exports.powerSupply_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply create GET");
};

// Handle PowerSupply create on POST.
exports.powerSupply_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply create POST");
};

// Display PowerSupply delete form on GET.
exports.powerSupply_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply delete GET");
};

// Handle PowerSupply delete on POST.
exports.powerSupply_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply delete POST");
};

// Display PowerSupply update form on GET.
exports.powerSupply_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply update GET");
};

// Handle PowerSupply update on POST.
exports.powerSupply_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: PowerSupply update POST");
};
