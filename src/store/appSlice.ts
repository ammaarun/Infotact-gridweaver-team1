import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  currentPage: string;
  searchQuery: string;
  refreshInterval: number;
  theme: 'dark' | 'light';
  notifications: boolean;
  mapLayer: 'default' | 'heatmap' | 'powerflow';
}

const initialState: AppState = {
  sidebarCollapsed: false,
  sidebarOpen: true,
  currentPage: 'dashboard',
  searchQuery: '',
  refreshInterval: 5,
  theme: 'dark',
  notifications: true,
  mapLayer: 'default',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setMapLayer: (state, action: PayloadAction<'default' | 'heatmap' | 'powerflow'>) => {
      state.mapLayer = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentPage,
  setSearchQuery,
  setRefreshInterval,
  setTheme,
  setMapLayer,
} = appSlice.actions;

export default appSlice.reducer;
