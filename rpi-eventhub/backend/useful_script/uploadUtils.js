const multer = require("multer");
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error('Please upload an image file.'));
        }
        cb(null, true);
    },
}).single('file');

module.exports = { upload };