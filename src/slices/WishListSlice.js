import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/wishlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return { user: data.user, products: data.products };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
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
