import { Box, Grid, TextField, Typography, Avatar } from '@mui/material';

const ProfileSettings = ({ profile, onFieldChange }) => {
  const initials = profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '1.25rem', fontWeight: 700 }}>
          {initials}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {profile.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {profile.role}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Full Name" value={profile.fullName} onChange={(e) => onFieldChange('fullName', e.target.value)} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email Address" type="email" value={profile.email} onChange={(e) => onFieldChange('email', e.target.value)} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Role" value={profile.role} onChange={(e) => onFieldChange('role', e.target.value)} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Organization" value={profile.organization} onChange={(e) => onFieldChange('organization', e.target.value)} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Phone" value={profile.phone} onChange={(e) => onFieldChange('phone', e.target.value)} size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Timezone" value={profile.timezone} onChange={(e) => onFieldChange('timezone', e.target.value)} size="small" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSettings;