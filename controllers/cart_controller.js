
exports.index = function (req, res, next) {
  // res.send('Está hecho el carrito nashe')
  res.render("cart", { title: "Shopping Cart", session: req.session });
};

exports.cart_computer = function (req, res, next) {
  res.render("cart", { title: "Shopping Cart", session: req.session });
};
