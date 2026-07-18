import { useState, useMemo } from 'react';
import { TIME_RANGES, analyticsSummary } from '../data/analyticsData';
import { getPowerTrends, getConsumptionTrends, getBatteryTrends } from '../utils/analyticsUtils';

const useAnalytics = () => {
  const [timeRange, setTimeRange] = useState(TIME_RANGES.WEEK);

  const powerData = useMemo(() => getPowerTrends(timeRange), [timeRange]);
  const consumptionData = useMemo(() => getConsumptionTrends(timeRange), [timeRange]);
  const batteryData = useMemo(() => getBatteryTrends(timeRange), [timeRange]);

  return {
    timeRange,
    setTimeRange,
    powerData,
    consumptionData,
    batteryData,
    summary: analyticsSummary,
  };
};

export default useAnalytics;