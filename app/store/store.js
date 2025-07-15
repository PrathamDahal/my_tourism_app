import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../services/categoryApi';
import { productApi } from '../services/productApi';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(productApi.middleware),

});

export default store;