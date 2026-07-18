import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: { main: '#2563EB', contrastText: '#FFFFFF' },
  success: { main: '#22C55E' },
  warning: { main: '#F59E0B' },
  error: { main: '#EF4444' },
  secondary: { main: '#8B5CF6' },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  divider: '#E5E7EB',
};

const darkPalette = {
  mode: 'dark',
  primary: { main: '#3B82F6', contrastText: '#FFFFFF' },
  success: { main: '#4ADE80' },
  warning: { main: '#FBBF24' },
  error: { main: '#F87171' },
  secondary: { main: '#A78BFA' },
  background: {
    default: '#0B1220',
    paper: '#111827',
  },
  text: {
    primary: '#F3F4F6',
    secondary: '#9CA3AF',
  },
  divider: '#1F2937',
};

const baseTypography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(','),
  h5: { fontWeight: 700, letterSpacing: '-0.01em' },
  h6: { fontWeight: 700 },
  subtitle1: { fontWeight: 700 },
  subtitle2: { fontWeight: 700 },
  body2: { fontSize: '0.875rem' },
  caption: { fontSize: '0.75rem' },
  button: { fontWeight: 600 },
};

export const getAppTheme = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    shape: { borderRadius: 16 },
    spacing: 8,
    typography: baseTypography,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'background-color 200ms ease, border-color 200ms ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
          },
        },
      },
    },
  });
};