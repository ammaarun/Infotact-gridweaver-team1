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
      sx={(theme) => ({
        height: "100%",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 16px 32px rgba(0,0,0,.35)"
              : "0 16px 32px rgba(15,23,42,.08)",
        },
      })}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
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
                  color,
                  fontSize: 28,
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{
            mt: 3,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {value}
        </Typography>

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
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