import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        validEmail: true,
        validPassword: true,
    },
    reducers: {
        setEmail: (state, action) => {
            // state.ids.push(action.payload.id);
            state.validEmail = action.payload.email;
        },
        setPassword: (state, action) => {
            // state.ids.splice(state.ids.indexOf(action.payload.id), 1);
            state.validPassword = action.payload.password;
        },
        resetState: (state, action) => {
            state.validEmail = true
            state.validPassword = true
        }
    }
});

export const { setEmail, setPassword, resetState } = authSlice.actions
export default authSlice.reducer;