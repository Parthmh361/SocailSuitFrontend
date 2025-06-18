// src/redux/googleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const googleSlice = createSlice({
  name: 'google',
  initialState: {
    accessToken: null,
  },
  reducers: {
    setGoogleToken: (state, action) => {
      state.accessToken = action.payload;
      
    },
    clearGoogleToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setGoogleToken, clearGoogleToken } = googleSlice.actions;
export default googleSlice.reducer;
