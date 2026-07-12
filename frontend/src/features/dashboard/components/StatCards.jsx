import Grid from "@mui/material/Grid";

import StatCard from "./StatCard";
import { dashboardStats } from "../data/dashboardData";

const StatCards = () => {
  return (
    <Grid
      container
      spacing={2.5}
      sx={{
        mb: 4,
      }}
    >
      {dashboardStats.map((item) => (
        <Grid
          key={item.id}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            trend={item.trend}
            trendType={item.trendType}
            icon={item.icon}
            color={item.color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;