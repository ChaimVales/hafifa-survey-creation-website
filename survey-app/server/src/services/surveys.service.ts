import { Survey } from '../models/Survey'
import { SurveyResponse } from '../models/Response'

export class NotFoundError extends Error {
    constructor(message: string = 'Not found') {
        super(message)
        this.name = 'NotFoundError'
    }
}

export class ForbiddenError extends Error {
    constructor(message: string = 'Forbidden') {
        super(message)
        this.name = 'ForbiddenError'
    }
}

export async function createSurvey(ownerId: string, data: { title: string; description?: string; questions: any[] }) {
    if (!data.title || !data.questions || data.questions.length === 0) {
        throw new Error('Missing title or questions')
    }
    return Survey.create({
        ownerId,
        title: data.title,
        description: data.description,
        questions: data.questions
    })
}

export async function getMySurveys(ownerId: string) {
    return Survey.find({ ownerId }).sort('-createdAt')
}

export async function getSurveyBySlug(slug: string) {
    const survey = await Survey.findOne({ slug })
    if (!survey) throw new NotFoundError('Survey not found')
    if (!survey.isActive) throw new ForbiddenError('Survey not active')
    return {
        slug: survey.slug,
        title: survey.title,
        description: survey.description,
        questions: survey.questions
    }
}

export async function deleteSurvey(surveyId: string, userId: string) {
    const survey = await Survey.findById(surveyId)
    if (!survey) throw new NotFoundError('Survey not found')
    if (survey.ownerId.toString() !== userId) {
        throw new ForbiddenError('Not your survey')
    }
    await SurveyResponse.deleteMany({ surveyId: survey._id })
    await survey.deleteOne()
}

export async function submitResponse(slug: string, answers: any[]) {
    const survey = await Survey.findOne({ slug })
    if (!survey) throw new NotFoundError('Survey not found')
    if (!survey.isActive) throw new ForbiddenError('Survey not active')

    if (!answers || !Array.isArray(answers)) {
        throw new Error('Missing answers array')
    }

    for (const q of survey.questions) {
        if (q.required) {
            const ans = answers.find(a => a.questionId === q.id)
            if (!ans || ans.value === undefined || ans.value === '') {
                throw new Error(`Question "${q.title}" is required`)
            }
        }
    }

    return SurveyResponse.create({
        surveyId: survey._id,
        answers
    })
}

export async function getSurveyResponses(surveyId: string, userId: string) {
    const survey = await Survey.findById(surveyId)
    if (!survey) throw new NotFoundError('Survey not found')
    if (survey.ownerId.toString() !== userId) {
        throw new ForbiddenError('Not your survey')
    }
    const responses = await SurveyResponse.find({ surveyId: survey._id }).sort('-submittedAt')
    return {
        survey: {
            title: survey.title,
            questions: survey.questions
        },
        responses,
        count: responses.length
    }
}

export interface BrowseFilters {
    search?: string
    sortBy?: 'newest' | 'oldest' | 'title'
}

export async function browseSurveys(filters: BrowseFilters = {}) {
    const query: any = { isActive: true }

    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ]
    }

    let sortQuery: any = { createdAt: -1 }
    if (filters.sortBy === 'oldest') sortQuery = { createdAt: 1 }
    if (filters.sortBy === 'title') sortQuery = { title: 1 }

    return Survey.find(query)
        .select('slug title description questions createdAt')
        .sort(sortQuery)
        .limit(100)
}