import { alpha } from '@mui/material/styles';
import { EVENT_SEVERITY } from '../data/eventsData';

export const getSeverityConfig = (severity, theme) => {
  const tint = theme.palette.mode === 'dark' ? 0.2 : 0.12;
  const config = {
    [EVENT_SEVERITY.INFO]: { label: 'Info', color: theme.palette.primary.main, bg: alpha(theme.palette.primary.main, tint) },
    [EVENT_SEVERITY.WARNING]: { label: 'Warning', color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, tint) },
    [EVENT_SEVERITY.CRITICAL]: { label: 'Critical', color: theme.palette.error.main, bg: alpha(theme.palette.error.main, tint) },
    [EVENT_SEVERITY.SUCCESS]: { label: 'Success', color: theme.palette.success.main, bg: alpha(theme.palette.success.main, tint) },
  };
  return config[severity] || config[EVENT_SEVERITY.INFO];
};

export const formatEventTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
};

export const searchEvents = (events, query) => {
  if (!query.trim()) return events;
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.id.toLowerCase().includes(lowerQuery)
  );
};

export const filterEvents = (events, filters) => {
  return events.filter((event) => {
    const severityMatch = filters.severity === 'all' || event.severity === filters.severity;
    const categoryMatch = filters.category === 'all' || event.category === filters.category;
    return severityMatch && categoryMatch;
  });
};

export const sortEventsByRecency = (events) => [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const paginateEvents = (events, page, rowsPerPage) => {
  const start = page * rowsPerPage;
  return events.slice(start, start + rowsPerPage);
};