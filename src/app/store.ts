import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authQuerySlice } from '../features/auth/authQuerySlice';
import uiReducer from '../features/ui/uiSlice';
import modalReducer from '../features/modal/modalSlice';
import { repairCatalogApi } from '../features/repairCatalog/repairCatalogApi';
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    modal: modalReducer,
    auth: authReducer,
    [authQuerySlice.reducerPath]: authQuerySlice.reducer,
    [repairCatalogApi.reducerPath]: repairCatalogApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authQuerySlice.middleware, repairCatalogApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
