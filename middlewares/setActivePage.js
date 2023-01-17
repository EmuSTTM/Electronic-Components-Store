module.exports = function setActivePage(req, res, next) {
    if (req.url.startsWith("/components")) {
        res.locals.menuOption = "components";
    } else if (req.url.startsWith("/pcs")) {
        res.locals.menuOption = "pcs";
    } else if (req.url.startsWith("/pcBuild")) {
        res.locals.menuOption = "pcBuild";
    }
    option = res.locals.menuOption 
    next();
}
