import { Paper, TextField, Select, MenuItem, FormControlLabel, Checkbox, Box, IconButton, Button, FormControl, InputLabel, Typography } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import type { Question, QuestionType } from '../types'

interface Props {
    index: number
    question: Question
    onUpdate: (patch: Partial<Question>) => void
    onRemove: () => void
}

export default function QuestionEditor({ index, question, onUpdate, onRemove }: Props) {
    const isChoice = question.type === 'single' || question.type === 'multi'

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">שאלה {index + 1}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={onRemove} color="error"><DeleteIcon /></IconButton>
            </Box>

            <TextField
                fullWidth
                label="טקסט השאלה"
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                margin="normal"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>סוג</InputLabel>
                    <Select
                        value={question.type}
                        label="סוג"
                        onChange={(e) => onUpdate({ type: e.target.value as QuestionType, options: e.target.value === 'single' || e.target.value === 'multi' ? [''] : undefined })}
                    >
                        <MenuItem value="text">טקסט קצר</MenuItem>
                        <MenuItem value="textarea">טקסט ארוך</MenuItem>
                        <MenuItem value="single">בחירה בודדת</MenuItem>
                        <MenuItem value="multi">בחירה מרובה</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox checked={question.required} onChange={(e) => onUpdate({ required: e.target.checked })} />}
                    label="חובה"
                />
            </Box>

            {isChoice && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>אופציות:</Typography>
                    {question.options?.map((opt, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <TextField
                                fullWidth
                                value={opt}
                                onChange={(e) => {
                                    const options = [...(question.options || [])]
                                    options[i] = e.target.value
                                    onUpdate({ options })
                                }}
                                placeholder={`אופציה ${i + 1}`}
                                size="small"
                            />
                            <IconButton size="small" onClick={() => onUpdate({ options: question.options?.filter((_, idx) => idx !== i) })}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => onUpdate({ options: [...(question.options || []), ''] })} sx={{ mt: 1 }} size="small">
                        הוסף אופציה
                    </Button>
                </Box>
            )}
        </Paper>
    )
}