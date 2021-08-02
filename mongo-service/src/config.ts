import dotenv from 'dotenv'
dotenv.config()

export const config = {
    mongoURL: process.env.MONGO_URL
}