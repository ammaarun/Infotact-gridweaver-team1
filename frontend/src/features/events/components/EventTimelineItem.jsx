import { Box, Typography, Chip, useTheme } from '@mui/material';
import EventSeverityIcon from './EventSeverityIcon';
import { getSeverityConfig, formatEventTime } from '../utils/eventUtils';

const EventTimelineItem = ({ event, isLast }) => {
  const theme = useTheme();
  const { color } = getSeverityConfig(event.severity, theme);

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            border: `2px solid ${color}`,
            flexShrink: 0,
          }}
        >
          <EventSeverityIcon severity={event.severity} />
        </Box>
        {!isLast && <Box sx={{ width: '2px', flexGrow: 1, bgcolor: 'divider', mt: 0.5 }} />}
      </Box>

      <Box sx={{ pb: 3, flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {event.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {formatEventTime(event.timestamp)}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <Chip label={event.category} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
          {event.deviceId && (
            <Chip label={event.deviceId} size="small" sx={{ borderRadius: '8px', fontFamily: 'monospace', bgcolor: 'background.default' }} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventTimelineItem;