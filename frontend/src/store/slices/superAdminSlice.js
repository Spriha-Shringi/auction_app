import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";

const getToken = () => localStorage.getItem("token"); // Fetch token dynamically

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
    // Other reducers remain unchanged...
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
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(superAdminSlice.actions.successForMonthlyRevenue(response.data.totalMonthlyRevenue));
  } catch (error) {
    dispatch(superAdminSlice.actions.failedForMonthlyRevenue());
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(superAdminSlice.actions.successForUpdatePaymentProof());
    toast.success(response.data.message);
    dispatch(getAllPaymentProofs());
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForUpdatePaymentProof());
    toast.error(error.response?.data?.message || "Failed to update payment proof.");
  }
};

// Other actions like getAllUsers, getAllPaymentProofs, and deletePaymentProof should follow the same structure.

export default superAdminSlice.reducer;
