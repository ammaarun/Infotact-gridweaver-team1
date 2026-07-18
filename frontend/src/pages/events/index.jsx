import { Box, Typography } from '@mui/material';
import useEvents from '../../features/events/hooks/useEvents';
import EventFilterBar from '../../features/events/components/EventFilterBar';
import EventTimeline from '../../features/events/components/EventTimeline';

const EventsPage = () => {
  const { events, totalCount, searchTerm, onSearchChange, filters, onFilterChange, page, setPage, rowsPerPage, clearFilters } = useEvents();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Events
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          System, device, and security event log
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <EventFilterBar searchTerm={searchTerm} onSearchChange={onSearchChange} filters={filters} onFilterChange={onFilterChange} onClear={clearFilters} />
      </Box>

      <EventTimeline events={events} totalCount={totalCount} page={page} setPage={setPage} rowsPerPage={rowsPerPage} />
    </Box>
  );
};

export default EventsPage;