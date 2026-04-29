export interface User {
    id: string
    email: string
    name: string
}

export type QuestionType = 'text' | 'textarea' | 'single' | 'multi'

export interface Question {
    id: string
    type: QuestionType
    title: string
    required: boolean
    options?: string[]
}

export interface Survey {
    _id: string
    slug: string
    title: string
    description: string
    questions: Question[]
    isActive: boolean
    createdAt: string
}

export interface Answer {
    questionId: string
    value: string | string[]
}

export interface SurveyResponse {
    _id: string
    surveyId: string
    answers: Answer[]
    submittedAt: string
}

export interface AuthResponse {
    token: string
    user: User
}