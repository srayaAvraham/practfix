import amqplib from 'amqplib';
import config from '../config';
const rabbitConfig = config.rabbit;

/**
 * Connect to rabbitMQ and wait to recive message
 * @param fn callback function to action on data from rabbitMQ
 */
export default async function do_consume(fn: (mail: string, fullname: string) => Promise<void>): Promise<void> {
    const conn = await amqplib.connect(rabbitConfig.amqp_url, "heartbeat=60");
    const channel = await conn.createChannel()
    await channel.assertQueue(rabbitConfig.queueName, { durable: true });
    channel.prefetch(1);
    console.log(`[*] Waiting for messages in ${rabbitConfig.queueName}. To exit press CTRL+C`);
    await channel.consume(rabbitConfig.queueName, async function (msg) {
        let { mail, fullName } = JSON.parse(msg.content.toString());
        console.log(`[x] Received ${fullName}`);
        await fn(mail, fullName).catch((err) => {
            console.log(err);
        });
        console.log(" [x] Done");
        channel.ack(msg);
    });
}