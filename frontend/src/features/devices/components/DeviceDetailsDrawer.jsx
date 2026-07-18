import { Drawer, Box, Typography, Divider, IconButton, Grid, Chip } from '@mui/material';
import { MdClose, MdMemory } from 'react-icons/md';
import DeviceStatusChip from '../../../components/tables/DeviceStatusChip';
import { formatLastSeen, formatPower } from '../utils/deviceUtils';

const InfoRow = ({ label, value }) => (
  <Grid item xs={6}>
    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {value}
    </Typography>
  </Grid>
);

const DeviceDetailsDrawer = ({ device, open, onClose }) => {
  if (!device) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3, bgcolor: 'background.paper' } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {device.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
            {device.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close device details">
          <MdClose size={20} />
        </IconButton>
      </Box>

      <Box sx={{ mb: 2 }}>
        <DeviceStatusChip status={device.status} />
        <Chip label={device.type} size="small" variant="outlined" sx={{ ml: 1, borderRadius: '8px' }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <InfoRow label="Location" value={device.location} />
        <InfoRow label="Last Seen" value={formatLastSeen(device.lastSeen)} />
        <InfoRow label="Power Output" value={formatPower(device.powerOutput)} />
        <InfoRow label="Uptime" value={`${device.uptime}%`} />
        <InfoRow label="Voltage" value={`${device.voltage} V`} />
        <InfoRow label="Current" value={`${device.current} A`} />
        {device.batteryLevel !== null && <InfoRow label="Battery Level" value={`${device.batteryLevel}%`} />}
        <InfoRow label="Firmware" value={device.firmwareVersion} />
        <InfoRow label="Installed On" value={device.installedOn} />
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <MdMemory size={16} />
          <Typography variant="caption">
            Coordinates: {device.coordinates.lat}, {device.coordinates.lng}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DeviceDetailsDrawer;