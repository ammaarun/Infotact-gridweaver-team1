import { useTheme } from '@mui/material';
import { MdInfo, MdWarning, MdError, MdCheckCircle } from 'react-icons/md';
import { EVENT_SEVERITY } from '../data/eventsData';
import { getSeverityConfig } from '../utils/eventUtils';

const iconMap = {
  [EVENT_SEVERITY.INFO]: MdInfo,
  [EVENT_SEVERITY.WARNING]: MdWarning,
  [EVENT_SEVERITY.CRITICAL]: MdError,
  [EVENT_SEVERITY.SUCCESS]: MdCheckCircle,
};

const EventSeverityIcon = ({ severity, size = 18 }) => {
  const theme = useTheme();
  const Icon = iconMap[severity] || MdInfo;
  const { color } = getSeverityConfig(severity, theme);
  return <Icon size={size} color={color} aria-hidden="true" />;
};

export default EventSeverityIcon;