import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import snakeBarReducer from "./slices/snake-bar-slice";
import analyticsReducer from "./slices/analytics-slice";
import popupReducer from "./slices/popup-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    snakeBar: snakeBarReducer,
    analytics: analyticsReducer,
    popup: popupReducer,
  },
  // Performance optimizations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for better performance
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "analytics/fillAnalytics"],
        ignoredPaths: ["user", "snakeBar", "analytics", "popup"],
      },
      // Disable immutable check for better performance
      immutableCheck: {
        ignoredPaths: ["user", "snakeBar", "analytics", "popup"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
