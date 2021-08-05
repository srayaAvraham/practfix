import dotenv from 'dotenv'
dotenv.config()

const config = {
    rabbitMQUrl: process.env.RABBITMQ_URL,
    bucketName: process.env.BUCKET_NAME,
    folderId: process.env.FOLDER_ID,
    queueNameFromOpenPose: process.env.QUEUE_NAME_FROM_OPENPOSE,
    queueNameToContact: process.env.QUEUE_NAME_TO_CONTACT,
    minio: {
        minioBaseURL:process.env.MINIO_BASE_URL,
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT),
        useSSL: (process.env.MINIO_USE_SSL.toLowerCase() === 'true'),
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY
    },
    mongoBaseUrl: process.env.MONGO_SERVICE_BASE_URL
}

export default config;