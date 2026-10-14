import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { logout } from '../features/auth/authSlice';
import authReducer from '../features/auth/authSlice';
import { authQuerySlice } from '../features/auth/authQuerySlice';
import uiReducer from '../features/ui/uiSlice';
import modalReducer from '../features/modal/modalSlice';
import { repairCatalogApi } from '../features/repairCatalog/repairCatalogApi';
import { accessApi } from '../features/access/accessApi';
import { branchesApi } from '../features/branches/branchesApi';
import { repairsApi } from '../features/repairs/repairsApi';
import { productCategoriesApi } from '../features/productCategories/productCategoriesApi';
import { productsApi } from '../features/products/productsApi';
const sessionListener = createListenerMiddleware();
sessionListener.startListening({ matcher: isAnyOf(productCategoriesApi.endpoints.createProductCategory.matchFulfilled, productCategoriesApi.endpoints.updateProductCategory.matchFulfilled, productCategoriesApi.endpoints.deleteProductCategory.matchFulfilled), effect: (_, { dispatch }) => {
  dispatch(productsApi.util.invalidateTags(['Products', 'ProductTemplates']));
} });
sessionListener.startListening({ actionCreator: logout, effect: (_, { dispatch }) => {
  dispatch(authQuerySlice.util.resetApiState());
  dispatch(repairCatalogApi.util.resetApiState());
  dispatch(accessApi.util.resetApiState());
  dispatch(branchesApi.util.resetApiState());
  dispatch(repairsApi.util.resetApiState());
  dispatch(productCategoriesApi.util.resetApiState());
  dispatch(productsApi.util.resetApiState());
} });
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    modal: modalReducer,
    auth: authReducer,
    [authQuerySlice.reducerPath]: authQuerySlice.reducer,
    [repairCatalogApi.reducerPath]: repairCatalogApi.reducer,
    [accessApi.reducerPath]: accessApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
    [repairsApi.reducerPath]: repairsApi.reducer,
    [productCategoriesApi.reducerPath]: productCategoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(sessionListener.middleware).concat(authQuerySlice.middleware, repairCatalogApi.middleware, accessApi.middleware, branchesApi.middleware, repairsApi.middleware, productCategoriesApi.middleware, productsApi.middleware),
});
if (typeof window !== 'undefined') setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
