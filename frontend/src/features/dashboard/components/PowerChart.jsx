import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

import { powerChartData } from "../data/powerChartData";

const PowerChart = () => {
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BoltRoundedIcon
              sx={{
                color: "#2563EB",
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Power Overview
            </Typography>
          </Box>

          <FormControl size="small">
            <Select
              value="week"
              sx={{
                borderRadius: 2,
                minWidth: 130,
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ResponsiveContainer
          width="100%"
          height={330}
        >
          <BarChart
            data={powerChartData}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="production"
              name="Production"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="consumption"
              name="Consumption"
              fill="#22C55E"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PowerChart;