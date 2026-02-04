import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import { ptBR as dataGridPtBR } from '@mui/x-data-grid/locales';

// Color Palette
const lightPalette = {
  primary: {
    main: '#1976D2',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#DC004E',
    contrastText: '#ffffff',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  success: {
    main: '#4CAF50',
  },
  error: {
    main: '#F44336',
  },
  warning: {
    main: '#FF9800',
  },
  info: {
    main: '#2196F3',
  },
};

const darkPalette = {
  primary: {
    main: '#90CAF9',
    contrastText: '#000000',
  },
  secondary: {
    main: '#F48FB1',
    contrastText: '#000000',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
  },
  success: {
    main: '#66BB6A',
  },
  error: {
    main: '#F44336',
  },
  warning: {
    main: '#FFA726',
  },
  info: {
    main: '#29B6F6',
  },
};

const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.5,
  },
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '16px',
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
  body2: {
    fontSize: '14px',
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
};

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Modern look
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0px 2px 4px rgba(0, 0, 0, 0.05)' 
            : '0px 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode), ptBR, dataGridPtBR);
};
