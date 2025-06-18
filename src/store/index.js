import { configureStore } from '@reduxjs/toolkit';
import pagesReducer from './pagesSlice';
import authReducer from './authSlice';
import googleReducer from './googleSlice';
export const store = configureStore({
  reducer: {
    pages: pagesReducer,
     auth: authReducer,
    google: googleReducer,
  },
});
