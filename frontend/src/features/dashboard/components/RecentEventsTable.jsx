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

import { recentEvents } from "../data/recentEventsData";

const getEventStyle = (status) => {
  switch (status) {
    case "success":
      return {
        icon: <CheckCircleRoundedIcon color="success" />,
        chip: "Success",
        chipColor: "success",
      };

    case "warning":
      return {
        icon: <WarningAmberRoundedIcon color="warning" />,
        chip: "Warning",
        chipColor: "warning",
      };

    case "error":
      return {
        icon: <ErrorRoundedIcon color="error" />,
        chip: "Critical",
        chipColor: "error",
      };

    default:
      return {
        icon: <InfoRoundedIcon color="info" />,
        chip: "Info",
        chipColor: "info",
      };
  }
};

const RecentEventsTable = () => {
  return (
    <Card
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Recent Events
        </Typography>

        <Stack divider={<Divider />} spacing={2}>
          {recentEvents.map((event) => {
            const style = getEventStyle(event.status);

            return (
              <Box
                key={event.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
              >
                <Box
                  display="flex"
                  gap={2}
                  alignItems="center"
                >
                  {style.icon}

                  <Box>
                    <Typography fontWeight={600}>
                      {event.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {event.device}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  textAlign="right"
                >
                  <Chip
                    size="small"
                    label={style.chip}
                    color={style.chipColor}
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {event.time}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecentEventsTable;