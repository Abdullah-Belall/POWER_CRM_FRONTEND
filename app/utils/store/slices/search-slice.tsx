import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchState {
  column: string | null;
  search_in: string | null;
  search_with: string;
  columns: {
    alias: string | null;
    slug: string | null;
  }[];
  fillFunc: () => void;
}

const initialState: SearchState = {
  column: null,
  search_in: null,
  search_with: "",
  columns: [],
  fillFunc: () => {
    ("");
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    fillInitialDataSearch: (
      state,
      action: PayloadAction<{
        search_in: string;
        columns: {
          alias: string | null;
          slug: string | null;
        }[];
        fillFunc: () => void;
      }>
    ) => {
      state.search_in = action.payload.search_in;
      state.search_with = "";
      state.columns = action.payload.columns;
      state.fillFunc = action.payload.fillFunc;
    },
    resetDataSearch: (state) => {
      state.column = null;
      state.search_in = null;
      state.search_with = "";
      state.columns = [];
      state.fillFunc = () => {
        ("");
      };
    },
    setSearchColumn: (
      state,
      action: PayloadAction<{
        column: string;
      }>
    ) => {
      state.column = action.payload.column;
    },
    // startSearch: (state) => {

    // }
  },
});

export const { fillInitialDataSearch, resetDataSearch, setSearchColumn } = searchSlice.actions;
export const getSearchColumn = () => (state: RootState) => state.search.column;
export const getSearchColumns = () => (state: RootState) => state.search.columns;
export default searchSlice.reducer;
