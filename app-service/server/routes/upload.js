const express = require('express');
const router = express.Router();
const { gwnerateThumbnail, uploadToDrive } = require('../services/upload')
const Minio = require('minio')
const fs = require('fs')
const path = require('path');
const upload = require('../services/storage')
const mongoService = require('../services/mongoService');

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
    console.log(req.body)
    let metadata = await gwnerateThumbnail(req, file.path)
    try{
      await minioClient.fPutObject("practfix" , `videos/${file.filename}`,file.path,{})
      await minioClient.fPutObject("practfix" , `thumbnail/${metadata.fileName}`,metadata.url,{})

      const document = {
          title: title,
          description: description,
          videoPath: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix/videos' + '/' + file.filename,
          duration: metadata.fileDuration,
          thumbnail: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix/thumbnail' + '/' + metadata.fileName,
          isPatient: false,
          uploader: user
      }

      const video = await mongoService.addVideo(document)
      await uploadToDrive(file.path , "physio" + '_' + video._id + path.extname(file.filename), file.mimetype);
      fs.unlinkSync(file.path);
      fs.unlinkSync(metadata.url);
      res.send({ status: 'success', video }) 

    }catch(err){
      console.log(err)
        res.send({ status: 'error', err })
    }

});

router.post('/:parentId/:user', upload.disk.single('myFile'), async function(req, res) {
  const { file } = req;
  const { user, parentId } = req.params;
  let metadata = await gwnerateThumbnail(req, file.path)
  try{
    
    await minioClient.fPutObject("practfix" , `videos/${file.filename}`,file.path,{})
    await minioClient.fPutObject("practfix" , `thumbnail/${metadata.fileName}`,metadata.url,{})

    const document = {
        videoPath: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix/videos' + '/' + file.filename,
        duration: metadata.fileDuration,
        thumbnail: minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'practfix/thumbnail' + '/' + metadata.fileName,
        physioVideoId: parentId,
        isPatient: true,
        uploader: user
    }
    const video = await mongoService.addVideo(document);
    let drive = await uploadToDrive(file.path , "patient" + '_' + video._id + path.extname(file.filename), file.mimetype);

    fs.unlinkSync(file.path);
    fs.unlinkSync(metadata.url);
    console.log(file.path, metadata.url)
    res.send({ status: 'success', video }) 

  }catch(err){
    console.log(err)
      res.send({ status: 'error', err })
  }

});

module.exports = router;