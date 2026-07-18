import { Box, Typography, Grid } from '@mui/material';
import useAnalytics from '../../features/analytics/hooks/useAnalytics';
import TimeRangeSelector from '../../features/analytics/components/TimeRangeSelector';
import AnalyticsSummaryCards from '../../features/analytics/components/AnalyticsSummaryCards';
import PowerTrendsChart from '../../features/analytics/components/PowerTrendsChart';
import ConsumptionTrendsChart from '../../features/analytics/components/ConsumptionTrendsChart';
import BatteryTrendsChart from '../../features/analytics/components/BatteryTrendsChart';

const AnalyticsPage = () => {
  const { timeRange, setTimeRange, powerData, consumptionData, batteryData, summary } = useAnalytics();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Energy Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Power, consumption, and battery performance over time
          </Typography>
        </Box>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <AnalyticsSummaryCards summary={summary} />
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <PowerTrendsChart data={powerData} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ConsumptionTrendsChart data={consumptionData} />
        </Grid>
        <Grid item xs={12}>
          <BatteryTrendsChart data={batteryData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;