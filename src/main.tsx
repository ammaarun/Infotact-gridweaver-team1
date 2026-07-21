import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import GridMap from './pages/GridMap';
import Devices from './pages/Devices';
import DeviceDetails from './pages/DeviceDetails';
import Alerts from './pages/Alerts';
import Events from './pages/Events';
import Analytics from './pages/Analytics';
import StateMachine from './pages/StateMachine';
import Zones from './pages/Zones';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import OperatorConsole from './pages/Console';
import Login from './pages/Login';
import RequireAuth from './components/auth/RequireAuth';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/map" element={<GridMap />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/devices/:deviceId" element={<DeviceDetails />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/state-machine" element={<StateMachine />} />
                  <Route path="/zones" element={<Zones />} />
                  <Route path="/console" element={<OperatorConsole />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
