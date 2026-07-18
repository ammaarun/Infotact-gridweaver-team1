import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

import { recentEvents } from "../data/recentEventsData";

const getEventStyle = (status) => {
  switch (status) {
    case "success":
      return {
        icon: <CheckCircleRoundedIcon sx={{ color: "#22C55E" }} />,
        chip: "Success",
        chipColor: "#22C55E",
      };

    case "warning":
      return {
        icon: <WarningAmberRoundedIcon sx={{ color: "#F59E0B" }} />,
        chip: "Warning",
        chipColor: "#F59E0B",
      };

    case "error":
      return {
        icon: <ErrorRoundedIcon sx={{ color: "#EF4444" }} />,
        chip: "Critical",
        chipColor: "#EF4444",
      };

    default:
      return {
        icon: <InfoRoundedIcon sx={{ color: "#3B82F6" }} />,
        chip: "Info",
        chipColor: "#3B82F6",
      };
  }
};

const RecentEventsTable = () => {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: 5,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg,#1E293B 0%,#0F172A 55%,#111827 100%)"
            : theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 20px 45px rgba(0,0,0,.35)",

        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg,#22C55E,#3B82F6,#A855F7)",
        },
      })}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Recent Events
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Latest Smart Grid Activities
            </Typography>
          </Box>

          <Chip
            icon={<NotificationsActiveRoundedIcon />}
            label={`${recentEvents.length} Events`}
            sx={{
              bgcolor: "#2563EB",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Box>
        <Stack
          spacing={1}
          divider={
            <Divider
              sx={(theme) => ({
                borderColor: theme.palette.divider,
              })}
            />
          }
        >
          {recentEvents.map((event) => {
            const style = getEventStyle(event.status);

            return (
              <Box
                key={event.id}
                sx={(theme) => ({
                  py: 2,
                  px: 1,
                  borderRadius: 3,
                  transition: ".3s",

                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,.04)"
                        : "rgba(0,0,0,.04)",
                    transform: "translateX(6px)",
                  },
                })}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: `${style.chipColor}20`,
                        border: `1px solid ${style.chipColor}55`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {style.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {event.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: 13,
                          mt: 0.5,
                        }}
                      >
                        {event.device}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    spacing={1}
                    alignItems="flex-end"
                  >
                    <Chip
                      label={style.chip}
                      size="small"
                      sx={{
                        bgcolor: `${style.chipColor}20`,
                        color: style.chipColor,
                        border: `1px solid ${style.chipColor}40`,
                        fontWeight: 700,
                        minWidth: 88,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {event.time}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>
        <Divider
          sx={(theme) => ({
            borderColor: theme.palette.divider,
            my: 3,
          })}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              Total Events Today
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {recentEvents.length}
            </Typography>
          </Box>

          <Chip
            label="Monitoring Active"
            sx={{
              bgcolor: "#16A34A",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecentEventsTable;