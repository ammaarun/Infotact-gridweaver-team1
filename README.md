# GridWeaver - Virtual Thread IoT Microgrid State Engine Dashboard

GridWeaver is a dark premium Smart Grid Monitoring Platform used by electricity operators to monitor thousands of IoT devices.

## Technology Stack
- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS v4**
- **Framer Motion**
- **Leaflet & React Leaflet** (Map Interface)
- **Redux Toolkit** (Global state management)
- **React Query** (Ready for REST / Socket.io state synchronization)
- **React Hook Form & Zod** (Operational control limits forms)
- **Recharts** (Real-time charts)
- **Lucide Icons**

## Color Palette Reference
- **Background**: `#0B1220` (Dark Premium theme)
- **Card**: `#111827`
- **Surface**: `#1F2937`
- **Primary**: `#2563EB`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Text**: `#F8FAFC`
- **Muted**: `#94A3B8`
- **Accent**: `#38BDF8`

## Features & Route Pages Implemented
1. **Operations Dashboard**: General stats, power production, voltage curves, recent alarms, transition feed.
2. **Live Grid Map**: Leaflet dark-styled GIS layout with device status badges, popups, and flow layer indicators.
3. **Device Management**: Sortable, paginated data grid table to filter all 10,000 mock IoT devices.
4. **Device Details**: Granular information panel, temperature charts, state histories, and location tracking.
5. **Alerts Panel**: Active warnings list categorized by severity level (Critical, Warning, Info).
6. **State Machine Monitor**: Visual process node map showing autonomous thread pool state transitions in real time.
7. **Grid Zones**: Overview partitioned by 20 distinct city sectors, load distributions, and capacity.
8. **Operator Overrides Console**: Manual load shedding controls and safety interlock bypass keys.
9. **Reports Generator**: Form inputs to configure date ranges, target substations, and simulated format exports (PDF, XLSX, CSV).
10. **Control Settings**: Custom frequency refresh triggers, map style choices, and operator profile details.

## Running Locally
1. Run `npm install` to install all dependencies.
2. Run `npm run dev` to start the local Vite development server.
3. Navigate to the local port displayed in the console (e.g. `http://localhost:5173`).
