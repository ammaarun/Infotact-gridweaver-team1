export const formatNumber = (value) => {
  if (value >= 1000) return value.toLocaleString('en-IN');
  return value;
};

export const getTrendColor = (direction, theme) =>
  direction === 'up' ? theme.palette.success.main : theme.palette.error.main;

export const getSeverityColor = (severity, theme) => {
  const map = {
    critical: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info?.main || theme.palette.primary.main,
    success: theme.palette.success.main,
  };
  return map[severity] || theme.palette.text.secondary;
};

export const getDeviceStatusColor = (colorKey, theme) => {
  const map = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    grey: theme.palette.text.disabled || theme.palette.text.secondary,
  };
  return map[colorKey] || theme.palette.text.secondary;
};

export const getMapMarkerColor = (status, theme) => {
  const map = {
    online: theme.palette.success.main,
    warning: theme.palette.warning.main,
    critical: theme.palette.error.main,
    offline: theme.palette.text.disabled || theme.palette.text.secondary,
  };
  return map[status] || theme.palette.text.secondary;
};

export const formatRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${Math.floor(diffHours / 24)} day(s) ago`;
};

export const getHealthStatusMeta = (status, theme) => {
  const map = {
    optimal: { label: 'All Systems Optimal', color: theme.palette.success.main },
    degraded: { label: 'Degraded Performance', color: theme.palette.warning.main },
    critical: { label: 'Critical Issues Detected', color: theme.palette.error.main },
  };
  return map[status] || map.optimal;
};