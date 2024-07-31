const multer = require("multer");

const s = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: s });

module.exports = upload;
