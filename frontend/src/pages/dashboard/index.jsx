import React from "react";
import { Box, Grid, Stack } from "@mui/material";

import HeroSection from "../../features/dashboard/components/HeroSection";
import KPIGrid from "../../features/dashboard/components/KPIGrid";
import PowerChart from "../../features/dashboard/components/PowerChart";
import BatteryChart from "../../features/dashboard/components/BatteryChart";
import RecentEventsTable from "../../features/dashboard/components/RecentEventsTable";

import useDashboard from "../../features/dashboard/hooks/useDashboard";

const DashboardPage = () => {
  const { systemHealth, kpis } = useDashboard();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        p: 4,
      })}
    >
      <Stack spacing={4}>
        {/* Hero */}
        <HeroSection systemHealth={systemHealth} />

        {/* KPI */}
        <KPIGrid kpis={kpis} />

        {/* Power Chart */}
        <Box>
          <PowerChart />
        </Box>

        {/* Bottom Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={4}>
            <BatteryChart />
          </Grid>

          <Grid item xs={12} lg={8}>
            <RecentEventsTable />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default DashboardPage;