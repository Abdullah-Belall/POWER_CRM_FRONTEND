import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalyticsInterface {
  title: string;
  value: string;
  lastMonth: number;
  onclick: (() => void) | (() => Promise<void>);
}

interface chartInterface {
  month: string;
  col1: number;
  col2: number;
  col3: number;
}

interface AnalyticsState {
  analytics: AnalyticsInterface[];
  chart: chartInterface[];
}

const initialState: AnalyticsState = {
  analytics: [],
  chart: [],
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    fillAnalytics: (state, action: PayloadAction<AnalyticsState>) => {
      state.analytics = action.payload.analytics;
      state.chart = action.payload.chart;
    },
  },
});

export const { fillAnalytics } = analyticsSlice.actions;
export const analyticsState = (state: { analytics: AnalyticsState }) => {
  return state.analytics;
};
export default analyticsSlice.reducer;
