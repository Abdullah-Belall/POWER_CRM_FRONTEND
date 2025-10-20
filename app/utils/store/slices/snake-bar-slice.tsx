import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum SnakeBarTypeEnum {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

interface SnakeBarState {
  isOpen: boolean;
  message: string;
  type: SnakeBarTypeEnum;
}

const initialState: SnakeBarState = {
  isOpen: false,
  message: "",
  type: SnakeBarTypeEnum.SUCCESS,
};

const snakeBarSlice = createSlice({
  name: "snakeBar",
  initialState,
  reducers: {
    openSnakeBar: (state, action: PayloadAction<{ message: string; type: SnakeBarTypeEnum }>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeSnakeBar: (state) => {
      state.isOpen = false;
      state.message = "";
      state.type = SnakeBarTypeEnum.SUCCESS;
    },
  },
});

export const { openSnakeBar, closeSnakeBar } = snakeBarSlice.actions;
export const snakeBarState = (state: { snakeBar: SnakeBarState }) => {
  return state.snakeBar;
};
export default snakeBarSlice.reducer;
