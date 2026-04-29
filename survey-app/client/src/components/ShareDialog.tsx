import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, IconButton, Alert } from '@mui/material'
import { ContentCopy as CopyIcon } from '@mui/icons-material'
import { useState } from 'react'

export default function ShareDialog({ slug, onClose }: { slug: string; onClose: () => void }) {
    const url = `${window.location.origin}/s/${slug}`
    const [copied, setCopied] = useState(false)

    function copyUrl() {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>🔗 שתף את הסקר</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <TextField
                        fullWidth
                        value={url}
                        slotProps={{ input: { readOnly: true } }}
                    />
                    <IconButton onClick={copyUrl} title="העתק"><CopyIcon /></IconButton>
                </Box>
                {copied && <Alert severity="success" sx={{ mt: 2 }}>הועתק!</Alert>}
                <Button onClick={onClose} sx={{ mt: 2 }} fullWidth variant="contained">סגור</Button>
            </DialogContent>
        </Dialog>
    )
}