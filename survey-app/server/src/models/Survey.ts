import mongoose, { Schema, Types } from 'mongoose'
import { nanoid } from 'nanoid'

const questionSchema = new Schema({
    id: { type: String, default: () => nanoid(8) },
    type: {
        type: String,
        enum: ['text', 'textarea', 'single', 'multi'],
        required: true
    },
    title: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [String]
}, { _id: false })

const surveySchema = new Schema({
    ownerId: { type: Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, default: () => nanoid(10), unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    questions: [questionSchema],
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Survey = mongoose.model('Survey', surveySchema)