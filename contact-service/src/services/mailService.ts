import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default async function sendMail(mail: string, fullName: string) {
    // create reusable transporter object using the default SMTP transport
    let transporter: Transporter = nodemailer.createTransport({
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
    let info: Mail.Options = await transporter.sendMail({
        from: '"practfix" <practfix@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "practfix", // Subject line
        text: `Hello ${fullName},\nשמחים לבשר שהתרגול ששלחת עובד ועלה לאתר\nעומדים לשירותכם תמיד,\nצוות practfix`, // plain text body
    });

    console.log(`Message sent: ${info.messageId}`);
}