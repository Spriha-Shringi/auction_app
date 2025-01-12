import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getToken = () => localStorage.getItem("token");

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
    getAllAuctionItemRequest(state) {
      state.loading = true;
    },
    getAllAuctionItemSuccess(state, action) {
      state.loading = false;
      state.allAuctions = action.payload;
    },
    getAllAuctionItemFailed(state) {
      state.loading = false;
    },
    // Other reducers...
  },
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());
  try {
    const response = await axios.get(
      "https://auction-app-sprihashringis-projects.vercel.app/api/v1/auctionitem/allitems",
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    dispatch(auctionSlice.actions.getAllAuctionItemSuccess(response.data.items));
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());
    toast.error(error.response?.data?.message || "Failed to fetch auction items.");
  }
};

// Similarly update other actions like createAuction, getAuctionDetail...

export default auctionSlice.reducer;
