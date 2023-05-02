import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        token: '',
        isAuthenticated: false,
    },
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            AsyncStorage.setItem('token', action.payload.token);
        },
        removeAuthToken: (state, _action) => {
            state.token = '';
            state.isAuthenticated = false;
            AsyncStorage.removeItem('token');
        },
    }
});

export const { setAuthToken, removeAuthToken } = loginSlice.actions
export default loginSlice.reducer;