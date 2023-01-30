
const CPU = require("../models/cpu");
const Brand = require("../models/brand");

const { body, validationResult } = require("express-validator");
const async = require("async");
const fs = require("fs");



// Display list of all cpus.
exports.cpu_list = (req, res, next) => {
    CPU.find({}, "name brand model core_count thread_count clock_speed socket price image")
      .sort({ name: 1 })
      .populate("brand")
      .exec(function (err, list_cpu) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("cpu/cpu_list", { title: "CPU List", cpu_list: list_cpu });
      });
}

// Display detail page for a specific cpu.
exports.cpu_detail = (req, res, next) => {

    CPU.findById(req.params.id)
      .populate('brand')
      .exec(
    (err, cpu) => {
      if(err){
        return next(err);
      }
      if(cpu == null){
        // No results
        const err = new Error("cpu not found");
        err.status = 404;
        return next(err);
      }
      // Todo sucedió correctamente
      res.render("cpu/cpu_detail",{
        title:"cpu Detail",
        cpu:cpu,
        cpu_brand: cpu.brand,
      })
    })
  };
  
  // Display cpu create form on GET.
  exports.cpu_create_get = (req, res, next) => {
    Brand.find((err, brands) => {
      if(err){
        return next(err);
      }
      res.render("cpu/cpu_form", {
        title:"Add cpu",
        brands: brands,
      })
    })
  };

// Handle cpu create on POST.
exports.cpu_create_post = [ 
   // Validate and sanitize the fiels.
   body("name", "cpu name is required").trim().isLength({ min: 1 }).escape(),
   body("brand", "cpu brand is required").escape(),
   body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
   body("coreCount", "cpu memory is required").trim().isLength({ min: 1 }).escape(),
   body("threadCount", "memory type is required").trim().isLength({ min: 1 }).escape(),
   body("clockSpeed", "cpu core_clock is required").trim().isLength({ min: 1 }).escape(),
   body("frecuencyRam", "cpu core_frecuency_ram is required").trim().isLength({ min: 1 }).escape(),
   body("socket","boost clock is required").trim().isLength({ min: 1 }).escape(),
   body("price", "stream processors is required").trim().isLength({ min: 1 }).escape(),
 
   // Process request after validation and sanitization.
   (req, res, next) => {
     // Extract the validation errors from a request.
     const errors = validationResult(req);
 
     // Create a cpu object with escaped and trimmed data.
     const cpu = new CPU({
       name: req.body.name,
       brand: req.body.brand,
       model: req.body.model,
       core_count: req.body.coreCount,
       thread_count: req.body.threadCount,
       clock_speed: req.body.clockSpeed,
       socket: req.body.socket,
       frecuency_ram: req.body.frecuencyRam,
       price: req.body.price,
       image: req.file.filename,
     });
     
     if (!errors.isEmpty()) {
         // There are errors. Render the form again with sanitized values/error messages.
         Brand.find((err, brands) => {
           if(err){
             return next(err);
           }
           res.render("cpu/cpu_form", {
             title:"Add cpu",
             brands: brands,
             cpu,
             errors: errors.array(),
           })
         })
         return;
     } else {
         // Data from form is valid.
         // Check if cpu with same name already exists.
         CPU.findOne({ name: req.body.name }).exec((err, found_cpu) => {
           if (err) {
               return next(err);
           }
           if (found_cpu) {
             // cpu exists, redirect to its detail page.
             res.redirect(found_cpu.url);
           } else {
             cpu.save((err) => {
               if (err) {
                 return next(err);
                 }
                 // cpu saved. Redirect to cpu detail page.
                 res.redirect(cpu.url);
                 });
             }
           });
         }
   }
 ];



// Display cpu delete form on GET.
exports.cpu_delete_get = (req, res, next) => {
     CPU.findById(req.params.id)
      .exec((err, cpu) =>{
        if(err){
          return next(err);
        }
        if(cpu == null){
          res.redirect("/components/cpus")
        }
        res.render("cpu/cpu_delete", {
          title :"Remove cpu",
          cpu : cpu,
        })
      })
  };

