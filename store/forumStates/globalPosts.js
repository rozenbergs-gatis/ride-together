import { createSlice } from '@reduxjs/toolkit';

const globalPostsSlice = createSlice({
  name: 'globalPosts',
  initialState: {
    discussionPosts: [],
    marketPosts: [],
    displayPosts: [],
    refreshData: false,
  },
  reducers: {
    setRefreshData: (state, action) => {
      state.refreshData = action.payload.refreshData;
    },
    setDiscussionPosts: (state, action) => {
      state.discussionPosts = action.payload.discussionPosts;
    },
    setMarketPosts: (state, action) => {
      state.marketPosts = action.payload.marketPosts;
    },
    setDisplayPosts: (state, action) => {
      state.displayPosts = action.payload.displayPosts;
    },
  },
});

export const { setRefreshData, setDiscussionPosts, setMarketPosts, setDisplayPosts } =
  globalPostsSlice.actions;
export default globalPostsSlice.reducer;
