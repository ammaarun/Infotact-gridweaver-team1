import { Tabs, Tab, Box } from '@mui/material';
import { MdPerson, MdNotifications, MdPalette, MdSecurity, MdCode } from 'react-icons/md';
import { SETTINGS_TABS } from '../data/settingsData';

const tabConfig = [
  { value: SETTINGS_TABS.PROFILE, label: 'Profile', icon: MdPerson },
  { value: SETTINGS_TABS.NOTIFICATIONS, label: 'Notifications', icon: MdNotifications },
  { value: SETTINGS_TABS.THEME, label: 'Theme', icon: MdPalette },
  { value: SETTINGS_TABS.SECURITY, label: 'Security', icon: MdSecurity },
  { value: SETTINGS_TABS.API_CONFIG, label: 'API Config', icon: MdCode },
];

const SettingsTabs = ({ activeTab, onChange }) => {
  return (
    <Box sx={{ borderBottom: { xs: 1, md: 0 }, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Settings sections"
        sx={{
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 44, color: 'text.secondary' },
          '& .Mui-selected': { color: 'primary.main !important' },
          '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
        }}
      >
        {tabConfig.map(({ value, label, icon: Icon }) => (
          <Tab key={value} value={value} label={label} icon={<Icon size={18} />} iconPosition="start" />
        ))}
      </Tabs>
    </Box>
  );
};

export default SettingsTabs;