const express = require("express");
const upload = require("../upload/multer"); // <- use the multer config you already made

const router = express.Router();

router.post("/signup", upload.single("image"), (req, res) => {
  try {
    return res.json({ url: req.file.path }); // Cloudinary gives file URL here
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
