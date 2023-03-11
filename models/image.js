const mongoose = require('mongoose');

// Definir el esquema para la colección "images.files" en Mongoose
const ImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  aliases: [String],
  metadata: {},
});

// Crear un modelo para la colección "images.files" en Mongoose
const Image = mongoose.model('Image', ImageSchema, 'images.files');

// Función para eliminar una imagen de las colecciones "images.files" y "images.chunks"
const deleteImage = (fileId) => {
  return new Promise((resolve, reject) => {
    // Obtener la conexión a la base de datos de MongoDB
    const db = mongoose.connection.db;
    
    // Crear un bucket para la colección "images" en la base de datos
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'images'
    });

    // Eliminar el archivo de las colecciones "images.files" y "images.chunks"
    bucket.delete(mongoose.Types.ObjectId(fileId), (err) => {
      if (err) {
        reject(err);
      } else {
        // Si se eliminó el archivo correctamente de "images.chunks", elimina también el documento correspondiente de "images.files"
        Image.deleteOne({_id: fileId}, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

module.exports = deleteImage;