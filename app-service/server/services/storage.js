const multer = require('multer');
const path = require('path');
const { uuid } = require('uuidv4');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uuid() + path.extname(file.originalname))
  }
})


module.exports = {
  disk: multer({ storage: diskStorage })
}
