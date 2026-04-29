import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                >
                    📋 Survey Builder
                </Typography>
                {user ? (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography>שלום {user.name}</Typography>
                        <Button color="inherit" component={Link} to="/dashboard">הסקרים שלי</Button>
                        <Button color="inherit" onClick={logout}>התנתק</Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button color="inherit" component={Link} to="/login">התחבר</Button>
                        <Button color="inherit" component={Link} to="/register">הרשם</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}