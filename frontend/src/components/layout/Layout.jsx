import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";

import Navbar, { NAVBAR_HEIGHT } from "./Navbar";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
      }}
    >
      <Navbar onMenuClick={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          minWidth: 0,
          backgroundColor: "#F5F7FA",
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${NAVBAR_HEIGHT}px !important`,
          }}
        />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            maxWidth: "1600px",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;