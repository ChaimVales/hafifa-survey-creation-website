import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material'
import api from '../api/client'
import type { SurveyResponse, Question } from '../types'

interface ResultsData {
    survey: { title: string; questions: Question[] }
    responses: SurveyResponse[]
    count: number
}

export default function Results() {
    const { id } = useParams<{ id: string }>()
    const [data, setData] = useState<ResultsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get<ResultsData>(`/surveys/${id}/responses`)
            .then(res => setData(res.data))
            .catch(err => setError(err.response?.data?.error || 'שגיאה'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>
    if (!data) return null

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>{data.survey.title}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                {data.count} {data.count === 1 ? 'תשובה' : 'תשובות'}
            </Typography>

            {data.count === 0 ? (
                <Alert severity="info">עדיין אין תשובות. שתף את הסקר! 🔗</Alert>
            ) : (
                data.survey.questions.map((q, i) => (
                    <Paper key={q.id} sx={{ p: 3, mb: 2 }}>
                        <Typography variant="h6">{i + 1}. {q.title}</Typography>

                        {(q.type === 'text' || q.type === 'textarea') ? (
                            <Box sx={{ mt: 2 }}>
                                {data.responses.map((r, idx) => {
                                    const ans = r.answers.find(a => a.questionId === q.id)
                                    if (!ans || !ans.value) return null
                                    return (
                                        <Typography key={idx} sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                                            • {Array.isArray(ans.value) ? ans.value.join(', ') : ans.value}
                                        </Typography>
                                    )
                                })}
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                {q.options?.map(opt => {
                                    const count = data.responses.filter(r => {
                                        const ans = r.answers.find(a => a.questionId === q.id)
                                        if (!ans) return false
                                        if (Array.isArray(ans.value)) return ans.value.includes(opt)
                                        return ans.value === opt
                                    }).length
                                    const percent = data.count > 0 ? Math.round((count / data.count) * 100) : 0
                                    return (
                                        <Box key={opt} sx={{ mt: 1.5 }}>
                                            <Typography>{opt}: <strong>{count}</strong> ({percent}%)</Typography>
                                            <Box sx={{ width: '100%', height: 10, bgcolor: 'grey.200', borderRadius: 1, mt: 0.5 }}>
                                                <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>
                        )}
                    </Paper>
                ))
            )}
        </Container>
    )
}