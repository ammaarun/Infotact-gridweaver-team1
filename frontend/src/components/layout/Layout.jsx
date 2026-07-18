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
      sx={(theme) => ({
        display: "flex",
        minHeight: "100vh",

        // Theme Background
        bgcolor: "background.default",

        // Dynamic Enterprise Background
        backgroundImage:
          theme.palette.mode === "dark"
            ? `
              radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 35%),
              radial-gradient(circle at bottom left, rgba(139,92,246,0.08), transparent 35%),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `
            : `
              radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent 35%),
              radial-gradient(circle at bottom left, rgba(99,102,241,0.05), transparent 35%),
              linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)
            `,

        backgroundSize:
          theme.palette.mode === "dark"
            ? "100% 100%,100% 100%,40px 40px,40px 40px"
            : "100% 100%,100% 100%,40px 40px,40px 40px",

        transition: "all .3s ease",
      })}
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