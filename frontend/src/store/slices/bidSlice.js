// File: bidSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";

const getToken = () => localStorage.getItem("token");

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
  },
  reducers: {
    bidRequest(state) {
      state.loading = true;
    },
    bidSuccess(state) {
      state.loading = false;
    },
    bidFailed(state) {
      state.loading = false;
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  const token = getToken();
  try {
    const response = await axios.post(
      `https://auction-app-sprihashringis-projects.vercel.app/api/v1/bid/place/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id));
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());
    toast.error(error.response?.data?.message || "Bid placement failed.");
  }
};

export default bidSlice.reducer;
