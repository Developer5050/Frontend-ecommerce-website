import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/CartSlice";
import authReducer from "../slices/AuthSlice";
import wishlistSlice from "../slices/WishListSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistSlice,
  },
});
