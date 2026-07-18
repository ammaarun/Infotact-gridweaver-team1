export const TIME_RANGES = {
  DAY: '24h',
  WEEK: '7d',
  MONTH: '30d',
};

const generateHourlyPowerData = () => {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    const solarFactor = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0;
    data.push({
      time: label,
      solar: parseFloat((solarFactor * 42 + Math.random() * 3).toFixed(1)),
      wind: parseFloat((8 + Math.random() * 10).toFixed(1)),
      grid: parseFloat((15 + Math.random() * 8).toFixed(1)),
    });
  }
  return data;
};

const generateWeeklyPowerData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    time: day,
    solar: parseFloat((180 + Math.random() * 60).toFixed(1)),
    wind: parseFloat((90 + Math.random() * 40).toFixed(1)),
    grid: parseFloat((120 + Math.random() * 30).toFixed(1)),
  }));
};

const generateMonthlyPowerData = () => {
  const data = [];
  for (let day = 1; day <= 30; day++) {
    data.push({
      time: `${day}`,
      solar: parseFloat((170 + Math.random() * 70).toFixed(1)),
      wind: parseFloat((85 + Math.random() * 45).toFixed(1)),
      grid: parseFloat((110 + Math.random() * 35).toFixed(1)),
    });
  }
  return data;
};

export const powerTrendsData = {
  [TIME_RANGES.DAY]: generateHourlyPowerData(),
  [TIME_RANGES.WEEK]: generateWeeklyPowerData(),
  [TIME_RANGES.MONTH]: generateMonthlyPowerData(),
};

export const consumptionTrendsData = {
  [TIME_RANGES.DAY]: [
    { time: '00:00', residential: 22, commercial: 8, industrial: 34 },
    { time: '04:00', residential: 15, commercial: 6, industrial: 30 },
    { time: '08:00', residential: 38, commercial: 42, industrial: 48 },
    { time: '12:00', residential: 44, commercial: 55, industrial: 52 },
    { time: '16:00', residential: 40, commercial: 48, industrial: 50 },
    { time: '20:00', residential: 52, commercial: 30, industrial: 38 },
  ],
  [TIME_RANGES.WEEK]: [
    { time: 'Mon', residential: 280, commercial: 320, industrial: 410 },
    { time: 'Tue', residential: 265, commercial: 335, industrial: 405 },
    { time: 'Wed', residential: 290, commercial: 310, industrial: 420 },
    { time: 'Thu', residential: 275, commercial: 340, industrial: 415 },
    { time: 'Fri', residential: 300, commercial: 355, industrial: 430 },
    { time: 'Sat', residential: 340, commercial: 210, industrial: 290 },
    { time: 'Sun', residential: 320, commercial: 180, industrial: 260 },
  ],
  [TIME_RANGES.MONTH]: Array.from({ length: 30 }, (_, i) => ({
    time: `${i + 1}`,
    residential: parseFloat((260 + Math.random() * 90).toFixed(0)),
    commercial: parseFloat((180 + Math.random() * 160).toFixed(0)),
    industrial: parseFloat((260 + Math.random() * 180).toFixed(0)),
  })),
};

export const batteryTrendsData = {
  [TIME_RANGES.DAY]: [
    { time: '00:00', charge: 72, discharge: 18 },
    { time: '04:00', charge: 65, discharge: 12 },
    { time: '08:00', charge: 58, discharge: 34 },
    { time: '12:00', charge: 82, discharge: 20 },
    { time: '16:00', charge: 90, discharge: 28 },
    { time: '20:00', charge: 74, discharge: 42 },
  ],
  [TIME_RANGES.WEEK]: [
    { time: 'Mon', charge: 78, discharge: 30 },
    { time: 'Tue', charge: 82, discharge: 25 },
    { time: 'Wed', charge: 75, discharge: 33 },
    { time: 'Thu', charge: 80, discharge: 28 },
    { time: 'Fri', charge: 85, discharge: 22 },
    { time: 'Sat', charge: 70, discharge: 38 },
    { time: 'Sun', charge: 68, discharge: 35 },
  ],
  [TIME_RANGES.MONTH]: Array.from({ length: 30 }, (_, i) => ({
    time: `${i + 1}`,
    charge: parseFloat((60 + Math.random() * 35).toFixed(0)),
    discharge: parseFloat((15 + Math.random() * 30).toFixed(0)),
  })),
};

export const analyticsSummary = [
  { id: 'total-generation', label: 'Total Generation', value: '18,420', unit: 'kWh', trend: 4.2, trendDirection: 'up' },
  { id: 'total-consumption', label: 'Total Consumption', value: '16,850', unit: 'kWh', trend: -1.8, trendDirection: 'down' },
  { id: 'peak-load', label: 'Peak Load', value: '742', unit: 'kW', trend: 2.6, trendDirection: 'up' },
  { id: 'grid-efficiency', label: 'Grid Efficiency', value: '94.6', unit: '%', trend: 0.9, trendDirection: 'up' },
];