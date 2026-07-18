import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from '../styles/theme';

const THEME_STORAGE_KEY = 'gridweaver-theme-mode';

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const getInitialMode = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable (e.g. private browsing); fail silently
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};