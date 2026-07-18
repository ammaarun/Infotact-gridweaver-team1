import { useState } from 'react';
import {
  SETTINGS_TABS,
  defaultProfile,
  defaultNotifications,
  defaultThemePrefs,
  defaultSecurity,
  defaultApiConfig,
} from '../data/settingsData';

const useSettings = () => {
  const [activeTab, setActiveTab] = useState(SETTINGS_TABS.PROFILE);
  const [profile, setProfile] = useState(defaultProfile);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [themePrefs, setThemePrefs] = useState(defaultThemePrefs);
  const [security] = useState(defaultSecurity);
  const [apiConfig, setApiConfig] = useState(defaultApiConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNotification = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateThemePref = (field, value) => {
    setThemePrefs((prev) => ({ ...prev, [field]: value }));
  };

  const updateApiConfigField = (field, value) => {
    setApiConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  return {
    activeTab,
    setActiveTab,
    profile,
    updateProfileField,
    notifications,
    toggleNotification,
    themePrefs,
    updateThemePref,
    security,
    apiConfig,
    updateApiConfigField,
    showApiKey,
    setShowApiKey,
    saveStatus,
    handleSave,
  };
};

export default useSettings;