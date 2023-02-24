

const User = require("../models/user");

const { body, validationResult } = require("express-validator");


// Display list of all user.
exports.user_list = function (req, res, next) {
    User.find({}, "name rol")
      .sort({ name: 1 })
      .exec(function (err, list_user) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("user/user_list", { title: "user List", user_list: list_user });
      });
  };



  // Display user create form on GET.
exports.user_create_get = (req, res, next) => {
      res.render("user/singup", {
        title:"singup",
        })
  };



  exports.user_create_post = [
    // Validaciones para el nombre del campo
    body("name", "user name is required").trim().isLength({ min: 1 }).escape(),

    // Validaciones para el campo de correo electrónico
    body('correo')
    .isEmail().withMessage('El correo electrónico debe ser válido')
    .normalizeEmail(),

    // Validaciones para el campo de contraseña
    body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),

    // Validaciones para el campo de rol
    body('rol')
    .isIn(['vendedor', 'comprador']).withMessage('El rol debe ser "vendedor" o "comprador"'),

    (req,res,next) =>{
        const errors = validationResult(req)

        const user = new User({
            name : req.body.name,
            password : req.body.password,
            email: req.body.email,
            rol: req.body.rol,
        })

        if(!errors.isEmpty()){
            res.render("user/singup", {
                title:"singup",
                user,
                errors,
                })
            return;
        } else {
            User.findOne({ name : req.body.name}).exec((err, found_user) => {
                if (err) return next(err);

                if(found_user){
                    res.render("user/singup", {
                        title:"singup",
                        user,
                        message: "username already exist"
                        })
                } else {
                    user.save((err)=>{
                        if (err) return next(err);
                        // Almacenamos en el localstorage la información del usuario
                        localStorage.setItem('user',JSON.stringify(user))
                        res.redirect("/");

                        
                    })
                }
            })
        }
    }

  ]



    // Display user login form on GET.
exports.user_login_get = (req, res, next) => {
    res.render("user/login", {
      title:"login",
  })
};



exports.user_login_post = [
    body("name", "user name is required").trim().isLength({ min: 1 }).escape(),

    body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
    (req,res,next) =>{
                const errors = validationResult(req)
        
                const user = new User({
                    name : req.body.name,
                    password : req.body.password,
                })
        
                if(!errors.isEmpty()){
                    res.render("user/login", {
                        title:"login",
                        user,
                        errors,
                        })
                    return;
                } else {
                    User.findOne({ name : req.body.name, password: req.body.password}).exec((err, found_user) => {
                        if (err) return next(err);
        
                        if(found_user){
                            if (err) return next(err);
                            localStorage.setItem('user',JSON.stringify(user));
                            res.redirect("/");
                        } else { 
                            res.render("user/login", {
                                title:"login",
                                user,
                                message: "username or password is incorrect"
                            })
                        }
                    })
                }
            }

]

