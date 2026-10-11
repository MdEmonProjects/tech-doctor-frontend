import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { logout } from '../features/auth/authSlice';
import authReducer from '../features/auth/authSlice';
import { authQuerySlice } from '../features/auth/authQuerySlice';
import uiReducer from '../features/ui/uiSlice';
import modalReducer from '../features/modal/modalSlice';
import { repairCatalogApi } from '../features/repairCatalog/repairCatalogApi';
import { accessApi } from '../features/access/accessApi';
const sessionListener = createListenerMiddleware();
sessionListener.startListening({ actionCreator: logout, effect: (_, { dispatch }) => {
  dispatch(authQuerySlice.util.resetApiState());
  dispatch(repairCatalogApi.util.resetApiState());
  dispatch(accessApi.util.resetApiState());
} });
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    modal: modalReducer,
    auth: authReducer,
    [authQuerySlice.reducerPath]: authQuerySlice.reducer,
    [repairCatalogApi.reducerPath]: repairCatalogApi.reducer,
    [accessApi.reducerPath]: accessApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(sessionListener.middleware).concat(authQuerySlice.middleware, repairCatalogApi.middleware, accessApi.middleware),
});
if (typeof window !== 'undefined') setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
