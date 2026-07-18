import { useMemo } from 'react';
import {
  systemHealth,
  kpiData,
  powerFlowNodes,
  powerGenerationSeries,
  batteryGaugeData,
  deviceStatusBreakdown,
  weeklyEnergyData,
  liveAlerts,
  recentActivities,
  iotMapDevices,
  weatherSnapshot,
  aiInsight,
  quickActions,
} from '../data/dashboardData';

const useDashboard = () => {
  return useMemo(
    () => ({
      systemHealth,
      kpis: kpiData,
      powerFlowNodes,
      powerGenerationSeries,
      batteryGauge: batteryGaugeData,
      deviceStatusBreakdown,
      weeklyEnergyData,
      liveAlerts,
      recentActivities,
      iotMapDevices,
      weather: weatherSnapshot,
      aiInsight,
      quickActions,
    }),
    []
  );
};

export default useDashboard;