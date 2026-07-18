import { alpha } from '@mui/material/styles';
import { DEVICE_STATUS } from '../data/devicesData';

export const getStatusConfig = (status, theme) => {
  const config = {
    [DEVICE_STATUS.ONLINE]: {
      label: 'Online',
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    },
    [DEVICE_STATUS.OFFLINE]: {
      label: 'Offline',
      color: theme.palette.text.secondary,
      bg: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.2 : 0.1),
    },
    [DEVICE_STATUS.WARNING]: {
      label: 'Warning',
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    },
    [DEVICE_STATUS.CRITICAL]: {
      label: 'Critical',
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    },
    [DEVICE_STATUS.MAINTENANCE]: {
      label: 'Maintenance',
      color: theme.palette.secondary.main,
      bg: alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    },
  };
  return config[status] || config[DEVICE_STATUS.OFFLINE];
};

// Unchanged — no color values, no logic modified below
export const formatLastSeen = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export const formatPower = (value) => `${value.toFixed(2)} kW`;

export const searchDevices = (devices, query) => {
  if (!query.trim()) return devices;
  const lowerQuery = query.toLowerCase();
  return devices.filter(
    (device) =>
      device.name.toLowerCase().includes(lowerQuery) ||
      device.id.toLowerCase().includes(lowerQuery) ||
      device.location.toLowerCase().includes(lowerQuery)
  );
};

export const filterDevices = (devices, filters) => {
  return devices.filter((device) => {
    const statusMatch = filters.status === 'all' || device.status === filters.status;
    const typeMatch = filters.type === 'all' || device.type === filters.type;
    return statusMatch && typeMatch;
  });
};

export const sortDevices = (devices, sortBy, sortDirection) => {
  const sorted = [...devices].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

export const paginateDevices = (devices, page, rowsPerPage) => {
  const start = page * rowsPerPage;
  return devices.slice(start, start + rowsPerPage);
};