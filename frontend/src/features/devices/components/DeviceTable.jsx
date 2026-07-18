import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import DeviceStatusChip from '../../../components/tables/DeviceStatusChip';
import { formatLastSeen, formatPower } from '../utils/deviceUtils';

const columns = [
  { id: 'id', label: 'Device ID', sortable: true },
  { id: 'name', label: 'Device Name', sortable: true },
  { id: 'type', label: 'Type', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'powerOutput', label: 'Power Output', sortable: true },
  { id: 'lastSeen', label: 'Last Seen', sortable: true },
];

const DeviceTable = ({
  devices,
  totalCount,
  sortBy,
  sortDirection,
  onSort,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  onRowClick,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: '16px', border: 1, borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}
    >
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 720 }} aria-label="Devices table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No devices match your search or filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              devices.map((device) => (
                <TableRow
                  key={device.id}
                  hover
                  onClick={() => onRowClick(device)}
                  tabIndex={0}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {device.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{device.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{device.type}</TableCell>
                  <TableCell>
                    <DeviceStatusChip status={device.status} />
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{formatPower(device.powerOutput)}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatLastSeen(device.lastSeen)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[8, 16, 24]}
        />
      </Box>
    </Paper>
  );
};

export default DeviceTable;