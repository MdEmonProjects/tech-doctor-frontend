import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 420;
export const SIDEBAR_DEFAULT_WIDTH = 260;

interface UiState {
  mobileSidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  isResizingSidebar: boolean;
}

const storage = typeof window !== 'undefined' ? window.localStorage : null;
const persistedWidth = Number(storage?.getItem('sidebar_width'));

const initialState: UiState = {
  mobileSidebarOpen: false,
  sidebarCollapsed: false,
  sidebarWidth:
    persistedWidth >= SIDEBAR_MIN_WIDTH && persistedWidth <= SIDEBAR_MAX_WIDTH
      ? persistedWidth
      : SIDEBAR_DEFAULT_WIDTH,
  isResizingSidebar: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileSidebar: (state) => {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      const clamped = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, action.payload));
      state.sidebarWidth = clamped;
      storage?.setItem('sidebar_width', String(clamped));
    },
    resetSidebarWidth: (state) => {
      state.sidebarWidth = SIDEBAR_DEFAULT_WIDTH;
      storage?.setItem('sidebar_width', String(SIDEBAR_DEFAULT_WIDTH));
    },
    setResizingSidebar: (state, action: PayloadAction<boolean>) => {
      state.isResizingSidebar = action.payload;
    },
  },
});

export const {
  openMobileSidebar,
  closeMobileSidebar,
  toggleSidebarCollapsed,
  setSidebarWidth,
  resetSidebarWidth,
  setResizingSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;
