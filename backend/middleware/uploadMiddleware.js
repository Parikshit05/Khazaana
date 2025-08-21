const multer = require("multer");

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.mimetype);
    const mimetype = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter});

module.exports = upload;
