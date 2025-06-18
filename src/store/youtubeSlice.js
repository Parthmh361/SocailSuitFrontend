// src/redux/youtubeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: {
    accessToken: null,
    uploadedVideos: [],
  },
  reducers: {
    setGoogleAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUploadedVideos: (state, action) => {
      state.uploadedVideos = action.payload;
    }
  },
});

export const { setGoogleAccessToken, setUploadedVideos } = youtubeSlice.actions;
export default youtubeSlice.reducer;
