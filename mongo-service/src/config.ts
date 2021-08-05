import dotenv from 'dotenv'
dotenv.config()

export const config = {
    secret: process.env.SECRET,
    mongoURL: process.env.MONGO_URL
}