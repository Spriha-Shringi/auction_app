import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";

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
    // Other reducers omitted for brevity...
  },
});

export const updatePaymentProof = (id, status, amount) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdatePaymentProof());
  try {
    const token = localStorage.getItem("token"); // Fetch token dynamically
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
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForUpdatePaymentProof());
    toast.error(error.response?.data?.message || "Failed to update payment proof.");
  }
};

// Similarly update other actions like getMonthlyRevenue, deletePaymentProof, etc.

export default superAdminSlice.reducer;
