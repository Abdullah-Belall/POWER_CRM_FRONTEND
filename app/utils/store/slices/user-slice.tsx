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

const selectCurrentUserName = (state: { worker: UserState }) => state.worker.currentUser?.user_name;
const selectCurrentUserId = (state: { worker: UserState }) => state.worker.currentUser?.id;
const selectCurrentUserRoles = (state: { worker: UserState }) => state.worker.currentUser?.roles;
const selectUserIsLoading = (state: { worker: UserState }) => state.worker.isLoading;

export { selectUserIsLoading, selectCurrentUserName, selectCurrentUserId, selectCurrentUserRoles };
