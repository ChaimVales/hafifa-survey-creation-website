const env = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/surveys',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-change-me',
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
}

export default env