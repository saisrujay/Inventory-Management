import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSilce";
import productReducer from "../redux/features/product/productSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    },
});