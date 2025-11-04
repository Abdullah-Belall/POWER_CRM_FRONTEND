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
  fillFunc: (obj: { data: any[]; total: number }) => void;
}

const initialState: SearchState = {
  column: null,
  search_in: null,
  search_with: "",
  columns: [],
  fillFunc: (obj: { data: any[]; total: number }) => {
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
        fillFunc: (obj: { data: any[]; total: number }) => void;
      }>
    ) => {
      state.search_in = action.payload.search_in;
      state.search_with = "";
      const columns = action.payload.columns;
      state.columns =
        columns && columns.length > 0 ? [{ alias: null, slug: "بحث عام" }, ...columns] : [];
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
        column: string | null;
      }>
    ) => {
      state.column = action.payload.column;
    },
    setSearchColumns: (
      state,
      action: PayloadAction<{
        columns: {
          alias: string | null;
          slug: string | null;
        }[];
      }>
    ) => {
      const columns = action.payload.columns;
      state.columns =
        columns && columns.length > 0 ? [{ alias: null, slug: "بحث عام" }, ...columns] : [];
    },
    setSearchWith: (
      state,
      action: PayloadAction<{
        search_with: string;
      }>
    ) => {
      state.search_with = action.payload.search_with;
    },
  },
});

export const {
  fillInitialDataSearch,
  resetDataSearch,
  setSearchColumn,
  setSearchWith,
  setSearchColumns,
} = searchSlice.actions;
export const getSearchInfo = () => (state: RootState) => state.search;
export default searchSlice.reducer;
