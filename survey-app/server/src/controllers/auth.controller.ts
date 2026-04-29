import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as authService from '../services/auth.service'
import { EmailExistsError, InvalidCredentialsError } from '../services/auth.service'

export async function register(req: Request, res: Response) {
    try {
        const result = await authService.register(req.body)
        res.status(201).json(result)
    } catch (err) {
        if (err instanceof EmailExistsError) {
            return res.status(409).json({ error: err.message })
        }
        res.status(400).json({ error: (err as Error).message })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const result = await authService.login(req.body)
        res.json(result)
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return res.status(401).json({ error: err.message })
        }
        res.status(500).json({ error: (err as Error).message })
    }
}

export async function getMe(req: AuthRequest, res: Response) {
    const user = await authService.getMe(req.user!.id)
    res.json(user)
}