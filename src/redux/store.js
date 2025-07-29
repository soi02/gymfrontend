import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // 이름 authReducer로 바꾼것 확인
import testReducer from './challengeTestSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        test: testReducer     
    }
}); 