import { powerTrendsData, consumptionTrendsData, batteryTrendsData } from '../data/analyticsData';

export const getPowerTrends = (range) => powerTrendsData[range] || powerTrendsData['24h'];
export const getConsumptionTrends = (range) => consumptionTrendsData[range] || consumptionTrendsData['24h'];
export const getBatteryTrends = (range) => batteryTrendsData[range] || batteryTrendsData['24h'];

export const getTrendColor = (direction, theme) =>
  direction === 'up' ? theme.palette.success.main : theme.palette.error.main;