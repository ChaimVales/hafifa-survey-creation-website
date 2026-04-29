import './setup'                    // ← השורה החדשה!
import request from 'supertest'
import app from '../src/app'

describe('POST /api/auth/register', () => {
    it('creates a new user and returns token', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123'
        })
        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.passwordHash).toBeUndefined()
    })

    it('rejects duplicate email with 409', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'dup@example.com', name: 'First', password: 'password123'
        })
        const res = await request(app).post('/api/auth/register').send({
            email: 'dup@example.com', name: 'Second', password: 'password456'
        })
        expect(res.status).toBe(409)
    })
})

describe('POST /api/auth/login', () => {
    it('rejects wrong password with 401', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'login@example.com', name: 'Login', password: 'correct123'
        })
        const res = await request(app).post('/api/auth/login').send({
            email: 'login@example.com', password: 'wrong123'
        })
        expect(res.status).toBe(401)
    })
})