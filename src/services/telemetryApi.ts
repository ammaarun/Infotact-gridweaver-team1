import { apiClient } from './apiClient';
import type { GridStats, Alert, EventLog, Device } from '../types';

export const fetchGridStats = async (): Promise<GridStats> => {
  const response = await apiClient.get('/telemetry/stats');
  return response.data.data;
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await apiClient.get('/telemetry/alerts');
  return response.data.data;
};

export const fetchEventLogs = async (): Promise<EventLog[]> => {
  const response = await apiClient.get('/telemetry/events');
  return response.data.data;
};

export const fetchFaultDevices = async (): Promise<Device[]> => {
  const response = await apiClient.get('/telemetry/devices/faults');
  return response.data.data;
};

export const fetchPowerData = async () => {
  const response = await apiClient.get('/telemetry/charts/power');
  return response.data.data;
};

export const fetchVoltageData = async () => {
  const response = await apiClient.get('/telemetry/charts/voltage');
  return response.data.data;
};

export const fetchBatteryData = async () => {
  const response = await apiClient.get('/telemetry/charts/battery');
  return response.data.data;
};

export const fetchGridLoadData = async () => {
  const response = await apiClient.get('/telemetry/charts/load');
  return response.data.data;
};

export const fetchWeeklyGenerationData = async () => {
  const response = await apiClient.get('/telemetry/charts/weekly');
  return response.data.data;
};

export const fetchMonthlyGenerationData = async () => {
  const response = await apiClient.get('/telemetry/charts/monthly');
  return response.data.data;
};

export const fetchFaultStatisticsData = async () => {
  const response = await apiClient.get('/telemetry/charts/faults');
  return response.data.data;
};

export const fetchZoneComparisonData = async () => {
  const response = await apiClient.get('/telemetry/charts/zones');
  return response.data.data;
};

export const fetchPeakHoursData = async () => {
  const response = await apiClient.get('/telemetry/charts/peak');
  return response.data.data;
};

export const fetchAllDevices = async (): Promise<Device[]> => {
  const response = await apiClient.get('/telemetry/devices');
  return response.data.data;
};

export const fetchDeviceById = async (id: string): Promise<Device> => {
  const response = await apiClient.get(`/telemetry/devices/${id}`);
  return response.data.data;
};

export const fetchGridZones = async (): Promise<any[]> => {
  const response = await apiClient.get('/telemetry/zones');
  return response.data.data;
};

export const fetchNotifications = async (): Promise<any[]> => {
  const response = await apiClient.get('/telemetry/notifications');
  return response.data.data;
};

export const fetchOperatorProfile = async (): Promise<any> => {
  const response = await apiClient.get('/telemetry/profile');
  return response.data.data;
};

