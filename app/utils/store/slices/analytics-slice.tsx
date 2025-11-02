import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalyticsInterface {
  title: string;
  value: string;
  lastMonth: number;
}

interface AnalyticsState {
  analytics: AnalyticsInterface[];
  offSetTop: number;
}

const initialState: AnalyticsState = {
  analytics: [],
  offSetTop: 0,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    fillAnalytics: (state, action: PayloadAction<AnalyticsState>) => {
      state.analytics = action.payload.analytics;
    },
    setOffsetTop: (state, action: PayloadAction<number>) => {
      state.offSetTop = action.payload;
    },
  },
});

export const { fillAnalytics, setOffsetTop } = analyticsSlice.actions;
export const analyticsState = (state: { analytics: AnalyticsState }) => {
  return state.analytics;
};
export default analyticsSlice.reducer;
