// src/components/tables/DeviceStatusChip.jsx

import { Chip, useTheme } from '@mui/material';
import { getStatusConfig } from '../../features/devices/utils/deviceUtils';

const DeviceStatusChip = ({ status }) => {
  const theme = useTheme();
  const { label, color, bg } = getStatusConfig(status, theme);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: bg,
        color: color,
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '8px',
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
};

export default DeviceStatusChip;