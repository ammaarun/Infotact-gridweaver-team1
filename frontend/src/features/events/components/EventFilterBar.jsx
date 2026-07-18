import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button, useTheme } from '@mui/material';
import { MdSearch, MdFilterAltOff } from 'react-icons/md';
import { EVENT_SEVERITY, EVENT_CATEGORIES } from '../data/eventsData';

const EventFilterBar = ({ searchTerm, onSearchChange, filters, onFilterChange, onClear }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{ 'aria-label': 'Search events' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdSearch size={20} color={theme.palette.text.secondary} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: { xs: '100%', sm: 260 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'background.paper' } }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="severity-filter-label">Severity</InputLabel>
        <Select
          labelId="severity-filter-label"
          label="Severity"
          value={filters.severity}
          onChange={(e) => onFilterChange('severity', e.target.value)}
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="all">All Severities</MenuItem>
          {Object.values(EVENT_SEVERITY).map((severity) => (
            <MenuItem key={severity} value={severity} sx={{ textTransform: 'capitalize' }}>
              {severity}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
          label="Category"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {Object.values(EVENT_CATEGORIES).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button size="small" startIcon={<MdFilterAltOff size={16} />} onClick={onClear} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}>
        Clear Filters
      </Button>
    </Box>
  );
};

export default EventFilterBar;