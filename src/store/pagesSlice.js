import { createSlice } from '@reduxjs/toolkit';
const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    pages: [],
    selectedPage: null,
    user: null,
    postsByPage: {},
    fbTokenValid: false,
      googleTokenValid: false,
    checking: true,
  },
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    clearPages: (state) => {
      state.pages = [];
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    clearSelectedPage: (state) => {
      state.selectedPage = null;
    },
    setPostsByPage: (state, action) => {
      const { pageName, posts } = action.payload;
      state.postsByPage[pageName] = posts;
    },
    clearPostsByPage: (state) => {
      state.postsByPage = {};
    },
    setUser: (state, action) => {   
      
      state.user = action.payload;
     
    },
    clearUser: (state) => {             
      state.user = {};
    },
     setFbToken: (state, action) => {
      state.fbTokenValid = action.payload;
    },
    setGoogleToken: (state, action) => { state.googleTokenValid = action.payload; },
    setChecking: (state, action) => {
      state.checking = action.payload;
    },
  }
});

export const {
  setPages,
  clearPages,
  setSelectedPage,
  clearSelectedPage,
  setPostsByPage,
  clearPostsByPage,
  setUser,         
  clearUser,      
  setGoogleToken,
  setFbToken,
  setChecking,
} = pagesSlice.actions;

export default pagesSlice.reducer;