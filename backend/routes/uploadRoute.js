const express = require("express");
const multer = require("multer");
const cloudinary = require("../upload/cloudinary");
const fs = require("fs");
const router = express.Router();

// Multer setup for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload endpoint
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ExpenseTracker",
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    // Send back Cloudinary URL with field name 'imageUrl'
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
