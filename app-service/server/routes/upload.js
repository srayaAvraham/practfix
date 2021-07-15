const express = require('express');
const router = express.Router();
const { gwnerateThumbnail, uploadToDrive } = require('../services/upload')
const Minio = require('minio')
const fs = require('fs')
const path = require('path');
const upload = require('../services/storage')
const {Video} = require('../models/Video')
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'miniominio',
  secretKey: 'miniominio'
});

router.post('/', upload.disk.single('myFile'), async function(req, res) {
    const { file } = req;
    let [title, description, user] = Object.values(req.body)
    let metadata = await gwnerateThumbnail(req, file.path)
    try{
      minioClient.bucketExists('practfix-minio', function(err, exists) {
        if (err) {
          return console.log(err)
        }
        if (exists) {
          return console.log('Bucket exists.')
        }
      })
      await minioClient.fPutObject("practfix-minio" , `videos/${file.filename}`,file.path,{})
      await minioClient.fPutObject("practfix-minio" , `thumbnail/${metadata.fileName}`,metadata.url,{})

      const document = {
          title: title,
          description: description,
          videoPath: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix-minio/videos' + '/' + file.filename,
          duration: metadata.fileDuration,
          thumbnail: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix-minio/thumbnail' + '/' + metadata.fileName,
          isPatient: false,
          uploader: user

      }
      let video = new Video(document);
      let doc = await video.save();
      console.log(doc);
      let drive = await uploadToDrive(file.path , "physio" + '_' + doc._id + path.extname(file.filename), file.mimetype);
      fs.unlinkSync(file.path);
      fs.unlinkSync(metadata.url);
      res.send({ status: 'success', doc }) 

    }catch(err){
      console.log(err)
        res.send({ status: 'error', err })
    }

});

router.post('/:parentId/:user', upload.disk.single('myFile'), async function(req, res) {
  const { file } = req;
  const { user, parentId } = req.params;
  // let [ parentId ] = Object.values(req.body)
  let metadata = await gwnerateThumbnail(req, file.path)
  try{
    
    await minioClient.fPutObject("practfix-minio" , `videos/${file.filename}`,file.path,{})
    await minioClient.fPutObject("practfix-minio" , `thumbnail/${metadata.fileName}`,metadata.url,{})

    const document = {
        videoPath: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix-minio/videos' + '/' + file.filename,
        duration: metadata.fileDuration,
        thumbnail: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix-minio/thumbnail' + '/' + metadata.fileName,
        physioVideoId: parentId,
        isPatient: true,
        uploader: user
    }
    let video = new Video(document);
    let doc = await video.save();
    console.log(doc);
    let drive = await uploadToDrive(file.path , "patient" + '_' + doc._id + path.extname(file.filename), file.mimetype);
    console.log(drive)
    console.log(file.path);
    fs.unlinkSync(file.path);
    fs.unlinkSync(metadata.url);
    res.send({ status: 'success', doc }) 

  }catch(err){
    console.log(err)
      res.send({ status: 'error', err })
  }

});

module.exports = router;