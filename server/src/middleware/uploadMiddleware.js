const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename =
      crypto.randomBytes(16).toString("hex") + ext;

    cb(null, filename);
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB per image
  },
});

module.exports = upload;