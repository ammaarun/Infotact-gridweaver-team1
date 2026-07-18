import { TextField, InputAdornment, Box, useTheme } from '@mui/material';
import { MdSearch } from 'react-icons/md';

const DeviceSearchBar = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search by device name, ID, or location..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{ 'aria-label': 'Search devices' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box sx={{ display: 'flex', color: 'text.secondary' }}>
              <MdSearch size={20} color={theme.palette.text.secondary} />
            </Box>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          bgcolor: 'background.paper',
        },
      }}
    />
  );
};

export default DeviceSearchBar;