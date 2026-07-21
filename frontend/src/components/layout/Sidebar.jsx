import { Link, useLocation } from "react-router-dom";

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DevicesOtherRoundedIcon from "@mui/icons-material/DevicesOtherRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  {
    text: "Dashboard",
    path: "/",
    icon: <DashboardRoundedIcon />,
  },
  {
    text: "Devices",
    path: "/devices",
    icon: <DevicesOtherRoundedIcon />,
  },
  {
    text: "Analytics",
    path: "/analytics",
    icon: <AnalyticsRoundedIcon />,
  },
  {
    text: "Events",
    path: "/events",
    icon: <EventNoteRoundedIcon />,
  },
  {
    text: "Settings",
    path: "/settings",
    icon: <SettingsRoundedIcon />,
  },
];

function SidebarContent() {
  const location = useLocation();

  return (
    <>
      <Toolbar>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#111827",
          }}
        >
          GridWeaver
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ p: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: 2,

                  "&.Mui-selected": {
                    backgroundColor: "rgba(37,99,235,0.12)",
                    color: "#2563EB",
                  },

                  "&.Mui-selected .MuiListItemIcon-root": {
                    color: "#2563EB",
                  },

                  "&:hover": {
                    backgroundColor: "rgba(37,99,235,0.06)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

function Sidebar({ mobileOpen, onClose }) {
  return (
    <Box
      component="nav"
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #E5E7EB",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}

export default Sidebar;