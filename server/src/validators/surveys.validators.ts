import { Request, Response, NextFunction } from 'express'

const VALID_TYPES = ['text', 'textarea', 'single', 'multi']

export function validateCreateSurvey(req: Request, res: Response, next: NextFunction) {
    const { title, questions } = req.body

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' })
    }
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'At least one question required' })
    }

    for (const [i, q] of questions.entries()) {
        if (!q.title || typeof q.title !== 'string') {
            return res.status(400).json({ error: `Question ${i + 1}: title is required` })
        }
        if (!VALID_TYPES.includes(q.type)) {
            return res.status(400).json({ error: `Question ${i + 1}: invalid type` })
        }
        if ((q.type === 'single' || q.type === 'multi')) {
            if (!Array.isArray(q.options) || q.options.length < 2) {
                return res.status(400).json({ error: `Question ${i + 1}: choice questions need at least 2 options` })
            }
        }
    }

    next()
}

export function validateSubmitResponse(req: Request, res: Response, next: NextFunction) {
    const { answers } = req.body

    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'Missing answers array' })
    }

    for (const [i, a] of answers.entries()) {
        if (!a.questionId || typeof a.questionId !== 'string') {
            return res.status(400).json({ error: `Answer ${i + 1}: questionId required` })
        }
        if (a.value === undefined) {
            return res.status(400).json({ error: `Answer ${i + 1}: value required` })
        }
    }

    next()
}