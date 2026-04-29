import { Router } from 'express'
import * as surveysController from '../controllers/surveys.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateCreateSurvey, validateSubmitResponse } from '../validators/surveys.validators'

const router = Router()

// PUBLIC - browse ראשון (חייב להיות לפני /:slug!)
router.get('/browse', surveysController.browseSurveys)

// Surveys CRUD
router.post('/', requireAuth, validateCreateSurvey, surveysController.createSurvey)
router.get('/', requireAuth, surveysController.getMySurveys)
router.get('/:slug', surveysController.getSurveyBySlug)
router.delete('/:id', requireAuth, surveysController.deleteSurvey)

// Responses
router.post('/:slug/responses', validateSubmitResponse, surveysController.submitResponse)
router.get('/:id/responses', requireAuth, surveysController.getSurveyResponses)

export default router