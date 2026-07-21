import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";

import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

import {
  batteryChartData,
  batteryInfo,
} from "../data/batteryChartData";

const BatteryChart = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={3}
        >
          <BatteryChargingFullRoundedIcon
            sx={{
              color: "#8B5CF6",
            }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Battery Status
          </Typography>
        </Box>

        {/* Chart */}
        <Box
          sx={{
            position: "relative",
            height: 220,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <RadialBarChart
              innerRadius="75%"
              outerRadius="100%"
              barSize={16}
              data={batteryChartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background
                clockWise
                dataKey="value"
                cornerRadius={20}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
            >
              {batteryInfo.percentage}%
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Charge
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Box display="flex" gap={1}>
              <CheckCircleRoundedIcon
                color="success"
                fontSize="small"
              />

              <Typography variant="body2">
                Status
              </Typography>
            </Box>

            <Typography
              fontWeight={600}
              color="success.main"
            >
              {batteryInfo.status}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Box display="flex" gap={1}>
              <BoltRoundedIcon
                color="warning"
                fontSize="small"
              />

              <Typography variant="body2">
                Voltage
              </Typography>
            </Box>

            <Typography fontWeight={600}>
              {batteryInfo.voltage}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Box display="flex" gap={1}>
              <ThermostatRoundedIcon
                color="error"
                fontSize="small"
              />

              <Typography variant="body2">
                Temperature
              </Typography>
            </Box>

            <Typography fontWeight={600}>
              {batteryInfo.temperature}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Box display="flex" gap={1}>
              <AccessTimeRoundedIcon
                color="primary"
                fontSize="small"
              />

              <Typography variant="body2">
                Last Sync
              </Typography>
            </Box>

            <Typography fontWeight={600}>
              {batteryInfo.lastSync}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BatteryChart;