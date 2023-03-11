const multer = require("multer");
const date = Date.now();
const GridFsStorage = require("multer-gridfs-storage")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ECS";

const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const date = Date.now();
      const filename = file.fieldname + '-' + date + '.' + file.originalname.split('.').pop();
      const fileInfo = {
        filename: filename,
        bucketName: 'images'
      };
      resolve(fileInfo);
    });
  }
});
const upload = multer({
  storage: storage
});

module.exports = upload;
