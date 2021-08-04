import dotenv from 'dotenv'
dotenv.config()

const config = {
    rabbit: {
        queueName: process.env.QUEUE_NAME,
        amqp_url: process.env.AMQP_URL,
    },
    mail: {
        messageToPatient: "\nשמחים לבשר שהתרגול ששלחת עובד ועלה לאתר\nעומדים לשירותכם תמיד,\nצוות practfix",
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
        user: process.env.USER,
        pass: process.env.PASS,
    },
}

export default config;