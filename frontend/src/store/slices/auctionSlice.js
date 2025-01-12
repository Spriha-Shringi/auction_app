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
    createAuctionRequest(state) {
      state.loading = true;
    },
    createAuctionSuccess(state) {
      state.loading = false;
    },
    createAuctionFailed(state) {
      state.loading = false;
    },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(auctionSlice.actions.getAllAuctionItemSuccess(response.data.items));
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());
    console.error("Error in getAllAuctionItems:", error.response?.data || error.message);
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(auctionSlice.actions.createAuctionSuccess());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFailed());
    console.error("Error in createAuction:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to create auction.");
  }
};

export default auctionSlice.reducer;
