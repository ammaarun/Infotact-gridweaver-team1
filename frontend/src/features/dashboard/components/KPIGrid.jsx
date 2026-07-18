import React from "react";
import { Grid, Box } from "@mui/material";
import KPICard from "./KPICard";

const KPIGrid = ({ kpis = [] }) => {
  return (
    <Box
        sx={{
         mt: 2,
        mb: 2,
     }}
    >
      <Grid container spacing={2}>
        {kpis.map((item) => (
          <Grid
            item
            key={item.id}
            xs={12}
            sm={6}
            md={6}
            lg={4}
            xl={2}
          >
            <KPICard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGrid;