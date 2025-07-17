import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../services/categoryApi';
import { productApi } from '../services/productApi';
import { cartApi } from '../services/CartApi';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware),
});

export default store;