import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import api from '../api/client'
import QuestionEditor from '../components/QuestionEditor'
import ShareDialog from '../components/ShareDialog'
import type { Question, Survey } from '../types'

let counter = 0

export default function CreateSurvey() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [shareSlug, setShareSlug] = useState<string | null>(null)
    const navigate = useNavigate()

    function addQuestion() {
        setQuestions([...questions, {
            id: `q${++counter}-${Date.now()}`,
            type: 'text',
            title: '',
            required: false
        }])
    }

    async function handleSubmit() {
        setError('')
        setLoading(true)
        try {
            const res = await api.post<Survey>('/surveys', { title, description, questions })
            setShareSlug(res.data.slug)
        } catch (err: any) {
            setError(err.response?.data?.error || 'שגיאה ביצירת הסקר')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>סקר חדש</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 3, mb: 3 }}>
                <TextField fullWidth label="כותרת הסקר" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" />
                <TextField fullWidth label="תיאור (אופציונלי)" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" />
            </Paper>

            {questions.map((q, i) => (
                <QuestionEditor
                    key={q.id}
                    index={i}
                    question={q}
                    onUpdate={(patch) => setQuestions(questions.map(qq => qq.id === q.id ? { ...qq, ...patch } : qq))}
                    onRemove={() => setQuestions(questions.filter(qq => qq.id !== q.id))}
                />
            ))}

            <Button startIcon={<AddIcon />} onClick={addQuestion} variant="outlined" sx={{ mt: 2 }}>
                הוסף שאלה
            </Button>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading || !title || questions.length === 0}
                >
                    {loading ? 'יוצר...' : 'פרסם סקר'}
                </Button>
                <Button onClick={() => navigate('/dashboard')}>ביטול</Button>
            </Box>

            {shareSlug && <ShareDialog slug={shareSlug} onClose={() => navigate('/dashboard')} />}
        </Container>
    )
}