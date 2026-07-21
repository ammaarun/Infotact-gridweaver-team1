import { Box, Grid } from "@mui/material";

import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import StatCards from "../../features/dashboard/components/StatCards";
import PowerChart from "../../features/dashboard/components/PowerChart";
import BatteryChart from "../../features/dashboard/components/BatteryChart";
import RecentEventsTable from "../../features/dashboard/components/RecentEventsTable";

const Dashboard = () => {
  return (
    <Box>
      <DashboardHeader />

      <StatCards />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PowerChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <BatteryChart />
        </Grid>

        <Grid size={12}>
          <RecentEventsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;