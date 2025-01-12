import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getToken = () => localStorage.getItem("token"); // Fetch token dynamically

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    loading: false,
    itemDetail: {},
    auctionDetail: {},
    auctionBidders: {},
    myAuctions: [],
    allAuctions: [],
  },
  reducers: {
    createAuctionRequest(state) {
      state.loading = true;
    },
    createAuctionSuccess(state) {
      state.loading = false;
    },
    createAuctionFailed(state) {
      state.loading = false;
    },
    // Other reducers remain unchanged...
  },
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());
  try {
    const token = getToken();
    const response = await axios.get(
      "https://auction-app-sprihashringis-projects.vercel.app/api/v1/auctionitem/allitems",
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(auctionSlice.actions.getAllAuctionItemSuccess(response.data.items));
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());
    toast.error(error.response?.data?.message || "Failed to fetch auction items.");
  }
};

export const createAuction = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest());
  try {
    const token = getToken();
    const response = await axios.post(
      "https://auction-app-sprihashringis-projects.vercel.app/api/v1/auctionitem/create",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(auctionSlice.actions.createAuctionSuccess());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFailed());
    toast.error(error.response?.data?.message || "Failed to create auction.");
  }
};

// Similarly, update other actions like getAuctionDetail, deleteAuction, etc.

export default auctionSlice.reducer;
