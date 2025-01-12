import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";

// Create the slice
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

// Helper function to fetch token dynamically
const getToken = () => localStorage.getItem("token");

// Actions

export const getMonthlyRevenue = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForMonthlyRevenue());
  const token = getToken(); // Dynamically fetch token
  try {
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
  const token = getToken(); // Dynamically fetch token
  try {
    const response = await axios.put(
      `https://auction-app-sprihashringis-projects.vercel.app/api/v1/superadmin/paymentproof/status/update/${id}`,
      { status, amount },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to headers
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

// Similarly, update other functions to include the Authorization header

export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForAuctionItemDelete());
  const token = getToken(); // Dynamically fetch token
  try {
    const response = await axios.delete(
      `https://auction-app-sprihashringis-projects.vercel.app/api/v1/superadmin/auctionitem/delete/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }, // Include token
      }
    );
    dispatch(superAdminSlice.actions.successForAuctionItemDelete());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForAuctionItemDelete());
    toast.error(error.response?.data?.message || "Failed to delete auction item.");
  }
};

// Export reducer
export default superAdminSlice.reducer;

