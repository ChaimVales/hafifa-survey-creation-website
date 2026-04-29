import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'super-secret-change-me'

export interface AuthRequest extends Request {
    user?: { id: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = header.replace('Bearer ', '')
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string }
        req.user = { id: decoded.userId }
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid token' })
    }
}