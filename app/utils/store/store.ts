import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import snakeBarReducer from "./slices/snake-bar-slice";
import analyticsReducer from "./slices/analytics-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    snakeBar: snakeBarReducer,
    analytics: analyticsReducer,
  },
  // Performance optimizations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for better performance
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "analytics/fillAnalytics"],
        ignoredPaths: ["user", "snakeBar", "analytics"],
      },
      // Disable immutable check for better performance
      immutableCheck: {
        ignoredPaths: ["user", "snakeBar", "analytics"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
