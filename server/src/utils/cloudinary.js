const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sermonStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";
    let folder = "scoe-sermons";

    if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "scoe-sermons/videos";
    } else if (file.mimetype.startsWith("audio/")) {
      resourceType = "video";
      folder = "scoe-sermons/audio";
    } else if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      folder = "scoe-sermons/pdfs";
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ["mp4", "mov", "avi", "mp3", "wav", "m4a", "ogg", "pdf"],
    };
  },
});

const uploadSermon = multer({
  storage: sermonStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadSermon };
