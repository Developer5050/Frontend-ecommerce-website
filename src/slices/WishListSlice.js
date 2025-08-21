import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080"; // or your actual base URL

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId) => {
    const { data } = await axios.get(`${BASE_URL}/api/wishlist/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return { user: data.user, products: data.products };
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { user: null, products: [] },
  reducers: {
    addWishlist: (state, action) => {
      state.products.push(action.payload);
    },
    removeWishlist: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    setWishlist: (state, action) => {
      state.user = action.payload.user;
      state.products = action.payload.products;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.products = action.payload.products;
    });
  },
});

export const { addWishlist, removeWishlist, setWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
