import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const DashboardHeader = () => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
        >
          Welcome back, Admin 👋
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
        >
          {currentDate}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<RefreshRoundedIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Refresh
        </Button>
      </Stack>
    </Box>
  );
};

export default DashboardHeader;