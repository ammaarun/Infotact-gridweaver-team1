import { Box, Typography, Stack, Paper } from '@mui/material';
import useDevices from '../../features/devices/hooks/useDevices';
import DeviceSearchBar from '../../features/devices/components/DeviceSearchBar';
import DeviceFilterPanel from '../../features/devices/components/DeviceFilterPanel';
import DeviceTable from '../../features/devices/components/DeviceTable';
import DeviceDetailsDrawer from '../../features/devices/components/DeviceDetailsDrawer';

const DevicesPage = () => {
  const {
    devices, totalCount, searchTerm, onSearchChange, filters, onFilterChange,
    sortBy, sortDirection, onSort, page, setPage, rowsPerPage, setRowsPerPage,
    clearFilters, selectedDevice, setSelectedDevice,
  } = useDevices();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Devices
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Monitor and manage all connected microgrid devices
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Stack spacing={2}>
          <Box sx={{ maxWidth: { sm: 420 } }}>
            <DeviceSearchBar value={searchTerm} onChange={onSearchChange} />
          </Box>
          <DeviceFilterPanel filters={filters} onFilterChange={onFilterChange} onClear={clearFilters} />
        </Stack>
      </Paper>

      <DeviceTable
        devices={devices}
        totalCount={totalCount}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        onRowClick={setSelectedDevice}
      />

      <DeviceDetailsDrawer device={selectedDevice} open={Boolean(selectedDevice)} onClose={() => setSelectedDevice(null)} />
    </Box>
  );
};

export default DevicesPage;