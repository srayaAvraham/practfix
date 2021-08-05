import fs from "fs";
import { delay } from './tools/tools';
import amqplib from 'amqplib';
import { getFile } from "./driveService";
import { patientHandler, physioHandler } from './tools/handler';
import mongoService from './mongoService';
import {User} from './types';
import config from './config';
const { queueNameToContact, rabbitMQUrl, queueNameFromOpenPose } = config;

/**
 * Connect to rabbitMQ and wait to recive message
 * @param fn callback function to action on data from rabbitMQ
 */
const consumeOpenPose = async (folderId: string, bucketName: string): Promise<void> => {
  const conn = await amqplib.connect(rabbitMQUrl, "heartbeat=60");
  const channel = await conn.createChannel()
  await channel.assertQueue(queueNameFromOpenPose, { durable: true });
  channel.prefetch(1);
  console.log(`[*] Waiting for messages in ${queueNameFromOpenPose}. To exit press CTRL+C`);
  await channel.consume(queueNameFromOpenPose, async function (msg) {
    const { personType, zipFileName: fileName } = JSON.parse(msg.content.toString());
    const videoId = fileName.split('_')[1].split('.')[0];
    console.log(" [x] Received %s", fileName);
    try {
      await delay(60000);
      const patientFileZipPath: string = await getFile(folderId, fileName);

      // Process jsons and in case patient, also create graphs
      if (patientFileZipPath) {
        switch (personType) {
          case "patient":
            await patientHandler(videoId, fileName, patientFileZipPath, bucketName)
            break;
          case "physio":
            await physioHandler(videoId, fileName, patientFileZipPath, bucketName);
            break;
          default:
            console.error(`Type of person isnt recognized`);
            console.log(" [x] Done");
            return;
            break;
        }
        // Send mail to client
        const user: User = await mongoService.getUserByVideoId(videoId);
        await callToUser(user.email, user.name, personType);
        // delete file from tempp directory
        fs.unlinkSync(patientFileZipPath);
      } else {
        console.log(`cant find file: ${fileName} in google drive!!`);
      }
      console.log(" [x] Done");
    } catch (error) {
      await mongoService.updateVideoDetails(videoId, { status: 'faild' });
    }
    channel.ack(msg);
  },/* async function (msg) {
    let { mail, fullName } = JSON.parse(msg.content.toString());
    console.log(`[x] Received ${fullName}`);
    await fn(mail, fullName).catch((err) => {
      console.log(err);
    });
    console.log(" [x] Done");
    channel.ack(msg);
  } */);
}

const callToUser = async (mail: string, fullName: string, type: string) => {
  const conn = await amqplib.connect(rabbitMQUrl, "heartbeat=60");
  const channel = await conn.createChannel()
  await channel.assertQueue(queueNameToContact, { durable: true });
  /*   amqp.connect(rabbitMQUrl, function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
  
        channel.assertQueue(queueNameToContact, {
          durable: true,
        }); */
  try {
    const data = Buffer.from(JSON.stringify({ mail, fullName, type }));
    channel.sendToQueue(queueNameToContact, data);
    console.log(` [x] Sent details of  ${fullName} to rabbit `);
  } catch (error) {
    console.error(error)
    console.error(` [x] accure eeror when Send details of  ${fullName} to rabbit `);
  }
  /* 
      });
    }); */
};


export {
  consumeOpenPose,
  callToUser,
};