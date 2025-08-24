import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUserInfo = localStorage.getItem("userInfo");
const initialUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

const initialState = {
    isAuthenticated: !!storedToken, 
    name: initialUserInfo?.name || '',
    id: initialUserInfo?.id || null,
    token: storedToken || null
};

export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers : {
        loginAction: (state, action) => {
            state.isAuthenticated = true;
            state.name = action.payload.name; 
            state.id = action.payload.id;
            state.token = action.payload.token;
        }, 

        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.name = '';
            state.id = null;
            state.token = null;
        }
    }
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;