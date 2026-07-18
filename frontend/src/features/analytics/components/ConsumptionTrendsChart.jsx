import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const ConsumptionTrendsChart = ({ data }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Consumption Trends
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Usage by sector (kWh)
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
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
            cursor={{ fill: theme.palette.action.hover }}
          />
          <Legend wrapperStyle={{ fontSize: '0.75rem', color: theme.palette.text.secondary }} />
          <Bar dataKey="residential" name="Residential" stackId="a" fill={theme.palette.primary.main} animationDuration={800} />
          <Bar dataKey="commercial" name="Commercial" stackId="a" fill={theme.palette.secondary.main} animationDuration={800} />
          <Bar dataKey="industrial" name="Industrial" stackId="a" fill={theme.palette.success.main} radius={[8, 8, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ConsumptionTrendsChart;