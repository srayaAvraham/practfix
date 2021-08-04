const express = require('express');
const router = express.Router();
const Minio = require('minio')
const mongoService = require('../services/mongoService');

const minioClient = new Minio.Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'miniominio',
  secretKey: 'miniominio'
});

router.get('/all', async function (req, res) {
  try {
    const result = await mongoService.getAllPhysioVideo()
    res.json(result)
  } catch (err) {
    res.status(500).send(err)
  }
});

router.get('/video/:id/:userId', async function (req, res) {
  let { id, userId } = req.params;

  try {
    const result = await mongoService.practiceOfVideoPerUser(userId, id);
    res.json(result)
  } catch (err) {
    console.log(error)
    res.status(500).send(err)
  }
});

router.get("/picture/all", function (req, res) {
  let list = [];
  const objectsStream = minioClient.listObjects('thumbnail', '', true);

  objectsStream.on('data', function (obj) {
    console.log(obj);
    // Lets construct the URL with our object name.
    var publicUrl = minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'thumbnail' + '/' + obj.name
    list.push(publicUrl);
  });
  objectsStream.on('error', function (e) {
    console.log(e);
  });
  objectsStream.on('end', function (e) {
    console.log(list);
    // Pass our assets array to our home.handlebars template.
    return res.send(list);
  });

});

router.get("/picture/:id", function (req, res) {
  console.log(req.params)
  minioClient.getObject("thumbnail", 'thumbnail-myFile-1621609754762.png', function (error, stream) {
    if (error) {
      return res.status(500).send(error);
    }
    stream.pipe(res);
  });
});

// router.get("/video/:id", function(req, res) {
//   console.log(req.params)
//   minioClient.getObject("videos", 'thumbnail-myFile-1621609754762.png' , function(error, stream) {
//       if(error) {
//           return res.status(500).send(error);
//       }
//       stream.pipe(res);
//   });
// });

module.exports = router;