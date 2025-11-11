import { createSlice } from "@reduxjs/toolkit";
import { ProductsStruct } from "../../type";

interface StoreState {
  productData: ProductsStruct[];
  userInfo: null | string;
  orderData: [];
}

const initialState: StoreState = {
  productData: [],
  userInfo: null,
  orderData: [],
};

export const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.productData.find(
        (item: ProductsStruct) => item._id === action.payload._id
      );
      
      // Validate basic product data
      const product = action.payload;
      if (!product || !product._id || !product.title) {
        console.warn('Invalid product data:', product);
        return;
      }
      
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        // Ensure new products start with quantity 1
        const newProduct = {
          ...product,
          quantity: 1
        };
        state.productData.push(newProduct);
      }
    },
    // New reducer to normalize existing cart items
    normalizeCartQuantities: (state) => {
      state.productData = state.productData.map((item: ProductsStruct) => {
        // If quantity is 0, undefined, null, or not a number, set to 1
        if (!item.quantity || item.quantity === 0 || isNaN(Number(item.quantity))) {
          return { ...item, quantity: 1 };
        }
        return item;
      });
    },
    increaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: ProductsStruct) => item._id === action.payload._id
      );
      existingProduct && existingProduct.quantity++;
    },
    decreaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: ProductsStruct) => item._id === action.payload._id
      );
      if (existingProduct?.quantity === 1) {
        existingProduct.quantity = 1;
      } else {
        existingProduct && existingProduct.quantity--;
      }
    },
    deleteProduct: (state, action) => {
      state.productData = state.productData.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    deleteUser: (state) => {
      state.userInfo = null;
    },
    saveOrder: (state, action) => {
      state.orderData = action.payload;
    },
    resetOrder: (state) => {
      state.orderData = [];
    },
  },
});

export const {
  addToCart,
  normalizeCartQuantities,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  addUser,
  deleteUser,
  saveOrder,
  resetOrder,
} = shoppingSlice.actions;
export default shoppingSlice.reducer;
