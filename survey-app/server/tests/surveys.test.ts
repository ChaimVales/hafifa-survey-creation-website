import './setup'                    // ← השורה החדשה!
import request from 'supertest'
import app from '../src/app'

describe('POST /api/surveys (protected)', () => {
    it('rejects request without token with 401', async () => {
        const res = await request(app).post('/api/surveys').send({
            title: 'Test', questions: []
        })
        expect(res.status).toBe(401)
    })
})

describe('Full flow: register → create survey → respond → get results', () => {
    it('completes the full user journey', async () => {
        const registerRes = await request(app).post('/api/auth/register').send({
            email: 'full@example.com', name: 'Full', password: 'pass123'
        })
        const token = registerRes.body.token

        const createRes = await request(app)
            .post('/api/surveys')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test',
                description: 'Testing',
                questions: [{ type: 'text', title: 'Name?', required: true }]
            })
        const slug = createRes.body.slug
        const surveyId = createRes.body._id
        const questionId = createRes.body.questions[0].id

        const responseRes = await request(app)
            .post(`/api/surveys/${slug}/responses`)
            .send({ answers: [{ questionId, value: 'User' }] })
        expect(responseRes.status).toBe(201)

        const resultsRes = await request(app)
            .get(`/api/surveys/${surveyId}/responses`)
            .set('Authorization', `Bearer ${token}`)
        expect(resultsRes.body.count).toBe(1)
    })
})