import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../interfaces/user-interface";

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

// Selectors typed against local shape to avoid importing RootState
const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
const selectCurrentUserName = (state: { user: UserState }) => state.user.currentUser?.user_name;
const selectCurrentUserId = (state: { user: UserState }) => state.user.currentUser?.id;
const selectUserIsLoading = (state: { user: UserState }) => state.user.isLoading;

export { selectCurrentUser, selectUserIsLoading, selectCurrentUserName, selectCurrentUserId };
