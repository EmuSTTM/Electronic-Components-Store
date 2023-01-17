const Motherboard = require("../models/motherboard");

// Display list of all Motherboards.
exports.motherboard_list = function (req, res, next) {
    Motherboard.find({}, "name brand chipset ramSlots maxRam price")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_motherboard) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("motherboard/motherboard_list", { title: "Motherboard List", motherboard_list: list_motherboard });
      });
  };

  /*
En el atributo "name" se valida que sea un string y que no esté vacío.
En el atributo "brand" se valida que sea un ObjectId válido y que haga referencia a un objeto de la colección "Brand".
En el atributo "price" se valida que sea un número mayor o igual a cero.
En el atributo "chipset" se valida que el valor sea uno de los valores especificados en el enumerado.
En el atributo "ramSlots" se valida que sea un número mayor o igual a cero.
En el atributo "maxRam" se valida que sea una cadena con el formato "X GB" o "X TB".
*/

// Display detail page for a specific Motherboard.
exports.motherboard_detail = (req, res, next) => {
  Motherboard.findById(req.params.id)
  .populate('brand')
  .exec((err, motherboard) => {
      if (err) {
          return next(err);
      }
      if (motherboard == null) {
          // No results
          const err = new Error("Motherboard not found");
          err.status = 404;
          return next(err);
      }
      // Successful, so render
      res.render("motherboard/motherboard_detail", {
          title: "Motherboard Detail",
          motherboard: motherboard
      });
  });
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
