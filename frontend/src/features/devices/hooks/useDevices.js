import { useState, useMemo } from 'react';
import { devicesData } from '../data/devicesData';
import { searchDevices, filterDevices, sortDevices, paginateDevices } from '../utils/deviceUtils';

const useDevices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const processedDevices = useMemo(() => {
    let result = devicesData;
    result = searchDevices(result, searchTerm);
    result = filterDevices(result, filters);
    result = sortDevices(result, sortBy, sortDirection);
    return result;
  }, [searchTerm, filters, sortBy, sortDirection]);

  const paginatedDevices = useMemo(
    () => paginateDevices(processedDevices, page, rowsPerPage),
    [processedDevices, page, rowsPerPage]
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ status: 'all', type: 'all' });
    setSearchTerm('');
    setPage(0);
  };

  return {
    devices: paginatedDevices,
    totalCount: processedDevices.length,
    searchTerm,
    onSearchChange: handleSearchChange,
    filters,
    onFilterChange: handleFilterChange,
    sortBy,
    sortDirection,
    onSort: handleSort,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    clearFilters,
    selectedDevice,
    setSelectedDevice,
  };
};

export default useDevices;