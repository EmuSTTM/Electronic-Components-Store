module.exports = function checkUserRole(req, res, next) {
    console.log("se ejecuto el coso ese")
    if (req.session && req.session.user && req.session.user.rol === 'vendedor') {
      return next();
    } else {
      return res.render('error', {title:"Error", message_title : "Error de enrutado",
    message: "No puedes acceder con tus permisos a esta URL. Si quieres acceder, por favor registrate con el rol de vendedor."}); // Redirige al usuario a la página de inicio de sesión
    }
  };