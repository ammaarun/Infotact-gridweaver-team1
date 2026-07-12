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
        backgroundColor: "#F8FAFC",

        // Professional Grid Background
        backgroundImage: `
          linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Navbar */}
      <Navbar onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          minWidth: 0,
          position: "relative",
          zIndex: 1,
          backgroundColor: "transparent",
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
              md: 4,
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