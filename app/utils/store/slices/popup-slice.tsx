import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupInterface {
  isOpen: boolean;
  data?: any;
}

interface PopupState {
  managerComplaintDetails: PopupInterface;
  supporterComplaintDetails: PopupInterface;
  clientComplaintDetails: PopupInterface;
  managerRolesForm: PopupInterface;
  roleUsers: PopupInterface;
  managerUsersForm: PopupInterface;
  managerUserDetails: PopupInterface;
  sideBar: PopupInterface;
  supporterReferResponse: PopupInterface;
  selectClientForCreateComplaint: PopupInterface;
  createComplaintForClient: PopupInterface;
  notifiRefetch: PopupInterface;
  assignSupporter: PopupInterface;
  refereToSupporter: PopupInterface;
  uploadUserExcelFile: PopupInterface;
}

const initialState: PopupState = {
  managerComplaintDetails: { isOpen: false },
  supporterComplaintDetails: { isOpen: false },
  managerRolesForm: { isOpen: false },
  roleUsers: { isOpen: false },
  managerUsersForm: { isOpen: false },
  managerUserDetails: { isOpen: false },
  sideBar: { isOpen: false },
  supporterReferResponse: { isOpen: false },
  clientComplaintDetails: { isOpen: false },
  selectClientForCreateComplaint: { isOpen: false },
  createComplaintForClient: { isOpen: false },
  notifiRefetch: { isOpen: false },
  assignSupporter: { isOpen: false },
  refereToSupporter: { isOpen: false },
  uploadUserExcelFile: { isOpen: false },
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<{ popup: keyof typeof initialState; data: any }>) => {
      state[action.payload.popup].isOpen = true;
      state[action.payload.popup].data = action.payload.data;
    },
    closePopup: (state, action: PayloadAction<{ popup: keyof typeof initialState }>) => {
      state[action.payload.popup].isOpen = false;
      state[action.payload.popup].data = undefined;
    },
  },
});

export const { openPopup, closePopup } = popupSlice.actions;

export default popupSlice.reducer;

export const selectPopup = (state: { popup: PopupState }, popup: keyof PopupState) =>
  state.popup[popup];
