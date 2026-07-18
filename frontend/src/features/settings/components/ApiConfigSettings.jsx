import { Box, Typography, TextField, InputAdornment, IconButton, Grid, MenuItem, Stack } from '@mui/material';
import { MdVisibility, MdVisibilityOff, MdContentCopy } from 'react-icons/md';

const maskKey = (key) => `${key.slice(0, 8)}${'•'.repeat(16)}${key.slice(-4)}`;

const ApiConfigSettings = ({ apiConfig, onFieldChange, showApiKey, setShowApiKey }) => {
  const handleCopy = () => {
    navigator.clipboard?.writeText(apiConfig.apiKey);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
          API Key
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={showApiKey ? apiConfig.apiKey : maskKey(apiConfig.apiKey)}
          InputProps={{
            readOnly: true,
            sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowApiKey((prev) => !prev)}
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </IconButton>
                <IconButton size="small" onClick={handleCopy} aria-label="Copy API key">
                  <MdContentCopy size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Webhook URL"
            value={apiConfig.webhookUrl}
            onChange={(e) => onFieldChange('webhookUrl', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Rate Limit (req/min)"
            value={apiConfig.rateLimitPerMin}
            onChange={(e) => onFieldChange('rateLimitPerMin', Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            select
            label="Environment"
            value={apiConfig.environment}
            onChange={(e) => onFieldChange('environment', e.target.value)}
          >
            <MenuItem value="production">Production</MenuItem>
            <MenuItem value="staging">Staging</MenuItem>
            <MenuItem value="development">Development</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ApiConfigSettings;