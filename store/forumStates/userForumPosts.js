import { createSlice } from '@reduxjs/toolkit';

const userForumPostsSlice = createSlice({
  name: 'userForumPosts',
  initialState: {
    userDiscussionsPosts: [],
    userMarketPosts: [],
    displayPosts: [],
    refreshPostData: false,
  },
  reducers: {
    setPostsDisplayData: (state, action) => {
      state.displayPosts = action.payload.displayPosts;
    },
    setRefreshPostData: (state, action) => {
      state.refreshPostData = action.payload.refreshPostData;
    },
    setUserDiscussionsPosts: (state, action) => {
      state.userDiscussionsPosts = action.payload.userDiscussionsPosts;
    },
    setUserMarketPosts: (state, action) => {
      state.userMarketPosts = action.payload.userMarketPosts;
    },
  },
});

export const {
  setPostsDisplayData,
  setRefreshPostData,
  setUserDiscussionsPosts,
  setUserMarketPosts,
} = userForumPostsSlice.actions;
export default userForumPostsSlice.reducer;
