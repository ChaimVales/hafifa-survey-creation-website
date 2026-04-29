import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Container, Typography, TextField, Card, CardContent, CardActions,
    Button, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Search as SearchIcon } from '@mui/icons-material'
import api from '../api/client'
import type { Survey } from '../types'

export default function BrowseSurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')

    useEffect(() => {
        const timer = setTimeout(() => loadSurveys(), 300)
        return () => clearTimeout(timer)
    }, [search, sortBy])

    async function loadSurveys() {
        setLoading(true)
        try {
            const params: any = { sortBy }
            if (search) params.search = search
            const res = await api.get<Survey[]>('/surveys/browse', { params })
            setSurveys(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>🔍 גלה סקרים</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                ענה על סקרים מעניינים בלי להירשם
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="חפש לפי כותרת או תיאור..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }
                    }}
                    sx={{ flexGrow: 1, minWidth: 250 }}
                />
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>מיון</InputLabel>
                    <Select
                        value={sortBy}
                        label="מיון"
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                    >
                        <MenuItem value="newest">חדש ביותר</MenuItem>
                        <MenuItem value="oldest">ישן ביותר</MenuItem>
                        <MenuItem value="title">לפי כותרת</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : surveys.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
                    {search ? 'לא נמצאו סקרים תואמים' : 'אין סקרים זמינים כרגע'}
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {surveys.map(survey => (
                        <Grid key={survey._id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>{survey.title}</Typography>
                                    {survey.description && (
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            {survey.description}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        {survey.questions.length} שאלות
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        component={Link}
                                        to={`/s/${survey.slug}`}
                                    >
                                        ענה על הסקר
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}