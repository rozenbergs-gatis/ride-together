import { createSlice } from '@reduxjs/toolkit';

const userTutorialsSlice = createSlice({
    name: 'userTutorials',
    initialState: {
        userTrickTutorials: [],
        userBuildTutorials: [],
        displayTutorials: [],
        refreshData: false
    },
    reducers: {
        setDisplayData: (state, action) => {
            state.displayTutorials = action.payload.displayTutorials;
        },
        setRefreshData: (state, action) => {
            state.refreshData = action.payload.refreshData;
        },
        setUserTrickTutorials: (state, action) => {
            state.refreshData = action.payload.refreshData;
        },
        setUserBuildTutorials: (state, action) => {
            state.refreshData = action.payload.refreshData;
        }
    }
});

export const { setDisplayData, setRefreshData, setUserTrickTutorials, setUserBuildTutorials } = userTutorialsSlice.actions
export default userTutorialsSlice.reducer;