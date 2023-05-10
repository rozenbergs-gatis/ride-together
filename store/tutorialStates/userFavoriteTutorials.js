import { createSlice } from '@reduxjs/toolkit';

const userFavoriteTutorialsSlice = createSlice({
  name: 'userFavoriteTutorials',
  initialState: {
    favoriteIds: [],
    tutorialsInProgress: [],
    tutorialsLearned: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.favoriteIds = [...state.favoriteIds.slice(), action.payload.id];
    },
    setFavorite: (state, action) => {
      state.favoriteIds = action.payload.ids;
    },
    removeFavorite: (state, action) => {
      state.favoriteIds = state.favoriteIds.filter((tutorial) => tutorial.id !== action.payload.id);
    },
    addTutorialsInProgress: (state, action) => {
      state.tutorialsInProgress = [...state.tutorialsInProgress.slice(), action.payload.id];
    },
    setTutorialsInProgress: (state, action) => {
      state.tutorialsInProgress = action.payload.ids;
    },
    removeTutorialsInProgress: (state, action) => {
      state.tutorialsInProgress = state.tutorialsInProgress.filter(
        (tutorial) => tutorial.id !== action.payload.id
      );
    },
    addTutorialsLearned: (state, action) => {
      state.tutorialsLearned = [...state.tutorialsLearned.slice(), action.payload.id];
    },
    setTutorialsLearned: (state, action) => {
      state.tutorialsLearned = action.payload.ids;
    },
  },
});

export const {
  addFavorite,
  setFavorite,
  removeFavorite,
  addTutorialsInProgress,
  setTutorialsInProgress,
  removeTutorialsInProgress,
  addTutorialsLearned,
  setTutorialsLearned,
} = userFavoriteTutorialsSlice.actions;
export default userFavoriteTutorialsSlice.reducer;
