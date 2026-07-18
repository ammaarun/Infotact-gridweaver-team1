import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { getTrendColor } from '../utils/analyticsUtils';

const AnalyticsSummaryCards = ({ summary }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      {summary.map((item) => (
        <Grid item xs={12} sm={6} lg={3} key={item.id}>
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {item.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.unit}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {item.trendDirection === 'up' ? (
                <MdTrendingUp size={16} color={getTrendColor('up', theme)} />
              ) : (
                <MdTrendingDown size={16} color={getTrendColor('down', theme)} />
              )}
              <Typography variant="caption" sx={{ color: getTrendColor(item.trendDirection, theme), fontWeight: 600 }}>
                {Math.abs(item.trend)}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                vs last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsSummaryCards;