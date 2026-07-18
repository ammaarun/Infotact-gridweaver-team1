import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const BatteryTrendsChart = ({ data }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Battery Trends
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Charge vs. discharge rate (%)
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={{ stroke: theme.palette.divider }} />
          <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              fontSize: '0.8rem',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
          <Legend wrapperStyle={{ fontSize: '0.75rem', color: theme.palette.text.secondary }} />
          <Line type="monotone" dataKey="charge" name="Charge" stroke={theme.palette.success.main} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={800} />
          <Line type="monotone" dataKey="discharge" name="Discharge" stroke={theme.palette.error.main} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default BatteryTrendsChart;