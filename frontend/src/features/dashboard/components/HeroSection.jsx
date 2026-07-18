import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";

const HeroSection = ({ systemHealth }) => {
  const now = new Date();

  const currentDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        position: "relative",
        borderRadius: 5,
        p: 3,
        background: (theme) =>
  theme.palette.mode === "dark"
    ? "linear-gradient(135deg,#1E293B 0%,#0F172A 55%,#111827 100%)"
    : theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: "0 25px 45px rgba(0,0,0,.35)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -120,
          top: -120,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(59,130,246,.15)",
          filter: "blur(70px)",
        }}
      />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} lg={8}>
          <Typography
            sx={{
              fontSize: {
                xs: 26,
                md: 36,
              },
              fontWeight: 800,
            }}
          >
            Smart Grid Command Center
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: (theme) => theme.palette.text.secondary,
              maxWidth: 700,
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            Monitor generation, battery health,
            transmission, IoT sensors and energy
            consumption in real time from one
            intelligent dashboard.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            mt={4}
          >
            <Chip
              icon={<CalendarMonthRoundedIcon />}
              label={currentDate}
              sx={{
                bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.08)"
    : "rgba(0,0,0,.05)",
                color: (theme) => theme.palette.text.primary,
                height: 42,
              }}
            />

            <Chip
              icon={<AccessTimeFilledRoundedIcon />}
              label={currentTime}
              sx={{
                bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.08)"
    : "rgba(0,0,0,.05)",
                color: (theme) => theme.palette.text.primary,
                height: 42,
              }}
            />

            <Chip
              icon={<ElectricBoltRoundedIcon />}
              label={`Uptime ${systemHealth.uptime}%`}
              sx={{
                bgcolor: "#16A34A",
                color: "#fff",
                height: 42,
                fontWeight: 700,
              }}
            />
          </Stack>

          <Grid container spacing={3} mt={3}>
            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.06)"
    : "rgba(0,0,0,.03)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#2563EB",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <TrendingUpRoundedIcon />
                </Avatar>

                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  128
                </Typography>

                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: 13,
                  }}
                >
                  Active Nodes
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.06)"
    : "rgba(0,0,0,.03)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#9333EA",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <SensorsRoundedIcon />
                </Avatar>

                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  64
                </Typography>

                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: 13,
                  }}
                >
                  IoT Devices
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.06)"
    : "rgba(0,0,0,.03)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#16A34A",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <BoltIcon />
                </Avatar>

                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  99.8%
                </Typography>

                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: 13,
                  }}
                >
                  Grid Stability
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.06)"
    : "rgba(0,0,0,.03)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#F59E0B",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <MonitorHeartRoundedIcon />
                </Avatar>

                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {systemHealth.activeIncidents}
                </Typography>

                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: 13,
                  }}
                >
                  Active Alerts
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.3,
              borderRadius:4,
              bgcolor: (theme) =>
  theme.palette.mode === "dark"
    ? "rgba(255,255,255,.06)"
    : "rgba(0,0,0,.03)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <Stack spacing={3}>
              <Avatar
                sx={{
                  width:70,
                  height:58,
                  bgcolor: "#22C55E",
                }}
              >
                <BoltIcon fontSize="large" />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  System Health
                </Typography>

                <Typography
                  sx={{
                    color: "#22C55E",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  ● All Systems Operational
                </Typography>
              </Box>

              <Divider
                sx={{
                  borderColor: (theme) => theme.palette.divider,
                }}
              />

              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography color={(theme) => theme.palette.text.secondary}>
                    Uptime
                  </Typography>

                  <Typography fontWeight={700}>
                    {systemHealth.uptime}%
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography color={(theme) => theme.palette.text.secondary}>
                    Active Incidents
                  </Typography>

                  <Typography
                    color="#F59E0B"
                    fontWeight={700}
                  >
                    {systemHealth.activeIncidents}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                <Typography color={(theme) => theme.palette.text.secondary}>
                    Last Incident
                  </Typography>

                  <Typography fontWeight={700}>
                    {systemHealth.lastIncidentResolvedMinsAgo} mins ago
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography color={(theme) => theme.palette.text.secondary}>
                    Grid Status
                  </Typography>

                  <Typography
                    color="#22C55E"
                    fontWeight={700}
                  >
                    Stable
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeroSection;