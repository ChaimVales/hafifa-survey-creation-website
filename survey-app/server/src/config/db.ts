import mongoose from 'mongoose'
import env from './env'

export async function connectDB() {
    try {
        await mongoose.connect(env.mongoUri)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.error('MongoDB connection failed:', err)
        process.exit(1)
    }
}

export async function disconnectDB() {
    await mongoose.connection.close()
}