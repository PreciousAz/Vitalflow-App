const express = require("express");
const multer = require("multer");
const path = require("path");
const { success } = require("zod/v4");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG images or PDFs are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// Upload route
router.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({success:false, message: "No file uploaded or invalid format" });
  }

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
  });
});

module.exports = router;
