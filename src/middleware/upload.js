const multer = require('multer');

// Usar almacenamiento en memoria para procesar la imagen antes de subirla a Azure
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const ext = require('path').extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error(`Formato inválido: ${file.mimetype}`));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
