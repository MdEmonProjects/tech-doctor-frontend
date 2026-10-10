import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authQuerySlice } from '../features/auth/authQuerySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authQuerySlice.reducerPath]: authQuerySlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authQuerySlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
