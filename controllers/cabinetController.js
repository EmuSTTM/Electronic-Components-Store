const Cabinet = require("../models/cabinet");

// Display list of all Cabinets.
exports.cabinet_list = function (req, res, next) {
    Cabinet.find({}, "name brand dimension type price ")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_cabinet) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("cabinet/cabinet_list", { title: "Cabinet List", cabinet_list: list_cabinet });
      });
  };


  exports.cabinet_detail = (req, res, next) => {
      Cabinet.findById(req.params.id)
          .populate('brand')
          .exec((err, cabinet) => {
              if (err) {
                  return next(err);
              }
              if (cabinet == null) {
                  const err = new Error("Cabinet not found");
                  err.status = 404;
                  return next(err);
              }
              res.render("cabinet/cabinet_detail", {
                  title: "Cabinet Detail",
                  cabinet: cabinet,
              });
          });
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
