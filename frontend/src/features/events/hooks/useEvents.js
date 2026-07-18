import { useState, useMemo } from 'react';
import { eventsData } from '../data/eventsData';
import { searchEvents, filterEvents, sortEventsByRecency, paginateEvents } from '../utils/eventUtils';

const useEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ severity: 'all', category: 'all' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const processedEvents = useMemo(() => {
    let result = sortEventsByRecency(eventsData);
    result = searchEvents(result, searchTerm);
    result = filterEvents(result, filters);
    return result;
  }, [searchTerm, filters]);

  const paginatedEvents = useMemo(
    () => paginateEvents(processedEvents, page, rowsPerPage),
    [processedEvents, page, rowsPerPage]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ severity: 'all', category: 'all' });
    setSearchTerm('');
    setPage(0);
  };

  return {
    events: paginatedEvents,
    totalCount: processedEvents.length,
    searchTerm,
    onSearchChange: handleSearchChange,
    filters,
    onFilterChange: handleFilterChange,
    page,
    setPage,
    rowsPerPage,
    clearFilters,
  };
};

export default useEvents;