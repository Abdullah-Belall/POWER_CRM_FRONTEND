"use client";
import { ScreenViewer } from "@/app/utils/base";
import { ComplaintStatusEnum } from "@/app/utils/enums/complaint-status-enum";
import { ScreenViewerEnum } from "@/app/utils/enums/screen-viewer.enum";
import { SupporterReferAcceptEnum } from "@/app/utils/enums/supporter-accept-status.enum";
import { ManagerComplaintInterface } from "@/app/utils/interfaces/manager.interface";
import { getComplaint, getSupporters } from "@/app/utils/requests/managers-requests";
import { COLLECTOR_REQ, getCookie } from "@/app/utils/requests/refresh-token-req";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import UsersTable from "../tables/users-table";
import { UserInterface } from "@/app/utils/interfaces/user-interface";

export default function ManagerComplaintForm({
  closeForm,
  id,
}: {
  closeForm: () => void;
  id: string;
}) {
  const [data, setData] = useState<ManagerComplaintInterface>({
    id: "",
    user: {
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
    start_solve_at: null,
    end_solve_at: null,
    status: ComplaintStatusEnum.PENDING,
    accept_excuse: null,
    created_at: "",
    updated_at: "",
  });
  const [openSupporters, setOpenSupporters] = useState(false);
  const [supporters, setSupporters] = useState<UserInterface[]>([]);
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
  const queryClient = useQueryClient();
  const startSolve = useMutation({
    mutationFn: async (complaint_id: string) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints-solving/${complaint_id}/start-solving`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      closeForm();
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Successfully picked complaint");
      queryClient.invalidateQueries({ queryKey: ["manager-complaints"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data?.message);
    },
  });
  useQuery({
    queryKey: ["manager-client-complaint"],
    queryFn: async () => {
      const result = await getComplaint(id);
      setData(result.data);
      return result.data;
    },
  });

  const handleConfirm = async () => {
    if (startSolve.isPending) return;
    await COLLECTOR_REQ(() => {
      return startSolve.mutateAsync(data?.id);
    }, data);
  };
  useQuery({
    queryKey: ["manager-supporters-complaint-form"],
    queryFn: async () => {
      const result = await getSupporters();
      console.log(result);
      setSupporters(result.data.users);
      return result.data;
    },
  });
  const [assignData, setAssignData] = useState({
    note: "",
    max_time_to_solve: "",
  });
  const finishSolve = useMutation({
    mutationFn: async (dataBody) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/${data?.id}/finish`,
        dataBody,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      closeForm();
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Complaint finished successfully");
      queryClient.invalidateQueries({ queryKey: ["manager-complaints"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data?.message);
    },
  });
  const handleFinish = async () => {
    if (finishSolve.isPending) return;
    await COLLECTOR_REQ(
      (body) => {
        return finishSolve.mutateAsync(body);
      },
      { status: data.status }
    );
  };
  return (
    <div className="w-4xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">Complaint Details</h1>
      <div className="w-full max-h-[calc(100dvh-200px)] overflow-x-hidden overflow-y-scroll">
        <div className="w-full my-[15px] flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <TextField
              className={`w-full`}
              value={data?.full_name}
              variant={"filled"}
              label={"Name"}
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
              label={"Phone Number"}
              disabled
            />
          </div>
          <TextField
            className={`w-full`}
            value={data?.title}
            onChange={(e) => handleData("title", e.target.value)}
            variant={"filled"}
            label={"Title"}
            disabled
          />
          <TextField
            className={`w-full`}
            value={data?.details}
            onChange={(e) => handleData("details", e.target.value)}
            variant={"filled"}
            multiline
            rows={4}
            label={"Details"}
            disabled
          />
          <div className="flex gap-2.5">
            <FormControl fullWidth disabled>
              <InputLabel id="select-label4">Viewer</InputLabel>
              <Select
                labelId="select-label4"
                value={data?.screen_viewer}
                label="Age"
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
              label={"Viewer Id"}
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
        </div>
        {/* <div className="w-fit text-[red] font-[600] mx-auto">
          coming tomorrow Complaint supporter history
        </div> */}
        <div className="w-full flex flex-col items-center gap-3">
          <h1 className="text-black font-[600]">Actions</h1>

          {data.solving[0]?.user?.id === currUser?.id &&
            data.solving[0]?.accept_status === SupporterReferAcceptEnum.ACCEPTED && (
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
                      sx: { zIndex: 5001 },
                      PaperProps: {
                        sx: { zIndex: 5001 },
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
          {data.status === ComplaintStatusEnum.PENDING && (
            <div className="flex gap-2">
              {data.status === ComplaintStatusEnum.PENDING && (
                <Button onClick={handleConfirm} variant="contained">
                  Start Solving
                </Button>
              )}
              <Button onClick={() => setOpenSupporters(true)} variant="contained">
                Assign To Supporter
              </Button>
            </div>
          )}

          {openSupporters && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 justify-center">
                <TextField
                  className={`w-full`}
                  value={assignData.note}
                  onChange={(e) => setAssignData({ ...assignData, note: e.target.value })}
                  variant={"filled"}
                  label={"Note for supporter"}
                />
                <TextField
                  className={`w-full`}
                  value={assignData.max_time_to_solve}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      max_time_to_solve: isNaN(Number(e.target.value))
                        ? assignData.max_time_to_solve
                        : e.target.value,
                    })
                  }
                  variant={"filled"}
                  label={"Complaint max time"}
                />
              </div>
              <h1 className="font-[600] text-md text-black">Supporters</h1>
              <UsersTable
                data={supporters}
                managerForm={{
                  closeForm,
                  complaint_id: data.id,
                  note: assignData.note.trim() === "" ? undefined : assignData.note,
                  max_time_to_solve:
                    assignData.max_time_to_solve.trim() === ""
                      ? undefined
                      : Number(assignData.max_time_to_solve),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
