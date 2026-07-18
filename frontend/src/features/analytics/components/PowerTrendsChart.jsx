import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const PowerTrendsChart = ({ data }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Power Trends
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Generation by source (kW)
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.35} />
              <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.35} />
              <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area type="monotone" dataKey="solar" name="Solar" stroke={theme.palette.warning.main} fill="url(#solarGradient)" strokeWidth={2} animationDuration={800} />
          <Area type="monotone" dataKey="wind" name="Wind" stroke={theme.palette.primary.main} fill="url(#windGradient)" strokeWidth={2} animationDuration={800} />
          <Area type="monotone" dataKey="grid" name="Grid" stroke={theme.palette.secondary.main} fill="url(#gridGradient)" strokeWidth={2} animationDuration={800} />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default PowerTrendsChart;