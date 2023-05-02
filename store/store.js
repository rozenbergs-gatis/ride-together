import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authStates/auth'
import loginReducer from './authStates/login'

export const store = configureStore({
    reducer: {
        validRegisterForm: authReducer,
        userAuth: loginReducer
    }
});