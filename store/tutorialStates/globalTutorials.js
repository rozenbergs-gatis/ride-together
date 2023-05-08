import { createSlice } from '@reduxjs/toolkit';

const globalTutorialsSlice = createSlice({
  name: 'globalTutorials',
  initialState: {
    trickTutorials: [],
    buildTutorials: [],
    displayTutorials: [],
    refreshData: false,
  },
  reducers: {
    setTutorialDisplayData: (state, action) => {
      state.displayTutorials = action.payload.displayTutorials;
    },
    setRefreshData: (state, action) => {
      state.refreshData = action.payload.refreshData;
    },
    setTrickTutorials: (state, action) => {
      state.trickTutorials = action.payload.trickTutorials;
    },
    setBuildTutorials: (state, action) => {
      state.buildTutorials = action.payload.buildTutorials;
    },
  },
});

export const { setTutorialDisplayData, setRefreshData, setTrickTutorials, setBuildTutorials } =
  globalTutorialsSlice.actions;
export default globalTutorialsSlice.reducer;
