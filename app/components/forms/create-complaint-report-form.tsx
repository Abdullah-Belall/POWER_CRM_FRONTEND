"use client";
import { complaintStatuses } from "@/app/utils/base";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_USERS } from "@/app/utils/requests-hub/supporters-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { fillTable, getTable } from "@/app/utils/store/slices/tables-data-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import UsersSelectTable from "../tables/users-select-table";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { MANAGERS_COMPLAINTS } from "@/app/utils/requests-hub/managers-reqs";

export default function CreateComplaintReportForm() {
  const [data, setData] = useState({
    fromDate: null,
    toDate: null,
    status: "",
    sorted_by: "DESC",
  });
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const handleData = (key: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  const selectClientForCreateComplaint = useAppSelector((state) =>
    selectPopup(state, "selectClientForCreateComplaint")
  );
  const vaildation = () => {
    const { fromDate, toDate } = data;
    if (
      !selectClientForCreateComplaint.data?.user_id ||
      selectClientForCreateComplaint.data?.user_id?.length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select client for the complaint");
      return false;
    }
    // If fromDate is set and toDate is also set, enforce toDate >= fromDate + 1 day
    if (fromDate && toDate) {
      const from = dayjs(fromDate as any);
      const to = dayjs(toDate as any);
      if (to.isBefore(from.add(1, "day"), "day")) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "To date must be at least one day after From date"
        );
        return false;
      }
    }
    return true;
  };
  const createComplaintForClientUsersTable = useAppSelector(
    getTable("createComplaintForClientUsersTable")
  );
  const clients = createComplaintForClientUsersTable.data;
  useEffect(() => {
    const fetchClients = async () => {
      const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
        roleAttributes: JSON.stringify(["create-complaint"]),
      });
      if (res.done) {
        dispatch(
          fillTable({
            tableName: "createComplaintForClientUsersTable",
            obj: {
              total: res.data?.total,
              data: res.data?.users,
            },
          })
        );
      }
    };
    fetchClients();
  }, []);
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(MANAGERS_COMPLAINTS, {
      queries: [
        {
          key: "client_id",
          value: selectClientForCreateComplaint.data?.user_id,
        },
        {
          key: "status",
          value: data.status !== "" && data.status !== "Any" ? data.status : undefined,
        },
        {
          key: "created_from",
          value: data.fromDate ?? undefined,
        },
        {
          key: "created_to",
          value: data.toDate ?? undefined,
        },
        {
          key: "ordered_by",
          value: data.sorted_by ?? undefined,
        },
      ],
    });
    setLoading(false);
    if (res.done) {
      dispatch(
        closePopup({
          popup: "createComplaintsReport",
        })
      );
      dispatch(
        fillTable({
          tableName: "managerComplaintsTable",
          obj: {
            data: res.data.complaints,
            total: res.data.total,
          },
        })
      );
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).reportPopup;
  return (
    <div className="w-2xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">{trans.title}</h1>
      <div className="w-full px-1 my-[15px] flex flex-col gap-2.5">
        <UsersSelectTable data={clients} type={"selectClientForCreateComplaint"} />
        <div className="flex gap-2">
          <FormControl fullWidth className="!text-darkgreen">
            <InputLabel id="select-label2">{trans.status}</InputLabel>
            <Select
              labelId="select-label2"
              value={data.status || ""}
              onChange={(e) => handleData("status", e.target.value)}
              className="!text-lightgreen !font-[600]"
              label={trans.status}
              MenuProps={{
                sx: { zIndex: 999999 },
                PaperProps: {
                  sx: { zIndex: 999999 },
                },
                container: typeof window !== "undefined" ? document.body : undefined,
              }}
              sx={{
                color: "darkgreen",
                fontWeight: 600,
                "& .MuiSvgIcon-root": {
                  color: "darkgreen",
                },
              }}
            >
              {["Any", ...complaintStatuses]?.map((e) => (
                <MenuItem key={e} className="hover:bg-xlightgreen! !font-[600]" value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="!text-darkgreen">
            <InputLabel id="select-label2">{trans.sorted_by}</InputLabel>
            <Select
              labelId="select-label2"
              value={data.sorted_by || ""}
              onChange={(e) => handleData("sorted_by", e.target.value)}
              className="!text-lightgreen !font-[600]"
              label={trans.sorted_by}
              MenuProps={{
                sx: { zIndex: 999999 },
                PaperProps: {
                  sx: { zIndex: 999999 },
                },
                container: typeof window !== "undefined" ? document.body : undefined,
              }}
              sx={{
                color: "darkgreen",
                fontWeight: 600,
                "& .MuiSvgIcon-root": {
                  color: "darkgreen",
                },
              }}
            >
              <MenuItem className="hover:bg-xlightgreen! !font-[600]" value={"ASC"}>
                ASC
              </MenuItem>
              <MenuItem className="hover:bg-xlightgreen! !font-[600]" value={"DESC"}>
                DESC
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem>
                <div className="w-full !flex !items-center !gap-2.5">
                  <DatePicker
                    label={trans.toDate}
                    className="w-full"
                    onChange={(newValue) => handleData("toDate", newValue as any)}
                    value={data.toDate as any}
                    minDate={data.fromDate ? dayjs(data.fromDate as any).add(1, "day") : dayjs()}
                    slotProps={{
                      popper: {
                        sx: { zIndex: 99999999999 },
                      },
                    }}
                  />
                </div>
              </DemoItem>
            </LocalizationProvider>
          </div>
          <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem>
                <div className="w-full !flex !items-center !gap-2.5">
                  <DatePicker
                    label={trans.fromDate}
                    className="w-full"
                    maxDate={dayjs()}
                    onChange={(newValue) => handleData("fromDate", newValue as any)}
                    value={data.fromDate as any}
                    slotProps={{
                      popper: {
                        sx: { zIndex: 99999999999 },
                      },
                    }}
                  />
                </div>
              </DemoItem>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <Button onClick={handleConfirm} variant="contained">
        {trans.btn}
      </Button>
    </div>
  );
}
