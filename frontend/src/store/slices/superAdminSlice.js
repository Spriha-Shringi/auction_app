import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const getToken = () => localStorage.getItem("token");

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    loading: false,
    monthlyRevenue: [],
    totalAuctioneers: [],
    totalBidders: [],
    paymentProofs: [],
    singlePaymentProof: {},
  },
  reducers: {
    requestForMonthlyRevenue(state) {
      state.loading = true;
    },
    successForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = action.payload;
    },
    failedForMonthlyRevenue(state) {
      state.loading = false;
    },
    requestForAllUsers(state) {
      state.loading = true;
    },
    successForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = action.payload.auctioneersArray;
      state.totalBidders = action.payload.biddersArray;
    },
    failureForAllUsers(state) {
      state.loading = false;
    },
    requestForPaymentProofs(state) {
      state.loading = true;
    },
    successForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = action.payload;
    },
    failureForPaymentProofs(state) {
      state.loading = false;
    },
    requestForUpdatePaymentProof(state) {
      state.loading = true;
    },
    successForUpdatePaymentProof(state) {
      state.loading = false;
    },
    failureForUpdatePaymentProof(state) {
      state.loading = false;
    },
  },
});

export const getMonthlyRevenue = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForMonthlyRevenue());
  try {
    const token = getToken();
    const response = await axios.get(
      "https://auction-app-sprihashringis-projects.vercel.app/api/v1/superadmin/monthlyincome",
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(superAdminSlice.actions.successForMonthlyRevenue(response.data.totalMonthlyRevenue));
  } catch (error) {
    dispatch(superAdminSlice.actions.failedForMonthlyRevenue());
    console.error("Error in getMonthlyRevenue:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to fetch monthly revenue.");
  }
};

export const updatePaymentProof = (id, status, amount) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdatePaymentProof());
  try {
    const token = getToken();
    const response = await axios.put(
      `https://auction-app-sprihashringis-projects.vercel.app/api/v1/superadmin/paymentproof/status/update/${id}`,
      { status, amount },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(superAdminSlice.actions.successForUpdatePaymentProof());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForUpdatePaymentProof());
    console.error("Error in updatePaymentProof:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to update payment proof.");
  }
};

export default superAdminSlice.reducer;
