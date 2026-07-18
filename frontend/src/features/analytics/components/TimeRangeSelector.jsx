import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { TIME_RANGES } from '../data/analyticsData';

const rangeLabels = {
  [TIME_RANGES.DAY]: '24H',
  [TIME_RANGES.WEEK]: '7D',
  [TIME_RANGES.MONTH]: '30D',
};

const TimeRangeSelector = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={(e, newValue) => newValue && onChange(newValue)}
      aria-label="Select time range"
    >
      {Object.values(TIME_RANGES).map((range) => (
        <ToggleButton
          key={range}
          value={range}
          sx={{
            textTransform: 'none',
            px: 2,
            fontWeight: 600,
            fontSize: '0.75rem',
            color: 'text.secondary',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
            },
          }}
        >
          {rangeLabels[range]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TimeRangeSelector;