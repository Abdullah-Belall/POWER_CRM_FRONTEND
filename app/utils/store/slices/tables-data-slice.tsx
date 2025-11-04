import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../interfaces/user-interface";
import { RootState } from "../store";
import { ManagerComplaintInterface } from "../../interfaces/manager.interface";
import { RoleInterface } from "../../interfaces/common.interface";
import { ClientComplaintInterface } from "../../interfaces/clients.interface";

interface TablesDataState {
  managerUsersTable: {
    total: number;
    data: UserInterface[];
  };
  managerComplaintsTable: {
    total: number;
    data: ManagerComplaintInterface[];
  };
  createComplaintForClientUsersTable: {
    total: number;
    data: UserInterface[];
  };
  managerRolesTable: {
    total: number;
    data: RoleInterface[];
  };
  clientComplaintsTable: {
    total: number;
    data: ClientComplaintInterface[];
  };
}

const initialState: TablesDataState = {
  managerUsersTable: {
    total: 0,
    data: [],
  },
  managerComplaintsTable: {
    total: 0,
    data: [],
  },
  createComplaintForClientUsersTable: {
    total: 0,
    data: [],
  },
  managerRolesTable: {
    total: 0,
    data: [],
  },
  clientComplaintsTable: {
    total: 0,
    data: [],
  },
};

const tableDataSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    fillTable: (
      state,
      action: PayloadAction<{
        tableName: keyof TablesDataState;
        obj: {
          total: number;
          data: any[];
        };
      }>
    ) => {
      state[action.payload.tableName] = action.payload.obj;
    },
  },
});

export const { fillTable } = tableDataSlice.actions;
export const getTable =
  <K extends keyof TablesDataState>(tableName: K) =>
  (state: RootState) =>
    state.tableData[tableName] as TablesDataState[K];

export default tableDataSlice.reducer;
