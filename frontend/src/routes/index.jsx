import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard";
import Devices from "../pages/devices";
import Analytics from "../pages/analytics";
import Events from "../pages/events";
import Settings from "../pages/settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;