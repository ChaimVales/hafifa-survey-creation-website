import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import env from '../config/env'

export class EmailExistsError extends Error {
    constructor() {
        super('Email already in use')
        this.name = 'EmailExistsError'
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid credentials')
        this.name = 'InvalidCredentialsError'
    }
}

export async function register(input: { email: string; name: string; password: string }) {
    const existing = await User.findOne({ email: input.email })
    if (existing) throw new EmailExistsError()

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = await User.create({
        email: input.email,
        name: input.name,
        passwordHash
    })

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: '7d' })
    return {
        token,
        user: { id: user._id, email: user.email, name: user.name }
    }
}

export async function login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email }).select('+passwordHash')
    if (!user) throw new InvalidCredentialsError()

    const isValid = await bcrypt.compare(input.password, user.passwordHash)
    if (!isValid) throw new InvalidCredentialsError()

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: '7d' })
    return {
        token,
        user: { id: user._id, email: user.email, name: user.name }
    }
}

export async function getMe(userId: string) {
    return User.findById(userId)
}