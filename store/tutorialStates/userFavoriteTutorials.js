import { createSlice } from '@reduxjs/toolkit';

const userFavoriteTutorialsSlice = createSlice({
  name: 'userFavoriteTutorials',
  initialState: {
    ids: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.ids.push(action.payload.id);
    },
    removeFavorite: (state, action) => {
      state.ids.splice(state.ids.indexOf(action.payload.id), 1);
    },
  },
});

export const { addFavorite, removeFavorite } = userFavoriteTutorialsSlice.actions;
export default userFavoriteTutorialsSlice.reducer;
