import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../interfaces/user-interface";
import type { RootState } from "../store";

interface UserState {
  currentUser: UserInterface | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setCurrentUser: (state, action: PayloadAction<UserInterface | null>) => {
      state.currentUser = action.payload;
    },

    updateCurrentUser: (state, action: PayloadAction<Partial<UserInterface>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    clearUserData: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setLoading, setCurrentUser, updateCurrentUser, clearUserData } = userSlice.actions;

export default userSlice.reducer;

const selectCurrentUser = (state: RootState) => state.user.currentUser;
const selectCurrentUserId = (state: RootState) => state.user.currentUser?.id;
const selectCurrentUserName = (state: RootState) => state.user.currentUser?.user_name;
const selectCurrentUserRoles = (state: RootState) => state.user.currentUser?.role?.roles;
const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export {
  selectCurrentUserId,
  selectCurrentUser,
  selectUserIsLoading,
  selectCurrentUserName,
  selectCurrentUserRoles,
};
