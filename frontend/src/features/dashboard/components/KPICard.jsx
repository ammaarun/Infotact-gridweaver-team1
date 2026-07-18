import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

const iconMap = {
  bolt: BoltIcon,
  devices: DevicesIcon,
  speed: SpeedIcon,
  battery: BatteryChargingFullIcon,
  alert: WarningAmberIcon,
  eco: EnergySavingsLeafIcon,
};

const colorMap = {
  bolt: "#3B82F6",
  devices: "#8B5CF6",
  speed: "#06B6D4",
  battery: "#22C55E",
  alert: "#F59E0B",
  eco: "#10B981",
};

const KPICard = ({ item }) => {
  const Icon = iconMap[item.icon] || BoltIcon;

  const iconColor = colorMap[item.icon] || "#3B82F6";

  const positive = item.trendDirection === "up";

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        height: 190,
        p: 3,
        borderRadius: 5,
        color: theme.palette.text.primary,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg,#1E293B 0%,#0F172A 60%,#111827 100%)"
            : theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: ".35s",

        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: iconColor,
        },

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 18px 35px ${iconColor}30`,
          borderColor: `${iconColor}66`,
        },
      })}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: ".4px",
            }}
          >
            {item.label}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: 36,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {item.value}

            <Typography
              component="span"
              sx={{
                ml: 1,
                fontSize: 18,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {item.unit}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: 4,
            background: `${iconColor}20`,
            border: `1px solid ${iconColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 25px ${iconColor}25`,
          }}
        >
          <Icon
            sx={{
              color: iconColor,
              fontSize: 32,
            }}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          position: "absolute",
          right: -35,
          bottom: -35,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: `${iconColor}10`,
          filter: "blur(8px)",
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mt: 4,
        }}
      >
        <Chip
          size="small"
          icon={
            positive ? (
              <TrendingUpRoundedIcon />
            ) : (
              <TrendingDownRoundedIcon />
            )
          }
          label={`${item.trend}%`}
          sx={{
            fontWeight: 700,
            borderRadius: "10px",
            color: "#fff",
            bgcolor: positive
              ? "rgba(34,197,94,.18)"
              : "rgba(239,68,68,.18)",
            border: `1px solid ${
              positive
                ? "rgba(34,197,94,.35)"
                : "rgba(239,68,68,.35)"
            }`,
            "& .MuiChip-icon": {
              color: positive ? "#22C55E" : "#EF4444",
            },
          }}
        />

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          vs last week
        </Typography>
      </Stack>

      <Box
        sx={{
          mt: 2.5,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 6,
            borderRadius: 99,
            overflow: "hidden",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,.08)"
                : "rgba(0,0,0,.08)",
          }}
        >
          <Box
            sx={{
              width: positive ? "82%" : "45%",
              height: "100%",
              borderRadius: 99,
              background: `linear-gradient(90deg, ${iconColor}, #ffffff22)`,
            }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            mt: 1,
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            Performance
          </Typography>

          <Typography
            sx={{
              color: iconColor,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {positive ? "Improving" : "Needs Attention"}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default KPICard;