import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendType,
  icon: Icon,
  color,
}) => {
  const isIncrease = trendType === "increase";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        },
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
        {/* Top Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              fontWeight: 600,
              letterSpacing: ".3px",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Icon && (
              <Icon
                sx={{
                  color: color,
                  fontSize: 28,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Value */}
        <Typography
          variant="h3"
          sx={{
            mt: 3,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {value}
        </Typography>

        {/* Bottom Row */}
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
            }}
          >
            {subtitle}
          </Typography>

          <Chip
            size="small"
            icon={
              isIncrease ? (
                <TrendingUpRoundedIcon />
              ) : (
                <TrendingDownRoundedIcon />
              )
            }
            label={trend}
            sx={{
              fontWeight: 700,
              backgroundColor: isIncrease
                ? "#DCFCE7"
                : "#FEE2E2",

              color: isIncrease
                ? "#15803D"
                : "#DC2626",

              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;