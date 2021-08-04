import dotenv from 'dotenv'
dotenv.config()

export const config = {
    secret: "secret",
    mongoURL: process.env.MONGO_URL
}