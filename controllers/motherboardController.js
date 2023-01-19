const Motherboard = require("../models/motherboard");
const Brand = require("../models/brand");

const { body, validationResult } = require("express-validator");



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
          motherboard: motherboard,
          motherboard_brand: motherboard.brand,
      });
  });
};





// Display Motherboard create form on GET.
exports.motherboard_create_get = (req, res, next) => {
  Brand.find((err, brands) => {
    if(err){
      return next(err);
    }
    res.render("motherboard/motherboard_form", {
      title:"Add Motherboard",
      brands: brands,
    })
  })
};

// Handle Motherboard create on POST.
exports.motherboard_create_post = [ 
   // Convert the brand to an array.  
(req, res, next) => {    
  if (!Array.isArray(req.body.brand)) {
    req.body.brand = typeof req.body.brand === "undefined" ? [] : [req.body.brand];
    }
    next();
  },
  // Validate and sanitize the name field.
  body("name", "Motherboard name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the brand field.
  body("brand.*", "Motherboard brand is required").escape(),
  // Validate and sanitize the chipset field.
  body("chipset", "Chipset is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the ram_slots field.
  body("ram_slots", "Ram slots is required").trim().isLength({ min: 1 }).escape(),
  // Validate and sanitize the max_ram field.
  body("max_ram", "Max Ram is required").trim().isLength({ min: 3 }).escape(),
  // Validate and sanitize the price field.
  body("price", "Motherboard price is required").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Motherboard object with escaped and trimmed data.
    const motherboard = new Motherboard({
      name: req.body.name,
      brand: req.body.brand,
      chipset: req.body.chipset,
      ramSlots: req.body.ram_slots,
      maxRam: req.body.max_ram,
      price: req.body.price
    });

    if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        Brand.find((err, brands) => {
          if(err){
            return next(err);
          }
          res.render("motherboard/motherboard_form", {
            title:"Add Motherboard",
            brands: brands,
            motherboard,
            errors: errors.array(),
          })
        })
        return;
    } else {
        // Data from form is valid.
        // Check if motherboard with same name already exists.
        Motherboard.findOne({ name: req.body.name }).exec((err, found_motherboard) => {
          if (err) {
              return next(err);
          }
          if (found_motherboard) {
            // Motherboard exists, redirect to its detail page.
            res.redirect(found_motherboard.url);
          } else {
            motherboard.save((err) => {
              if (err) {
                return next(err);
                }
                // Motherboardsaved. Redirect to Motherboard detail page.
                res.redirect(motherboard.url);
                });
            }
          });
        }
  }
];


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
