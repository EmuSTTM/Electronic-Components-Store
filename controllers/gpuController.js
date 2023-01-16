const GPU = require("../models/gpu");

// Display list of all GPU.
exports.gpu_list = function (req, res, next) {
    GPU.find({}, "name brand model memory memory_type core_clock stream_processors tdp price")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_gpu) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("gpu/gpu_list", { title: "GPU List", gpu_list: list_gpu });
      });
  };
// name: nombre de la tarjeta gráfica
// brand: marca de la tarjeta gráfica, se refiere a un objeto de la colección "Brand" mediante su ObjectId.
// model: modelo de la tarjeta gráfica
// memory: capacidad de memoria
// memory_type: tipo de memoria
// core_clock: velocidad de reloj de núcleo
// boost_clock: velocidad de reloj de impulso
// stream_processors: número de procesadores de flujo
// tdp: potencia térmica de diseño
// price: precio de la tarjeta gráfica

// Display detail page for a specific GPU.
exports.gpu_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: GPU detail: ${req.params.id}`);
};

// Display GPU create form on GET.
exports.gpu_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU create GET");
};

// Handle GPU create on POST.
exports.gpu_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU create POST");
};

// Display GPU delete form on GET.
exports.gpu_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU delete GET");
};

// Handle GPU delete on POST.
exports.gpu_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU delete POST");
};

// Display GPU update form on GET.
exports.gpu_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU update GET");
};

// Handle GPU update on POST.
exports.gpu_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GPU update POST");
};
