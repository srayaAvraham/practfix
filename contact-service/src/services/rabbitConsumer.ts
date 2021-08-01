import amqplib from 'amqplib';
const queueName: string = "call_to_user";
var amqp_url: string = "amqps://nvrswiti:g6sHr4Z8IHYLb2ynujmuWZtNx8Bpe77T@cow.rmq2.cloudamqp.com/nvrswiti"; // || 'amqp://localhost:5672';


export default async function do_consume(fn: (mail: string, fullname: string) => Promise<void>): Promise<void> {
    const conn = await amqplib.connect(amqp_url, "heartbeat=60");
    const channel = await conn.createChannel()
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);
    console.log(`[*] Waiting for messages in ${queueName}. To exit press CTRL+C`);
    await channel.consume(queueName, async function (msg) {
        let { mail, fullName } = JSON.parse(msg.content.toString());
        console.log(`[x] Received ${fullName}`);
        await fn(mail, fullName).catch((err) => {
            console.log(err);
        });
        console.log(" [x] Done");
        channel.ack(msg);
    });
}