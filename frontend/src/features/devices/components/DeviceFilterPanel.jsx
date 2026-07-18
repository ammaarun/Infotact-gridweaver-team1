import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { MdFilterAltOff } from 'react-icons/md';
import { DEVICE_STATUS, DEVICE_TYPES } from '../data/devicesData';

const DeviceFilterPanel = ({ filters, onFilterChange, onClear }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          label="Status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          {Object.values(DEVICE_STATUS).map((status) => (
            <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="type-filter-label">Device Type</InputLabel>
        <Select
          labelId="type-filter-label"
          label="Device Type"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="all">All Types</MenuItem>
          {Object.values(DEVICE_TYPES).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        size="small"
        startIcon={<MdFilterAltOff size={16} />}
        onClick={onClear}
        sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default DeviceFilterPanel;