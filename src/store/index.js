import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
// import feedReducer from "./features/feed/feedSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
