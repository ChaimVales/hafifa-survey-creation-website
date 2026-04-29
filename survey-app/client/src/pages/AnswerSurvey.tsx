import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    Container, Typography, Paper, Button, Box, Alert, CircularProgress,
    TextField, RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel, FormGroup
} from '@mui/material'
import api from '../api/client'
import type { Survey, Answer } from '../types'

export default function AnswerSurvey() {
    const { slug } = useParams<{ slug: string }>()
    const [survey, setSurvey] = useState<Survey | null>(null)
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
    const [loading, setLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        api.get<Survey>(`/surveys/${slug}`)
            .then(res => setSurvey(res.data))
            .catch(err => setError(err.response?.data?.error || 'הסקר לא נמצא'))
            .finally(() => setLoading(false))
    }, [slug])

    function setAnswer(questionId: string, value: string | string[]) {
        setAnswers({ ...answers, [questionId]: value })
    }

    function toggleMulti(questionId: string, value: string) {
        const current = (answers[questionId] as string[]) || []
        if (current.includes(value)) {
            setAnswer(questionId, current.filter(v => v !== value))
        } else {
            setAnswer(questionId, [...current, value])
        }
    }

    async function handleSubmit() {
        setError('')
        setSubmitting(true)
        try {
            const answersArray: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
                questionId, value
            }))
            await api.post(`/surveys/${slug}/responses`, { answers: answersArray })
            setSubmitted(true)
        } catch (err: any) {
            setError(err.response?.data?.error || 'שגיאה בשליחה')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
    if (error && !survey) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>
    if (submitted) return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>🎉 תודה!</Typography>
                <Typography>תשובתך נקלטה בהצלחה.</Typography>
            </Paper>
        </Container>
    )
    if (!survey) return null

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>{survey.title}</Typography>
                {survey.description && (
                    <Typography color="text.secondary" sx={{ mb: 3 }}>{survey.description}</Typography>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {survey.questions.map((q, i) => (
                    <Box key={q.id} sx={{ mt: 3 }}>
                        <FormControl fullWidth>
                            <FormLabel sx={{ mb: 1, fontSize: '1.1rem', color: 'text.primary' }}>
                                {i + 1}. {q.title} {q.required && <span style={{ color: 'red' }}>*</span>}
                            </FormLabel>

                            {q.type === 'text' && (
                                <TextField
                                    fullWidth
                                    value={answers[q.id] || ''}
                                    onChange={(e) => setAnswer(q.id, e.target.value)}
                                />
                            )}

                            {q.type === 'textarea' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={answers[q.id] || ''}
                                    onChange={(e) => setAnswer(q.id, e.target.value)}
                                />
                            )}

                            {q.type === 'single' && (
                                <RadioGroup
                                    value={answers[q.id] || ''}
                                    onChange={(e) => setAnswer(q.id, e.target.value)}
                                >
                                    {q.options?.map(opt => (
                                        <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                                    ))}
                                </RadioGroup>
                            )}

                            {q.type === 'multi' && (
                                <FormGroup>
                                    {q.options?.map(opt => (
                                        <FormControlLabel
                                            key={opt}
                                            control={
                                                <Checkbox
                                                    checked={(answers[q.id] as string[] || []).includes(opt)}
                                                    onChange={() => toggleMulti(q.id, opt)}
                                                />
                                            }
                                            label={opt}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                        </FormControl>
                    </Box>
                ))}

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 4 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'שולח...' : 'שלח תשובות'}
                </Button>
            </Paper>
        </Container>
    )
}