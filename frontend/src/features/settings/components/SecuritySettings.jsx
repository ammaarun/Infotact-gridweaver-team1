import { Box, Typography, Switch, Divider, Stack, Chip, Button } from '@mui/material';
import { MdComputer, MdPhoneAndroid, MdLogout } from 'react-icons/md';

const deviceIcon = (deviceLabel) =>
  deviceLabel.toLowerCase().includes('mobile') || deviceLabel.toLowerCase().includes('android') ? MdPhoneAndroid : MdComputer;

const formatSessionTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const SecuritySettings = ({ security }) => {
  return (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Two-Factor Authentication
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Adds an extra layer of security to your account
            </Typography>
          </Box>
          <Switch checked={security.twoFactorEnabled} inputProps={{ 'aria-label': 'Two-factor authentication' }} />
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Password
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Last changed on {security.lastPasswordChange}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: '10px' }}>
            Change Password
          </Button>
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          Active Sessions
        </Typography>
        <Stack spacing={1.5}>
          {security.activeSessions.map((session) => {
            const Icon = deviceIcon(session.device);
            return (
              <Box key={session.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: 1, borderColor: 'divider', borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Icon size={20} color="inherit" style={{ color: 'inherit' }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {session.device}
                      </Typography>
                      {session.current && <Chip label="This device" size="small" color="primary" sx={{ borderRadius: '6px', height: 20 }} />}
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {session.location} • {formatSessionTime(session.lastActive)}
                    </Typography>
                  </Box>
                </Box>
                {!session.current && (
                  <Button size="small" color="error" startIcon={<MdLogout size={14} />} sx={{ textTransform: 'none' }}>
                    Revoke
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
};

export default SecuritySettings;