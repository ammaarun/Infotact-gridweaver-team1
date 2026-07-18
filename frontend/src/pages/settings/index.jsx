import { Box, Paper, Typography, Button, Snackbar, Alert } from '@mui/material';
import { MdSave } from 'react-icons/md';
import useSettings from '../../features/settings/hooks/useSettings';
import { SETTINGS_TABS } from '../../features/settings/data/settingsData';
import SettingsTabs from '../../features/settings/components/SettingsTabs';
import ProfileSettings from '../../features/settings/components/ProfileSettings';
import NotificationSettings from '../../features/settings/components/NotificationSettings';
import ThemeSettings from '../../features/settings/components/ThemeSettings';
import SecuritySettings from '../../features/settings/components/SecuritySettings';
import ApiConfigSettings from '../../features/settings/components/ApiConfigSettings';

const SettingsPage = () => {
  const {
    activeTab, setActiveTab, profile, updateProfileField, notifications, toggleNotification,
    themePrefs, updateThemePref, security, apiConfig, updateApiConfigField,
    showApiKey, setShowApiKey, saveStatus, handleSave,
  } = useSettings();

  const renderActiveTab = () => {
    switch (activeTab) {
      case SETTINGS_TABS.PROFILE: return <ProfileSettings profile={profile} onFieldChange={updateProfileField} />;
      case SETTINGS_TABS.NOTIFICATIONS: return <NotificationSettings notifications={notifications} onToggle={toggleNotification} />;
      case SETTINGS_TABS.THEME: return <ThemeSettings themePrefs={themePrefs} onChange={updateThemePref} />;
      case SETTINGS_TABS.SECURITY: return <SecuritySettings security={security} />;
      case SETTINGS_TABS.API_CONFIG: return <ApiConfigSettings apiConfig={apiConfig} onFieldChange={updateApiConfigField} showApiKey={showApiKey} setShowApiKey={setShowApiKey} />;
      default: return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage your profile, preferences, and integrations
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<MdSave size={18} />} onClick={handleSave} sx={{ textTransform: 'none', borderRadius: '10px', bgcolor: 'primary.main' }}>
          Save Changes
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>
        <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />
        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>{renderActiveTab()}</Box>
      </Paper>

      <Snackbar open={Boolean(saveStatus)} autoHideDuration={2500}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: '12px' }}>
          Settings saved successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;