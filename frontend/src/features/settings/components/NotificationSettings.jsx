import { Box, Typography, Switch, FormControlLabel, Divider, Stack } from '@mui/material';

const notificationGroups = [
  { title: 'Alert Types', items: [
    { key: 'criticalAlerts', label: 'Critical Alerts', description: 'Device failures, security breaches, grid faults' },
    { key: 'warningAlerts', label: 'Warning Alerts', description: 'Threshold breaches and abnormal readings' },
    { key: 'infoUpdates', label: 'Informational Updates', description: 'Firmware releases, routine status changes' },
    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary report sent every Monday' },
  ]},
  { title: 'Delivery Channels', items: [
    { key: 'emailAlerts', label: 'Email', description: 'Send alerts to your registered email address' },
    { key: 'smsAlerts', label: 'SMS', description: 'Send critical alerts via text message' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser and mobile app push alerts' },
  ]},
];

const NotificationSettings = ({ notifications, onToggle }) => {
  return (
    <Box>
      {notificationGroups.map((group, idx) => (
        <Box key={group.title} sx={{ mb: idx < notificationGroups.length - 1 ? 3 : 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
            {group.title}
          </Typography>
          <Stack spacing={1.5}>
            {group.items.map((item) => (
              <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Box sx={{ pr: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={<Switch checked={notifications[item.key]} onChange={() => onToggle(item.key)} inputProps={{ 'aria-label': item.label }} />}
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>
            ))}
          </Stack>
          {idx < notificationGroups.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default NotificationSettings;