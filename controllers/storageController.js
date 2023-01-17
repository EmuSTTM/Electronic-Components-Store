const Storage = require("../models/storage");

// Display list of all Storage.
exports.storage_list = function (req, res, next) {
    Storage.find({}, "name brand type interface price")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_storage) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("storage/storage_list", { title: "Storage List", storage_list: list_storage });
      });
  };

//   name: 'Seagate Barracuda 2TB',
//   brand: 'Seagate',
//   type: 'HDD',
//   capacity: '2 TB',
//   interface: 'SATA',
//   price: 50

// Display detail page for a specific Storage.
exports.storage_detail = (req, res) => {
  Storage.findById(req.params.id)
  .populate("brand")
  .exec(
(err, storage) => {
  if(err){
    return next(err);
  }
  if(storage == null){
    // No results
    const err = new Error("Storage not found");
    err.status = 404;
    return next(err);
  }
  // Todo sucedió correctamente
  res.render("storage/storage_detail",{
    title:"Storage Detail",
    storage: storage,
  })
})
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
