import { createContext, useState, useEffect, useReducer } from 'react';
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_ITEM: 'CLEAR_ITEM',
  TOGGLE_CART: 'TOGGLE_CART',
};

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }



  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
}
const cartReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CART_ACTIONS.ADD_ITEM:
      return {
        ...state,
        cartItems: addCartItem(state.cartItems, payload),
        cartCount: state.cartCount + 1,
        cartTotal: state.cartTotal + payload.price,
      };
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        cartItems: removeCartItem(state.cartItems, payload),
        cartCount: state.cartCount - 1,
        cartTotal: state.cartTotal - payload.price,
      };
    case CART_ACTIONS.CLEAR_ITEM:
      return {
        ...state,
        cartItems: clearCartItem(state.cartItems, payload),
        cartCount: state.cartCount - payload.quantity,
        cartTotal: state.cartTotal - payload.quantity * payload.price,
      };
    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => { },
  cartItems: [],
  addItemToCart: () => { },
  removeItemFromCart: () => { },
  clearItemFromCart: () => { },
  cartCount: 0,
  cartTotal: 0,
});

export const CartProvider = ({ children }) => {
  const [{ isCartOpen, cartItems, cartCount, cartTotal }, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  const addItemToCart = (productToAdd) => {
    dispatch({ type: "ADD_ITEM", payload: productToAdd });
  };

  const removeItemToCart = (cartItemToRemove) => {
    dispatch({ type: "REMOVE_ITEM", payload: cartItemToRemove });
  };

  const clearItemFromCart = (cartItemToClear) => {
    dispatch({ type: "CLEAR_ITEM", payload: cartItemToClear });
  };
  const setIsCartOpen = () => {
    dispatch({ type: "TOGGLE_CART" });
  };
  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
