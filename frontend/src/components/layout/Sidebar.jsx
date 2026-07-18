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
            fontWeight: 800,
            fontSize: "1.35rem",
            color: "primary.main",
            letterSpacing: "-0.5px",
          }}
        >
          GridWeaver
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ p: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem
              key={item.path}
              disablePadding
              sx={{ mb: 0.8 }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  transition: "all .25s ease",

                  "& .MuiListItemIcon-root": {
                    color: active
                      ? "primary.main"
                      : "text.secondary",
                    minWidth: 42,
                    transition: ".25s",
                  },

                  "& .MuiListItemText-primary": {
                    color: active
                      ? "primary.main"
                      : "text.primary",
                  },

                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",

                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },

                    "& .MuiListItemText-primary": {
                      color: "primary.contrastText",
                      fontWeight: 700,
                    },
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "primary.dark",
                  },

                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
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
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: 1,
            borderColor: "divider",
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
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}

export default Sidebar;