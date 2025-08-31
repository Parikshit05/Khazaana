// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("../upload/cloudinary");
// const fs = require("fs");
// const router = express.Router();

// // Multer setup for temporary local storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Upload endpoint
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "ExpenseTracker",
//     });

//     // Remove local file
//     fs.unlinkSync(req.file.path);

//     // Send back Cloudinary URL with field name 'imageUrl'
//     res.status(200).json({ imageUrl: result.secure_url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const cloudinary = require("../upload/cloudinary");
const router = express.Router();

// Multer setup to store file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a writeable stream to upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ExpenseTracker" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Upload failed" });
        }
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    // Pipe the file buffer into the Cloudinary upload stream
    stream.end(req.file.buffer);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;