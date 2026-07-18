import { Paper, Box, Typography, Pagination } from '@mui/material';
import EventTimelineItem from './EventTimelineItem';

const EventTimeline = ({ events, totalCount, page, setPage, rowsPerPage }) => {
  const pageCount = Math.ceil(totalCount / rowsPerPage);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      {events.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No events match your search or filters.
          </Typography>
        </Box>
      ) : (
        <Box>
          {events.map((event, index) => (
            <EventTimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
          ))}
        </Box>
      )}

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Pagination count={pageCount} page={page + 1} onChange={(e, newPage) => setPage(newPage - 1)} color="primary" shape="rounded" />
        </Box>
      )}
    </Paper>
  );
};

export default EventTimeline;