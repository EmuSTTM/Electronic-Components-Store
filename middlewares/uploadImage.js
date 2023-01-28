const multer = require('multer');
var date = Date.now();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + date + '.' + file.originalname)
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error("Sólo se permiten imágenes"));
        }
        cb(null, true);
      }
});

const upload = multer({ storage: storage });

module.exports = upload