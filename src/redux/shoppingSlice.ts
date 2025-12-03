import { createSlice } from "@reduxjs/toolkit";
import { ProductsStruct } from "../../type";

interface StoreState {
  productData: ProductsStruct[];
  userInfo: null | string;
  orderData: {
    order: ProductsStruct[];
    id?: string;
  };
}

const initialState: StoreState = {
  productData: [],
  userInfo: null,
  orderData: { order: [], id: undefined },
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
      
      // Normalize product data to ensure correct types
      const normalizedProduct: ProductsStruct = {
        ...product,
        _id: Number(product._id),
        price: Number(product.price),
        oldPrice: Number(product.oldPrice),
        quantity: Number(product.quantity) || 1,
        rating: Number(product.rating) || 0
      };
      
      if (existingProduct) {
        const currentQuantity = existingProduct.quantity && !isNaN(Number(existingProduct.quantity))
          ? Number(existingProduct.quantity)
          : 1;
        existingProduct.quantity = currentQuantity + 1;
      } else {
        // Ensure new products start with quantity 1
        state.productData.push(normalizedProduct);
      }
    },
    increaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: ProductsStruct) => item._id === action.payload._id
      );
      if (existingProduct) {
        const currentQuantity = existingProduct.quantity && !isNaN(Number(existingProduct.quantity))
          ? Number(existingProduct.quantity)
          : 1;
        existingProduct.quantity = currentQuantity + 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: ProductsStruct) => item._id === action.payload._id
      );
      if (existingProduct) {
        const currentQuantity = existingProduct.quantity && !isNaN(Number(existingProduct.quantity))
          ? Number(existingProduct.quantity)
          : 1;
        
        if (currentQuantity <= 1) {
          existingProduct.quantity = 1;
        } else {
          existingProduct.quantity = currentQuantity - 1;
        }
      }
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      if (!productId) {
        console.warn('Invalid product ID for deletion:', productId);
        return;
      }
      state.productData = state.productData.filter(
        (item) => item._id !== productId
      );
    },
    resetCart: (state) => {
      state.productData = [];
      state.orderData = { order: [], id: undefined };
    },
    addUser: (state, action) => {
      const userInfo = action.payload;
      if (!userInfo) {
        console.warn('Invalid user info:', userInfo);
        return;
      }
      state.userInfo = userInfo;
    },
    deleteUser: (state) => {
      state.userInfo = null;
    },
    saveOrder: (state, action) => {
      const orderData = action.payload;
      if (!orderData || !Array.isArray(orderData)) {
        console.warn('Invalid order data:', orderData);
        return;
      }
      
      // Normalize order data to ensure correct types
      const normalizedOrder = orderData.map((item: any) => ({
        ...item,
        _id: Number(item._id),
        price: Number(item.price),
        oldPrice: Number(item.oldPrice),
        quantity: Number(item.quantity) || 1,
        rating: Number(item.rating) || 0
      }));
      
      state.orderData = { order: normalizedOrder, id: action.payload.id };
    },
    resetOrder: (state) => {
      state.orderData = { order: [], id: undefined };
    },
  },
});

export const {
  addToCart,
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
