import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as surveyService from '../services/surveys.service'
import { NotFoundError, ForbiddenError } from '../services/surveys.service'

function handleError(err: unknown, res: Response) {
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message })
    if (err instanceof ForbiddenError) return res.status(403).json({ error: err.message })
    return res.status(400).json({ error: (err as Error).message })
}

export async function createSurvey(req: AuthRequest, res: Response) {
    try {
        const result = await surveyService.createSurvey(req.user!.id, req.body)
        res.status(201).json(result)
    } catch (err) {
        handleError(err, res)
    }
}

export async function getMySurveys(req: AuthRequest, res: Response) {
    const result = await surveyService.getMySurveys(req.user!.id)
    res.json(result)
}

export async function getSurveyBySlug(req: Request, res: Response) {
    try {
        const result = await surveyService.getSurveyBySlug(req.params.slug as string)
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
}

export async function deleteSurvey(req: AuthRequest, res: Response) {
    try {
        await surveyService.deleteSurvey(req.params.id as string, req.user!.id)
        res.status(204).end()
    } catch (err) {
        handleError(err, res)
    }
}

export async function submitResponse(req: Request, res: Response) {
    try {
        const result = await surveyService.submitResponse(req.params.slug as string, req.body.answers)
        res.status(201).json({ message: 'Thank you!', responseId: result._id })
    } catch (err) {
        handleError(err, res)
    }
}

export async function getSurveyResponses(req: AuthRequest, res: Response) {
    try {
        const result = await surveyService.getSurveyResponses(req.params.id as string, req.user!.id)
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
}

export async function browseSurveys(req: Request, res: Response) {
    try {
        const { search, sortBy } = req.query
        const result = await surveyService.browseSurveys({
            search: search as string,
            sortBy: sortBy as 'newest' | 'oldest' | 'title'
        })
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
}