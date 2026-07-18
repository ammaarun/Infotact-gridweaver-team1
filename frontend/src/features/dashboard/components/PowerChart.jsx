import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { time: "06 AM", production: 5, consumption: 3, forecast: 4 },
  { time: "08 AM", production: 9, consumption: 6, forecast: 8 },
  { time: "10 AM", production: 15, consumption: 11, forecast: 14 },
  { time: "12 PM", production: 22, consumption: 17, forecast: 21 },
  { time: "02 PM", production: 27, consumption: 22, forecast: 26 },
  { time: "04 PM", production: 25, consumption: 20, forecast: 24 },
  { time: "06 PM", production: 18, consumption: 16, forecast: 19 },
  { time: "08 PM", production: 10, consumption: 12, forecast: 11 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={(theme) => ({
        bgcolor:
          theme.palette.mode === "dark"
            ? "#0F172A"
            : theme.palette.background.paper,
        backdropFilter: "blur(16px)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        p: 2,
        color: theme.palette.text.primary,
        minWidth: 180,
        boxShadow: "0 15px 35px rgba(0,0,0,.45)",
      })}
    >
      <Typography fontWeight={700} mb={1}>
        {label}
      </Typography>

      <Typography color="#3B82F6">
        ⚡ Production : {payload[0].value} MW
      </Typography>

      <Typography color="#22C55E">
        🔋 Consumption : {payload[1].value} MW
      </Typography>

      <Typography color="#A855F7">
        📈 Forecast : {payload[2].value} MW
      </Typography>
    </Box>
  );
};
const PowerChart = () => {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: 5,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg,#1E293B 0%,#0F172A 55%,#111827 100%)"
            : theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 25px 60px rgba(0,0,0,.45)",

        "&:before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background:
            "linear-gradient(90deg,#3B82F6,#22C55E,#A855F7)",
        },
      })}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Power Generation Analytics
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              Real-Time Production • Consumption • Forecast
            </Typography>
          </Box>

          <Chip
            icon={<TrendingUpRoundedIcon />}
            label="Live Grid"
            sx={{
              bgcolor: "#2563EB",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          flexWrap="wrap"
          mb={4}
        >
          <Box
            sx={{
              minWidth: 180,
              p: 2.5,
              borderRadius: 4,
              bgcolor: "rgba(59,130,246,.08)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <ElectricBoltRoundedIcon
                sx={{ color: "#3B82F6" }}
              />

              <Typography color="text.secondary">
                Production
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,
                fontSize: 34,
                color: "#3B82F6",
                fontWeight: 800,
              }}
            >
              24.8 MW
            </Typography>

            <Typography color="#22C55E">
              ▲ +12%
            </Typography>
          </Box>

          <Box
            sx={{
              minWidth: 180,
              p: 2.5,
              borderRadius: 4,
              bgcolor: "rgba(34,197,94,.08)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <FlashOnRoundedIcon
                sx={{ color: "#22C55E" }}
              />

              <Typography color="text.secondary">
                Consumption
              </Typography>
            </Stack>
            <Typography
              sx={{
                mt: 1,
                fontSize: 34,
                color: "#22C55E",
                fontWeight: 800,
              }}
            >
              22.6 MW
            </Typography>

            <Typography color="#EF4444">
              ▼ -4%
            </Typography>
          </Box>

          <Box
            sx={{
              minWidth: 180,
              p: 2.5,
              borderRadius: 4,
              bgcolor: "rgba(168,85,247,.08)",
            }}
          >
            <Typography color="text.secondary">
              Efficiency
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 34,
                fontWeight: 800,
                color: "#A855F7",
              }}
            >
              94.6%
            </Typography>

            <Typography color="#22C55E">
              Excellent
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={(theme) => ({
            borderColor: theme.palette.divider,
            mb: 3,
          })}
        />

        <Box
          sx={{
            height: {
              xs: 220,
              md: 270,
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="productionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3B82F6"
                    stopOpacity={0.75}
                  />

                  <stop
                    offset="95%"
                    stopColor="#3B82F6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,.08)"
                strokeDasharray="5 5"
              />

              <XAxis
                dataKey="time"
                tick={{ fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  color: "#fff",
                  paddingTop: 15,
                }}
              />
              <Area
                type="monotone"
                dataKey="production"
                stroke="#3B82F6"
                fill="url(#productionGradient)"
                strokeWidth={3}
                activeDot={{
                  r: 7,
                  fill: "#fff",
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                }}
              />

              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#22C55E",
                }}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#A855F7"
                strokeWidth={3}
                strokeDasharray="7 7"
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
          mt={4}
        >
          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Peak Generation
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              27.4 MW
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Average Load
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              18.9 MW
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Grid Health
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 700,
                color: "#22C55E",
              }}
            >
              Excellent
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Connected Nodes
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              128
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PowerChart;