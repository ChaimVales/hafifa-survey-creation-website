import { useState, useEffect } from 'react'
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton, Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Add as AddIcon, Delete as DeleteIcon, Share as ShareIcon, BarChart as ResultsIcon } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import type { Survey } from '../types'
import ShareDialog from '../components/ShareDialog'

export default function Dashboard() {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [loading, setLoading] = useState(true)
    const [shareSlug, setShareSlug] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => { loadSurveys() }, [])

    async function loadSurveys() {
        try {
            const res = await api.get<Survey[]>('/surveys')
            setSurveys(res.data)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('למחוק את הסקר?')) return
        await api.delete(`/surveys/${id}`)
        setSurveys(surveys.filter(s => s._id !== id))
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">הסקרים שלי</Typography>
                <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/surveys/new">
                    סקר חדש
                </Button>
            </Box>

            {surveys.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
                    אין לך סקרים. צור את הראשון! ✨
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {surveys.map(survey => (
                        <Grid key={survey._id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" noWrap>{survey.title}</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {survey.questions.length} שאלות
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton onClick={() => setShareSlug(survey.slug)} title="שתף">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton onClick={() => navigate(`/surveys/${survey._id}/results`)} title="תוצאות">
                                        <ResultsIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(survey._id)} title="מחק" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {shareSlug && <ShareDialog slug={shareSlug} onClose={() => setShareSlug(null)} />}
        </Container>
    )
}