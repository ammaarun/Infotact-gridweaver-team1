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
        backgroundColor: "#FFFFFF",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
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
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications">
          <IconButton>
            <Badge color="error" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Avatar
          sx={{
            ml: 2,
            width: 36,
            height: 36,
            bgcolor: "#2563EB",
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