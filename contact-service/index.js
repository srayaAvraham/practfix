const amqplib = require('amqplib');
const nodemailer = require("nodemailer");
const queueName = "call_to_user";
var amqp_url = "amqps://nvrswiti:g6sHr4Z8IHYLb2ynujmuWZtNx8Bpe77T@cow.rmq2.cloudamqp.com/nvrswiti"; // || 'amqp://localhost:5672';

async function sendMail(mail, fullName) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "practfix@gmail.com", // generated ethereal user
            pass: "Aa123456!", // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"practfix" <practfix@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "practfix", // Subject line
        text: `Hello ${fullName},\nשמחים לבשר שהתרגול ששלחת עובד ועלה לאתר\nעומדים לשירותכם תמיד,\nצוות practfix`, // plain text body
    });

    console.log(`Message sent: ${info.messageId}`);
}


async function do_consume() {
    const conn = await amqplib.connect(amqp_url, "heartbeat=60");
    const channel = await conn.createChannel()
    await channel.assertQueue(queueName, { durable: false });
    channel.prefetch(1);
    console.log(`[*] Waiting for messages in ${queueName}. To exit press CTRL+C`);
    await channel.consume(queueName, async function (msg) {
        let { mail, fullName } = JSON.parse(msg.content.toString());
        console.log(`[x] Received ${fullName}`);
        await sendMail(mail, fullName).catch((err) => {
            console.log(err);
        });
        console.log(" [x] Done");
        channel.ack(msg);
    });
}

do_consume();