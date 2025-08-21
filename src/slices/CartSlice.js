import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(items));
  } catch {}
};

const initialState = {
  cartItems: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromBackend: (state, action) => {
      state.cartItems = action.payload;
      saveCart(state.cartItems);
    },

    addToCart: (state, action) => {
      const newItem = action.payload;

      if (!newItem || !newItem.productId) {
        console.error("Invalid item added to cart:", newItem);
        return;
      }

      const uniqueItem = {
        ...JSON.parse(JSON.stringify(newItem)),
        _cartId: Date.now() + Math.random(),
      };

      state.cartItems.push(uniqueItem);
      saveCart(state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.productId === productId);
      if (item) item.quantity = quantity;
      saveCart(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
      saveCart(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  setCartFromBackend,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
