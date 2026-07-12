import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DevicesOtherRoundedIcon from "@mui/icons-material/DevicesOtherRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";

export const dashboardStats = [
  {
    id: 1,
    title: "Total Devices",
    value: 128,
    subtitle: "8 new devices added this week",
    trend: "+6.2%",
    trendType: "increase",
    icon: DashboardRoundedIcon,
    color: "#2563EB",
  },
  {
    id: 2,
    title: "Online Devices",
    value: 114,
    subtitle: "89% devices currently active",
    trend: "+2.4%",
    trendType: "increase",
    icon: DevicesOtherRoundedIcon,
    color: "#22C55E",
  },
  {
    id: 3,
    title: "Power Usage",
    value: "4.8 MW",
    subtitle: "Current live consumption",
    trend: "-1.8%",
    trendType: "decrease",
    icon: BoltRoundedIcon,
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Battery Health",
    value: "96%",
    subtitle: "Average battery efficiency",
    trend: "+0.7%",
    trendType: "increase",
    icon: BatteryChargingFullRoundedIcon,
    color: "#8B5CF6",
  },
];