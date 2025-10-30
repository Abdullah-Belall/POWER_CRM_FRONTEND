import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalyticsInterface {
  title: string;
  value: string;
  lastMonth: number;
}

interface AnalyticsState {
  analytics: AnalyticsInterface[];
}

const initialState: AnalyticsState = {
  analytics: [],
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    fillAnalytics: (state, action: PayloadAction<AnalyticsState>) => {
      state.analytics = action.payload.analytics;
    },
  },
});

export const { fillAnalytics } = analyticsSlice.actions;
export const analyticsState = (state: { analytics: AnalyticsState }) => {
  return state.analytics;
};
export default analyticsSlice.reducer;
