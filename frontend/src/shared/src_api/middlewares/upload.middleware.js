// src/middlewares/upload.middleware.js
const multer = require("multer");
const streamifier = require("streamifier");
const { cloudinary } = require("../config/cloudinary.config");

const memoryStorage = multer.memoryStorage();

const uploadImage = (fieldName = "imagen") =>
  multer({
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single(fieldName);

const uploadToCloudinary =
  (folder = "steticsoft") =>
  (req, res, next) => {
    if (!req.file) {
      console.log("📁 No hay archivo para subir a Cloudinary");
      return next();
    }

    console.log("📁 Subiendo archivo a Cloudinary:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      folder: folder
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Error al subir a Cloudinary:", error);
          return next(error);
        }
        console.log("✅ Archivo subido exitosamente a Cloudinary:", {
          secure_url: result.secure_url,
          public_id: result.public_id
        });
        req.file.secure_url = result.secure_url;
        req.file.public_id = result.public_id;
        return next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  };

const processImageUpload = (fieldName = "imagen", folder = "steticsoft") => [
  uploadImage(fieldName),
  uploadToCloudinary(folder),
];

module.exports = { processImageUpload, uploadImage, uploadToCloudinary };
