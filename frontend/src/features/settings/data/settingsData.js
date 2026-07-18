export const SETTINGS_TABS = {
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  THEME: 'theme',
  SECURITY: 'security',
  API_CONFIG: 'api_config',
};

export const defaultProfile = {
  fullName: 'Harsha powar',
  email: 'harsha.powar@gridweaver.io',
  role: 'Grid Operations Engineer',
  organization: 'GridWeaver Microgrid Ops',
  phone: '+91 xxxxxxxxxx',
  timezone: 'Asia/Kolkata (IST)',
};

export const defaultNotifications = {
  criticalAlerts: true,
  warningAlerts: true,
  infoUpdates: false,
  weeklyDigest: true,
  smsAlerts: false,
  emailAlerts: true,
  pushNotifications: true,
};

export const defaultThemePrefs = {
  mode: 'light',
  density: 'comfortable',
  accentColor: 'blue',
};

export const accentColorOptions = [
  { id: 'blue', label: 'Blue', hex: '#2563EB' },
  { id: 'purple', label: 'Purple', hex: '#8B5CF6' },
  { id: 'green', label: 'Green', hex: '#22C55E' },
  { id: 'amber', label: 'Amber', hex: '#F59E0B' },
];

export const defaultSecurity = {
  twoFactorEnabled: true,
  lastPasswordChange: '2026-05-12',
  activeSessions: [
    { id: 'SES-01', device: 'Chrome on Windows', location: 'Gondia, Maharashtra', lastActive: '2026-07-18T06:40:00', current: true },
    { id: 'SES-02', device: 'GridWeaver Mobile App (Android)', location: 'Gondia, Maharashtra', lastActive: '2026-07-17T19:22:00', current: false },
    { id: 'SES-03', device: 'Firefox on Ubuntu', location: 'Nagpur, Maharashtra', lastActive: '2026-07-15T11:05:00', current: false },
  ],
};

export const defaultApiConfig = {
  apiKey: 'gw_live_sk_4f8a2c9d1e6b7a3f5c8d2e1b9a4f6c3d',
  webhookUrl: 'https://ops.gridweaver.io/webhooks/inbound',
  rateLimitPerMin: 120,
  environment: 'production',
};