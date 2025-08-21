export const updateQuantity = (productId, newQty) => (dispatch, getState) => {
  dispatch({
    type: "cart/updateQuantity",
    payload: { productId, newQty },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
