import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
    const { mode, toggleTheme } = useTheme();

    return (
        <Tooltip title={mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}>
            <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    );
}
