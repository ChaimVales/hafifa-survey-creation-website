import mongoose, { Schema, Types } from 'mongoose'

const answerSchema = new Schema({
    questionId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
}, { _id: false })

const responseSchema = new Schema({
    surveyId: { type: Types.ObjectId, ref: 'Survey', required: true, index: true },
    answers: [answerSchema],
    submittedAt: { type: Date, default: Date.now }
})

export const SurveyResponse = mongoose.model('Response', responseSchema)