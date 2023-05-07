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
        setTutorialDisplayData: (state, action) => {
            state.displayTutorials = action.payload.displayTutorials;
        },
        setRefreshData: (state, action) => {
            state.refreshData = action.payload.refreshData;
        },
        setUserTrickTutorials: (state, action) => {
            state.userTrickTutorials = action.payload.userTrickTutorials;
        },
        setUserBuildTutorials: (state, action) => {
            state.userBuildTutorials = action.payload.userBuildTutorials;
        }
    }
});

export const { setTutorialDisplayData, setRefreshData, setUserTrickTutorials, setUserBuildTutorials } = userTutorialsSlice.actions
export default userTutorialsSlice.reducer;