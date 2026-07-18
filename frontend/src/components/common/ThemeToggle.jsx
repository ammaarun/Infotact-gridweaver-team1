import { IconButton, Tooltip } from "@mui/material";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useThemeMode } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Tooltip
      title={
        mode === "light"
          ? "Switch to Dark Mode"
          : "Switch to Light Mode"
      }
    >
      <IconButton
        onClick={toggleMode}
        sx={{
          ml: 1,
          color: "text.primary",
          transition: "0.3s",

          "&:hover": {
            transform: "rotate(180deg)",
          },
        }}
      >
        {mode === "light" ? (
          <MdDarkMode size={22} />
        ) : (
          <MdLightMode size={22} />
        )}
      </IconButton>
    </Tooltip>
  );
}