import fs from "fs";
import amqplib from 'amqplib';
import { getFile } from "./driveService";
import amqp = require("amqplib/callback_api");
import { callToUser, consumeOpenPose } from "./rabbitService";
import mongoService from './mongoService';
import { delay } from './tools/tools';
import { patientHandler, physioHandler } from './tools/handler';
import config from './config';
const { rabbitMQUrl, folderId, queueNameFromOpenPose, bucketName } = config;

consumeOpenPose(folderId, bucketName);
/* amqp.connect(rabbitMQUrl, function (error, connection) {
  if (error) {
    throw error;
  }
  connection.createChannel(function (error, channel) {
    if (error) {
      throw error;
    }
    const queue = queueNameFromOpenPose;

    channel.assertQueue(queue, {
      durable: false,
    });
    channel.prefetch(1);
    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
    channel.consume(queue,
      async function (msg) {
        let { personType, zipFileName: fileName } = JSON.parse(
          msg.content.toString()
        );
        const videoId = fileName.split('_')[1].split('.')[0];
        console.log(" [x] Received %s", fileName);
        try {

          await delay(60000);
          const patientFileZipPath = await getFile(folderId, fileName);

          if (patientFileZipPath) {
            switch (personType) {
              case "patient":
                await patientHandler(videoId, fileName, patientFileZipPath)
                break;
              case "physio":
                await physioHandler(videoId, fileName, patientFileZipPath);
                break;
              default:
                console.error(`Type of person isnt recognized`);
                console.log(" [x] Done");
                return;
                break;
            }

            const user = await mongoService.getUserByVideoId(videoId);
            await callToUser(user.email, user.name, personType);
            fs.unlinkSync(patientFileZipPath);
          } else {
            console.log(`cant find file: ${fileName} in google drive!!`);
          }
          console.log(" [x] Done");
        } catch (error) {
          await mongoService.updateVideoDetails(videoId, { status: 'faild' });
        }
        channel.ack(msg);
      },
      {
        noAck: false,
      }
    );
  });
}
); */
