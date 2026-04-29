import { Request, Response, NextFunction } from 'express'

export function validateRegister(req: Request, res: Response, next: NextFunction) {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
        return res.status(400).json({ error: 'Missing required fields: email, name, password' })
    }
    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' })
    }
    if (typeof name !== 'string' || name.length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' })
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    next()
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' })
    }
    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    next()
}