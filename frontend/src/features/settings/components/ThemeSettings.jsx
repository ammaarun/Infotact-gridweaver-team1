import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { MdLightMode, MdDarkMode, MdCheck } from 'react-icons/md';
import { accentColorOptions } from '../data/settingsData';

const ThemeSettings = ({ themePrefs, onChange }) => {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          Appearance Mode
        </Typography>
        <ToggleButtonGroup value={themePrefs.mode} exclusive onChange={(e, val) => val && onChange('mode', val)} size="small">
          <ToggleButton value="light" sx={{ textTransform: 'none', px: 2.5, gap: 1 }}>
            <MdLightMode size={16} /> Light
          </ToggleButton>
          <ToggleButton value="dark" sx={{ textTransform: 'none', px: 2.5, gap: 1 }}>
            <MdDarkMode size={16} /> Dark
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          Layout Density
        </Typography>
        <ToggleButtonGroup value={themePrefs.density} exclusive onChange={(e, val) => val && onChange('density', val)} size="small">
          <ToggleButton value="comfortable" sx={{ textTransform: 'none', px: 2.5 }}>Comfortable</ToggleButton>
          <ToggleButton value="compact" sx={{ textTransform: 'none', px: 2.5 }}>Compact</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          Accent Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {accentColorOptions.map((color) => (
            <Box
              key={color.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${color.label} accent color`}
              onClick={() => onChange('accentColor', color.id)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: color.hex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: themePrefs.accentColor === color.id ? 2 : 2,
                borderColor: themePrefs.accentColor === color.id ? 'text.primary' : 'transparent',
                outlineOffset: '2px',
              }}
            >
              {themePrefs.accentColor === color.id && <MdCheck size={18} color="#FFFFFF" />}
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

export default ThemeSettings;