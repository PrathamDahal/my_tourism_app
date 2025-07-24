import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../services/categoryApi';
import { productApi } from '../services/productApi';
import { cartApi } from '../services/cartApi';
import { authApiSlice } from './../services/auth/authApiSlice';
import { registerApiSlice } from '../services/registerApi';
import { userApi } from '../services/userApi';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [registerApiSlice.reducerPath]: registerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(userApi.middleware)
      .concat(authApiSlice.middleware)
      .concat(registerApiSlice.middleware),
});

export default store;