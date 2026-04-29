import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Container, Typography, Button, Box } from '@mui/material'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSurvey from './pages/CreateSurvey'
import AnswerSurvey from './pages/AnswerSurvey'
import Results from './pages/Results'
import BrowseSurveys from './pages/BrowseSurveys'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function HomePage() {
  const { user } = useAuth()
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>🎯 Survey Builder</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        צור סקרים, שתף, וקבל תשובות
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {user ? (
          <Button component={Link} to="/dashboard" variant="contained" size="large">
            לדשבורד שלי
          </Button>
        ) : (
          <>
            <Button component={Link} to="/login" variant="contained" size="large">
              התחבר
            </Button>
            <Button component={Link} to="/register" variant="outlined" size="large">
              הרשם
            </Button>
          </>
        )}
        <Button component={Link} to="/browse" variant="text" size="large">
          🔍 היכנס כאורח
        </Button>
      </Box>
    </Container>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public */}
        <Route path="/browse" element={<BrowseSurveys />} />
        <Route path="/s/:slug" element={<AnswerSurvey />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/surveys/new" element={<ProtectedRoute><CreateSurvey /></ProtectedRoute>} />
        <Route path="/surveys/:id/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}