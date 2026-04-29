import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes'
import surveyRoutes from './routes/surveys.routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware'

const app = express()

app.use(express.json())

// Public routes
app.get('/', (req, res) => {
    res.send('Hello from Server!')
})

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    })
})

// Mount routers
app.use('/api/auth', authRoutes)
app.use('/api/surveys', surveyRoutes)

// 404 handler (after all routes)
app.use(notFoundHandler)

// Error handler (must be LAST!)
app.use(errorHandler)

export default app