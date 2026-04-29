import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('[Error]', err.message)

    const status = err.status || err.statusCode || 500
    res.status(status).json({
        error: err.message || 'Internal Server Error'
    })
}

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({ error: 'Route not found' })
}