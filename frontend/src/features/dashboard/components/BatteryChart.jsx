import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

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
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: 5,
        background: (theme) =>
        theme.palette.mode === "dark"
          ? "linear-gradient(145deg,#1E293B 0%,#0F172A 55%,#111827 100%)"
            : theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: "0 20px 45px rgba(0,0,0,.35)",

        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg,#8B5CF6,#3B82F6)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3.5,
          "&:last-child": {
            pb: 3.5,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <BatteryChargingFullRoundedIcon
              sx={{
                color: "#8B5CF6",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Battery Health
              </Typography>

              <Typography
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: 14,
                }}
              >
                Energy Storage Overview
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<TrendingUpRoundedIcon />}
            label="Healthy"
            sx={{
              bgcolor: "#16A34A",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Box
          sx={{
            position: "relative",
            height: 260,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <RadialBarChart
              innerRadius="74%"
              outerRadius="100%"
              data={batteryChartData}
              startAngle={90}
              endAngle={-270}
              barSize={18}
            >
              <RadialBar
                background={{
                  fill: (theme) =>
                    theme.palette.mode === "dark"
                   ? "rgba(255,255,255,.08)"
                          : "#E5E7EB",
                }}
                clockWise
                dataKey="value"
                cornerRadius={25}
                fill="#8B5CF6"
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 800,
              }}
            >
              {batteryInfo.percentage}%
            </Typography>

            <Typography
              sx={{
                color: (theme) => theme.palette.text.secondary,
              }}
            >
              Battery Charge
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: (theme) => theme.palette.divider,
            my: 3,
          }}
        />

        <Stack spacing={2.5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CheckCircleRoundedIcon
                sx={{
                  color: "#22C55E",
                }}
              />

              <Typography color={(theme) => theme.palette.text.secondary}>
                Status
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#22C55E",
                fontWeight: 700,
              }}
            >
              {batteryInfo.status}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <BoltRoundedIcon
                sx={{
                  color: "#F59E0B",
                }}
              />

              <Typography color={(theme) => theme.palette.text.secondary}>
                Voltage
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {batteryInfo.voltage}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <ThermostatRoundedIcon
                sx={{
                  color: "#EF4444",
                }}
              />

              <Typography color={(theme) => theme.palette.text.secondary}>
                Temperature
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {batteryInfo.temperature}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <AccessTimeRoundedIcon
                sx={{
                  color: "#3B82F6",
                }}
              />

              <Typography color={(theme) => theme.palette.text.secondary}>
                Last Sync
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {batteryInfo.lastSync}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
            bgcolor: (theme) => theme.palette.mode === "dark"
    ? "rgba(139,92,246,.08)"
    : "rgba(139,92,246,.05)",
            border: (theme) => theme.palette.mode === "dark"
    ? "1px solid rgba(139,92,246,.18)"
    : "1px solid rgba(139,92,246,.25)",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            Estimated Backup
          </Typography>

          <Typography
            sx={{
              mt: .5,
              fontSize: 22,
              fontWeight: 700,
              color: "#8B5CF6",
            }}
          >
            08h 42m Remaining
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BatteryChart;