// Handle cpu delete on POST.
exports.cpu_delete_post = (req, res, next) => {
    CPU.findById(req.body.cpuid)
    .exec((err, cpu) =>{
      if (err) {
        return next(err);
      }
      if(cpu == null){
        res.redirect("/components/cpus")
      }
      CPU.findByIdAndRemove(req.body.cpuid, (err) => {
        if (err) {
          return next(err);
        }
        if(typeof cpu.image != undefined){
          const ImageName = "public/images/" + cpu.image
  
          if(fs.existsSync(ImageName)){
            fs.unlinkSync(ImageName);
        }
        }  
        // Success - go to author list
        res.redirect("/components/cpus");
      })
    })
  };

// Display cpu update form on GET.
exports.cpu_update_get = (req, res, next) => {
    async.parallel({
        cpu(callback){
          CPU.findById(req.params.id)
          .populate("brand")
          .exec(callback)
        },
        cpu_brands(callback){
          Brand.find(callback)
        }
      },
      (err, results) =>{
        if (err) {
          return next(err);
        }
        if (results.cpu == null) {
          // No results.
          const err = new Error("cpu not found");
          err.status = 404;
          return next(err);
      }
      for (const brand of results.cpu_brands) {
          if (brand._id.toString() === results.cpu.brand._id.toString()) {
            brand.checked = "true";
          }
      }
      res.render("cpu/cpu_form", {
        title :"Update cpu",
        cpu: results.cpu,
        brands: results.cpu_brands
      })
  })
}

// Display cpu update form on POST.
exports.cpu_update_post = [
     // Validate and sanitize the fiels.
   body("name", "cpu name is required").trim().isLength({ min: 1 }).escape(),
   body("brand", "cpu brand is required").escape(),
   body("model", "Model is required").trim().isLength({ min: 1 }).escape(),
   body("coreCount", "cpu memory is required").trim().isLength({ min: 1 }).escape(),
   body("threadCount", "memory type is required").trim().isLength({ min: 1 }).escape(),
   body("clockSpeed", "cpu core_clock is required").trim().isLength({ min: 1 }).escape(),
   body("frecuencyRam", "cpu core_frecuency_ram is required").trim().isLength({ min: 1 }).escape(),
   body("socket","boost clock is required").trim().isLength({ min: 1 }).escape(),
   body("price", "stream processors is required").trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      
      // Create a cpu object with escaped/trimmed data and old id.
      const cpu = new CPU({
        name: req.body.name,
       brand: req.body.brand,
       model: req.body.model,
       core_count: req.body.coreCount,
       thread_count: req.body.threadCount,
       clock_speed: req.body.clockSpeed,
       frecuency_ram: req.body.frecuencyRam,
       socket: req.body.socket,
       price: req.body.price,
       image: req.file.filename,
        _id: req.params.id,
      });
      
      if (!errors.isEmpty()) {
        async.parallel({
          cpu(callback){
            CPU.findById(req.params.id)
            .populate("brand")
            .exec(callback)
          },
          cpu_brands(callback){
            Brand.find(callback)
          }
        },
        (err, results) =>{
          if (err) {
            return next(err);
          }
          if (results.cpu == null) {
            // No results.
            const err = new Error("cpu not found");
            err.status = 404;
            return next(err);
        }
        for (const brand of results.cpu_brands) {
            if (brand._id.toString() === results.cpu.brand._id.toString()) {
              brand.checked = "true";
            }
        }
        if(typeof results.cpu.image != undefined){
          const ImageName = "public/images/" + results.cpu.image;
  
          if(fs.existsSync(ImageName)){
            fs.unlinkSync(ImageName);
        }}
        
        res.render("cpu/cpu_form", {
          title :"Update cpu",
          cpu: results.cpu,
          brands: results.cpu_brands,
          cpu,
          errors: errors.array(),
        })
      })
        return;
      }
      CPU.findById(req.params.id, (err, cpu) => {
        if (err) {
          return next(err);
        }
        if(typeof cpu.image != undefined){
          const ImageName = "public/images/" + cpu.image;
  
          if(fs.existsSync(ImageName)){
            fs.unlinkSync(ImageName);
        }}
      })
  
      // Data from form is valid. Update the record.
      CPU.findByIdAndUpdate(req.params.id, cpu, {}, (err, thecpu) => {
        if (err) {
          return next(err);
        }
  
        // Successful: redirect to cpu detail page.
        
        res.redirect(thecpu.url);
      });
    },
  ];
  
