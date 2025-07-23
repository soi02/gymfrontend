import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false, // true: 로그인 함, false: 로그인 안함
    nickname: '',
    id: null
}

// authSlice : 슬라이스명
// createSlice : redux api
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        loginAction: (state, action) => {
            state.isAuthenticated = true;
            state.nickname = action.payload.nickname; 
            state.id = action.payload.id; 
        }, 

    
        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.nickname = '';
            state.id = null;
        }
    }
});

export const {loginAction, logoutAction} = authSlice.actions;
export default authSlice.reducer;