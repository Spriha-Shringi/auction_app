// File: userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://auction-app-zm73.onrender.com/api/v1";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutFailed(state) {
      state.loading = false;
    },
    fetchLeaderboardRequest(state) {
      state.loading = true;
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state) {
      state.loading = false;
    },
  },
});

// Helper: Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Actions

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(`${API_URL}/user/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response?.data?.message || "Registration failed.");
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(`${API_URL}/user/login`, data, {
      headers: { "Content-Type": "application/json" },
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response?.data?.message || "Login failed.");
  }
};

export const logout = () => async (dispatch) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/user/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response?.data?.message || "Logout failed.");
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    toast.error(error.response?.data?.message || "Failed to fetch user.");
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/user/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard));
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    toast.error(error.response?.data?.message || "Failed to fetch leaderboard.");
  }
};

// Export reducer
export default userSlice.reducer;
