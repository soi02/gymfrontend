import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false, // true: 로그인 함, false: 로그인 안함
    name: '',
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
            state.name = action.payload.name; 
            state.id = action.payload.id; 
        }, 

    
        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.name = '';
            state.id = null;
        }
    }
});

export const {loginAction, logoutAction} = authSlice.actions;
export default authSlice.reducer;