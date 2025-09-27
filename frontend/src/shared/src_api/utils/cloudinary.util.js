const { deleteImage } = require("../config/cloudinary.config");

const deleteByPublicId = async (publicId) => {
  if (!publicId) return;
  
  try {
    const result = await deleteImage(publicId);
    if (result.result === "ok") {
      console.log(`Imagen eliminada de Cloudinary: ${publicId}`);
    } else if (result.result === "not_configured") {
      console.warn("Cloudinary no está configurado. No se puede eliminar la imagen:", publicId);
    } else {
      console.warn("No se pudo eliminar la imagen de Cloudinary:", result.error);
    }
  } catch (error) {
    console.error("Error al eliminar imagen de Cloudinary:", error);
    // No lanzar el error para evitar que falle la operación principal
  }
};

const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

module.exports = { deleteByPublicId, extractPublicIdFromUrl };
