import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from '../config';
const mailConfig = config.mail;

export default async function sendMail(mail: string, fullName: string) {
    // create reusable transporter object using the default SMTP transport
    let transporter: Transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailConfig.user, // generated ethereal user
            pass: mailConfig.pass, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // send mail with defined transport object
    let info: Mail.Options = await transporter.sendMail({
        from: '"practfix" <practfix@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "practfix", // Subject line
        text: `Hello ${fullName}, ${mailConfig.messageToPatient}`, // plain text body
    });

    console.log(`Message sent: ${info.messageId}`);
}