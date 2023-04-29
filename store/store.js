import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authStates/auth'

export const store = configureStore({
    reducer: {
        validRegisterForm: authReducer
    }
});