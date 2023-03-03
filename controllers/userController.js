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
      res.render("user/user_list", {
        title: "user List",
        user_list: list_user,
      });
    });
};

// Display user create form on GET.
exports.user_create_get = (req, res, next) => {
  res.render("user/signup", {
    title: "signup",
  });
};

exports.user_create_post = [
  // Validaciones para el nombre del campo
  body("name", "user name is required").trim().isLength({ min: 1 }).escape(),

  // Validaciones para el campo de correo electrónico
  body("email")
    .isEmail()
    .withMessage("El correo electrónico debe ser válido")
    .normalizeEmail(),

  // Validaciones para el campo de contraseña
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número"),

  body("confirmPassword", "Confirm the password")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Validaciones para el campo de rol
  body("rol")
    .isIn(["vendedor", "comprador"])
    .withMessage('El rol debe ser "vendedor" o "comprador"'),

  (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      rol: req.body.rol,
    });

    // Validamos que las contraseñas sean las mismas
    if (req.body.confirmPassword !== req.body.password) {
      const noEqualPassword = "The passwords are not equal";
      res.render("user/signup", {
        title: "signup",
        user,
        message: noEqualPassword,
      });
    }

    if (!errors.isEmpty()) {
      res.render("user/signup", {
        title: "signup",
        user,
        errors: errors.errors,
      });
      return;
    } else {
      User.findOne({ name: req.body.name }).exec((err, found_user) => {
        if (err) return next(err);

        if (found_user) {
          res.render("user/signup", {
            title: "signup",
            user,
            message: "username already exist",
          });
        } else {
          user.save((err) => {
            if (err) return next(err);
            // Almacenamos en el localstorage la información del usuario
            req.session.user = user; // Store the user object in the session
            res.redirect("/");
          });
        }
      });
    }
  },
];

// Display user login form on GET.
exports.user_login_get = (req, res, next) => {
  res.render("user/login", {
    title: "login",
  });
};

exports.user_login_post = [
  body("name", "User name is required").trim().isLength({ min: 1 }).escape(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user/login", {
        title: "Login",
        user: req.body,
        errors: errors.array(),
      });
      return;
    }

    User.findOne({ name: req.body.name, password: req.body.password }).exec(
      (err, found_user) => {
        if (err) return next(err);

        if (found_user) {
          req.session.user = found_user; // Store the user object in the session
          res.redirect("/");
        } else {
          res.render("user/login", {
            title: "Login",
            user: req.body,
            message: "Username or password is incorrect",
          });
        }
      }
    );
  },
];
