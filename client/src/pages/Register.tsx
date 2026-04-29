import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register(email, name, password)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'שגיאה ברישום')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    הרשמה
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="שם מלא"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="אימייל"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="סיסמה (לפחות 6 תווים)"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'נרשם...' : 'הירשם'}
                    </Button>
                </Box>
                <Typography align="center" sx={{ mt: 2 }}>
                    יש לך חשבון? <Link to="/login">התחבר</Link>
                </Typography>
            </Paper>
        </Container>
    )
}