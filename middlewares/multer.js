const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/my-images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
