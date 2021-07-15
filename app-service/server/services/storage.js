const multer = require('multer');
const path = require('path');
const Minio = require('minio')
const multerS3 = require('multer-minio-storage-engine');
const { uuid } = require('uuidv4');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9003,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uuid() + path.extname(file.originalname))
  }
})


const minioStorage = multerS3({
  minio: minioClient,
  bucketName: 'videos',
  metaData: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  objectName: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
})


module.exports = {
  disk: multer({ storage: diskStorage }),
  minio: multer({ storage: minioStorage }),
}
