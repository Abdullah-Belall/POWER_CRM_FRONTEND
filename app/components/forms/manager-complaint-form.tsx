"use client";
import { getDir, ScreenViewer } from "@/app/utils/base";
import {
  ComplaintPriorityStatusEnum,
  ComplaintStatusEnum,
} from "@/app/utils/enums/complaint-status-enum";
import { ScreenViewerEnum } from "@/app/utils/enums/screen-viewer.enum";
import { SupporterReferAcceptEnum } from "@/app/utils/enums/supporter-accept-status.enum";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { FINISH_SOLVE } from "@/app/utils/requests-hub/supporters-reqs";
import { useRouter } from "next/navigation";
import {
  CHANGE_PRIORITY_STATUS,
  GET_COMPLAINT,
  START_SOLVE_COMPLAINT,
} from "@/app/utils/requests-hub/managers-reqs";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import BlackLayer from "../common/black-layer/black-layer";
import AssignToSupporter from "./assign-to-supporter-form";

function safeDayjs(val: any): Dayjs | null {
  if (!val) return null;
  const d = dayjs(val);
  return d.isValid() ? d : null;
}

export default function ManagerComplaintForm({
  closeForm,
  id,
  refetchComplaints,
}: {
  closeForm: () => void;
  id: string;
  refetchComplaints: () => Promise<void>;
}) {
  const router = useRouter();
  const [data, setData] = useState({
    id: "",
    client: {
      id: "",
      user_name: "",
    },
    solving: [],
    index: null,
    tenant_id: "",
    title: "",
    details: "",
    full_name: "",
    phone: "",
    max_time_to_solve: null,
    screen_viewer: ScreenViewerEnum.ANYDESK,
    screen_viewer_id: "",
    screen_viewer_password: "",
    server_viewer: "",
    server_viewer_id: "",
    server_viewer_password: "",
    start_solve_at: null,
    end_solve_at: null,
    status: ComplaintStatusEnum.PENDING,
    priority_status: ComplaintPriorityStatusEnum.NORMAL,
    intervention_date: null,
    accept_excuse: null,
    created_at: "",
    updated_at: "",
  });
  let initialDate: Dayjs | null = safeDayjs(data?.intervention_date);
  let initialTime: PickerValue | null = initialDate;
  if (data?.intervention_date) {
    let dateObj: Dayjs | null = null;
    if ((data.intervention_date as any) instanceof Date) {
      dateObj = dayjs(data.intervention_date);
    } else if (typeof data.intervention_date === "string") {
      dateObj = dayjs(data.intervention_date);
    } else {
      dateObj = data.intervention_date as Dayjs;
    }
    initialDate = dateObj;
    initialTime = dateObj;
  }
  const [time, setTime] = useState<PickerValue | null>(initialTime);

  useEffect(() => {
    setTime(safeDayjs(data.intervention_date));
  }, [data.intervention_date]);

  const currUser = useAppSelector((state) => selectCurrentUser(state));
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
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_COMPLAINT, { complaint_id: id });
    if (res.done) {
      setData(res.data);
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(START_SOLVE_COMPLAINT, {
      complaint_id: data?.id,
      data,
    });
    setLoading(false);
    if (res.done) {
      dispatch(closePopup({ popup: "managerComplaintDetails" }));
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Successfully picked complaint");
      refetchComplaints();
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res?.message);
    }
  };

  const handleFinish = async () => {
    if (
      data.status !== ComplaintStatusEnum.COMPLETED &&
      data.status !== ComplaintStatusEnum.CANCELLED
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.WARNING, "Change complaint status to finish");
      return;
    }
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(FINISH_SOLVE, { data: { status: data.status, id } });
    if (res.done) {
      closeForm();
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Complaint finished successfully");
      refetchComplaints();
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res?.message);
    }
    setLoading(false);
  };
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("clientsComplaintsPage")).popup;
  const assignSupporterPopup = useAppSelector((state) => selectPopup(state, "assignSupporter"));
  const [changePriorityStatusLoading, setChangePriorityStatusLoading] = useState(false);
  const handleChangePriorityStatus = async (value: string) => {
    if (
      data.status === ComplaintStatusEnum.COMPLETED ||
      data.status === ComplaintStatusEnum.CANCELLED ||
      data.status === ComplaintStatusEnum.CLIENT_CANCELLED
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, `The Complaint is ${data.status}`);
      return;
    }
    if (changePriorityStatusLoading) return;
    handleData("priority_status", value);
    setChangePriorityStatusLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CHANGE_PRIORITY_STATUS, {
      data: { id, priority_status: value },
    });
    console.log(res);
    setChangePriorityStatusLoading(false);
    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, `Changed Priority Status Successfully`);
      refetchComplaints();
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };
  return (
    <>
      <div dir={getDir(lang)} className="w-4xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
        <h1 className="text-lg font-semibold text-black mx-auto pb-1 w-fit">
          {trans.inputs.title.split(" ")[lang === "ar" ? 1 : 0]}
        </h1>
        <div className="w-full max-h-[calc(100dvh-200px)] overflow-x-hidden overflow-y-scroll">
          <div className="w-full my-[15px] px-1 flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <TextField
                className={`w-full`}
                value={data?.full_name}
                variant={"filled"}
                label={trans.inputs.name}
                disabled
              />
              <TextField
                className={`w-full`}
                value={data?.phone}
                onChange={(e) =>
                  handleData(
                    "phone",
                    e.target.value.slice(0, 3) === "+20"
                      ? isNaN(Number(e.target.value.slice(3)))
                        ? data?.phone
                        : e.target.value
                      : data?.phone
                  )
                }
                variant={"filled"}
                label={trans.inputs.phone}
                disabled
              />
            </div>
            <TextField
              className={`w-full`}
              value={data?.title}
              onChange={(e) => handleData("title", e.target.value)}
              variant={"filled"}
              label={trans.inputs.title}
              disabled
            />
            <TextField
              className={`w-full`}
              value={data?.details}
              onChange={(e) => handleData("details", e.target.value)}
              variant={"filled"}
              multiline
              rows={4}
              label={trans.inputs.details}
              disabled
            />
            <div className="flex gap-2.5">
              <FormControl fullWidth disabled>
                <InputLabel id="select-label4">{trans.inputs.screenViewer}</InputLabel>
                <Select
                  labelId="select-label4"
                  value={data?.screen_viewer}
                  label={trans.inputs.screenViewer}
                  onChange={(e) => handleData("screen_viewer", e.target.value)}
                >
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.ANYDESK}>
                    <ScreenViewer viewer={ScreenViewerEnum.ANYDESK} />
                  </MenuItem>
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.ULTRAVIEWER}>
                    <ScreenViewer viewer={ScreenViewerEnum.ULTRAVIEWER} />
                  </MenuItem>
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.TEAMVIEWR}>
                    <ScreenViewer viewer={ScreenViewerEnum.TEAMVIEWR} />
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                className={`w-full`}
                value={data?.screen_viewer_id}
                onChange={(e) => handleData("screen_viewer_id", e.target.value)}
                variant={"filled"}
                label={trans.inputs.viewerId}
                disabled
              />
            </div>
            {data?.screen_viewer !== ScreenViewerEnum.ANYDESK ? (
              <TextField
                className={`w-full`}
                value={data?.screen_viewer_password}
                onChange={(e) => handleData("screen_viewer_password", e.target.value)}
                variant={"filled"}
                label={"Password"}
                disabled
              />
            ) : (
              ""
            )}
            <div className="flex gap-2.5">
              <FormControl fullWidth disabled>
                <InputLabel id="select-label6">{trans?.inputs.serverViewer}</InputLabel>
                <Select
                  labelId="select-label6"
                  value={data.server_viewer}
                  label={trans?.inputs.serverViewer}
                  onChange={(e) => handleData("server_viewer", e.target.value)}
                  MenuProps={{
                    sx: { zIndex: 999999 },
                    PaperProps: {
                      sx: { zIndex: 999999 },
                    },
                    container: typeof window !== "undefined" ? document.body : undefined,
                  }}
                >
                  <MenuItem className="hover:bg-xlightgreen! !font-semibold" value={""}>
                    Clear
                  </MenuItem>
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.ANYDESK}>
                    <ScreenViewer viewer={ScreenViewerEnum.ANYDESK} />
                  </MenuItem>
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.ULTRAVIEWER}>
                    <ScreenViewer viewer={ScreenViewerEnum.ULTRAVIEWER} />
                  </MenuItem>
                  <MenuItem className="hover:bg-xlightgreen!" value={ScreenViewerEnum.TEAMVIEWR}>
                    <ScreenViewer viewer={ScreenViewerEnum.TEAMVIEWR} />
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                className={`w-full`}
                value={data.server_viewer_id}
                onChange={(e) => handleData("server_viewer_id", e.target.value)}
                variant={"filled"}
                label={trans?.inputs.viewerId}
                disabled
              />
            </div>
            {data.server_viewer &&
            (data.server_viewer as any) !== "" &&
            data.server_viewer !== ScreenViewerEnum.ANYDESK ? (
              <TextField
                className={`w-full`}
                value={data.server_viewer_password}
                onChange={(e) => handleData("server_viewer_password", e.target.value)}
                variant={"filled"}
                label={trans?.inputs.password}
              />
            ) : (
              ""
            )}
            <div className="w-full flex flex-col items-center gap-2" dir="ltr">
              <h1 className="text-lightgreen">{trans.inputs.intervention}</h1>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem>
                  <div className="w-full !flex !items-center !gap-2.5">
                    <DatePicker
                      className="w-full"
                      onChange={(newValue) => handleData("intervention_date", newValue as any)}
                      value={safeDayjs(data.intervention_date)}
                      minDate={dayjs()}
                      slotProps={{
                        popper: {
                          sx: { zIndex: 99999999999 },
                        },
                        textField: {
                          disabled: true,
                        },
                      }}
                    />
                    <TimePicker
                      className="w-full"
                      value={safeDayjs(time)}
                      slotProps={{
                        popper: {
                          sx: { zIndex: 99999999999 },
                        },
                        textField: {
                          disabled: true,
                        },
                      }}
                    />
                  </div>
                </DemoItem>
              </LocalizationProvider>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <h1 className="text-black font-[600]">Actions</h1>
            {data.status !== ComplaintStatusEnum.COMPLETED &&
            data.status !== ComplaintStatusEnum.CANCELLED &&
            data.status !== ComplaintStatusEnum.CLIENT_CANCELLED ? (
              <FormControl className="sm:w-[70%]" disabled={changePriorityStatusLoading}>
                <InputLabel id="select-label4">{trans.inputs.priority_status}</InputLabel>
                <Select
                  labelId="select-label4"
                  value={data?.priority_status}
                  label={trans.inputs.priority_status}
                  onChange={(e) => handleChangePriorityStatus(e.target.value)}
                  MenuProps={{
                    sx: { zIndex: 999999 },
                    PaperProps: {
                      sx: { zIndex: 999999 },
                    },
                    container: typeof window !== "undefined" ? document.body : undefined,
                  }}
                >
                  <MenuItem
                    className="hover:bg-xlightgreen!"
                    value={ComplaintPriorityStatusEnum.HIGH}
                  >
                    {trans.inputs.priority_statuses[0]}
                  </MenuItem>
                  <MenuItem
                    className="hover:bg-xlightgreen!"
                    value={ComplaintPriorityStatusEnum.NORMAL}
                  >
                    {trans.inputs.priority_statuses[1]}
                  </MenuItem>
                  <MenuItem
                    className="hover:bg-xlightgreen!"
                    value={ComplaintPriorityStatusEnum.LOW}
                  >
                    {trans.inputs.priority_statuses[2]}
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            {(data.solving[0] as any)?.supporter?.id === currUser?.id &&
              (data.solving[0] as any)?.accept_status === SupporterReferAcceptEnum.ACCEPTED && (
                <div className="flex flex-col gap-2 w-full items-center">
                  <FormControl fullWidth className="!text-darkgreen">
                    <InputLabel id="select-label2">Status</InputLabel>
                    <Select
                      labelId="select-label2"
                      value={data?.status}
                      className="!text-darkgreen !font-[600]"
                      label="Status"
                      onChange={(e) => handleData("status", e.target.value)}
                      sx={{
                        color: "darkgreen",
                        fontWeight: 600,
                        "& .MuiSvgIcon-root": {
                          color: "darkgreen",
                        },
                      }}
                      MenuProps={{
                        sx: { zIndex: 999999 },
                        PaperProps: {
                          sx: { zIndex: 999999 },
                        },
                        container: typeof window !== "undefined" ? document.body : undefined,
                      }}
                    >
                      <MenuItem
                        className="hover:bg-xlightgreen! !font-[600]"
                        value={ComplaintStatusEnum.COMPLETED}
                      >
                        {ComplaintStatusEnum.COMPLETED}
                      </MenuItem>
                      <MenuItem
                        className="hover:bg-xlightgreen! !font-[600]"
                        value={ComplaintStatusEnum.CANCELLED}
                      >
                        {ComplaintStatusEnum.CANCELLED}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Button onClick={handleFinish} variant="contained">
                    Finish Compliant
                  </Button>
                </div>
              )}
            {(data.status === ComplaintStatusEnum.PENDING ||
              data.status === ComplaintStatusEnum.SUSPENDED) && (
              <div className="flex gap-2">
                <Button onClick={handleConfirm} variant="contained">
                  Start Solving
                </Button>
                <Button
                  onClick={() =>
                    dispatch(
                      openPopup({
                        popup: "assignSupporter",
                        data: {
                          closeForm: () => {
                            closeForm();
                            dispatch(
                              closePopup({
                                popup: "assignSupporter",
                              })
                            );
                          },
                          complaint_id: id,
                          refetchComplaints,
                        },
                      })
                    )
                  }
                  variant="contained"
                >
                  Assign To Supporter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {assignSupporterPopup.isOpen && (
        <BlackLayer
          onClick={() => {
            dispatch(
              closePopup({
                popup: "assignSupporter",
              })
            );
          }}
        >
          <AssignToSupporter />
        </BlackLayer>
      )}
    </>
  );
}
