import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Avatar,
  Tooltip,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import { DRAWER_WIDTH } from "./Sidebar";
import ThemeToggle from "../common/ThemeToggle";

export const NAVBAR_HEIGHT = 64;

function Navbar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: {
          md: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        ml: {
          md: `${DRAWER_WIDTH}px`,
        },

        // Theme Colors
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",

        transition: "all .3s ease",
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          px: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "inline-flex",
              md: "none",
            },
            mr: 2,
            color: "text.primary",
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications">
          <IconButton sx={{ color: "text.primary" }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <ThemeToggle />

        <Avatar
          sx={{
            ml: 2,
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,
          }}
        >
          H
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;