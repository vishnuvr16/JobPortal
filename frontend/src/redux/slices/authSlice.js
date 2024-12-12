import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"

// ! initial state
const initialState ={
    user: null,
    token: Cookies.get("token") || null,
    isAuthenticated: !Cookies.get('token'),
    loading: false,
    error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  // ? reducers
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      Cookies.set("token",action.payload.token,{expires: 7})
    },
    // *logout
    logoutAction: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove("token")
    },
  },
});

// ! Generate actions
export const { loginAction, logoutAction } = authSlice.actions;

// ! Generate the reducer
const authReducer = authSlice.reducer;
export default authReducer;