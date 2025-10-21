"use client";
import { ScreenViewer } from "@/app/utils/base";
import { ScreenViewerEnum } from "@/app/utils/enums/screen-viewer.enum";
import { COLLECTOR_REQ, getCookie } from "@/app/utils/requests/refresh-token-req";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function ClientComplaintForm({ closeForm }: { closeForm: () => void }) {
  const [data, setData] = useState({
    full_name: "",
    phone: "+20",
    title: "",
    details: "",
    screen_viewer: ScreenViewerEnum.ANYDESK,
    screen_viewer_id: "",
    screen_viewer_password: "",
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
  const vaildation = () => {
    const {
      full_name,
      phone,
      title,
      details,
      screen_viewer,
      screen_viewer_id,
      screen_viewer_password,
    } = data;
    if (full_name.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Name must be more than 3 character");
      return false;
    }
    if (phone.trim().length !== 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
      return false;
    }
    if (title.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Title must be more than 3 character");
      return false;
    }
    if (details.trim().length < 15) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Details must be more than 14 character");
      return false;
    }
    if (screen_viewer_id.trim().length < 9) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Viewer id must be more than 8 character");
      return false;
    }
    if (
      screen_viewer !== ScreenViewerEnum.ANYDESK &&
      (screen_viewer_password.trim().length < 5 || screen_viewer_password.trim().length > 9)
    ) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "Password length must be between 4 and 8 character"
      );
      return false;
    }
    return true;
  };
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: typeof data) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (res) => {
      closeForm();
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Created complaint successfully");
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data.message);
    },
  });
  const handleConfirm = async () => {
    if (isPending) return;
    if (!vaildation()) return;
    await COLLECTOR_REQ(mutateAsync, data);
  };
  return (
    <div className="w-md bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">Create New Complaint</h1>
      <div className="w-full my-[15px] flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <TextField
            className={`w-full`}
            value={data.full_name}
            onChange={(e) => handleData("full_name", e.target.value)}
            variant={"filled"}
            label={"Name"}
          />
          <TextField
            className={`w-full`}
            value={data.phone}
            onChange={(e) =>
              handleData(
                "phone",
                e.target.value.slice(0, 3) === "+20"
                  ? isNaN(Number(e.target.value.slice(3)))
                    ? data.phone
                    : e.target.value
                  : data.phone
              )
            }
            variant={"filled"}
            label={"Phone Number"}
          />
        </div>
        <TextField
          className={`w-full`}
          value={data.title}
          onChange={(e) => handleData("title", e.target.value)}
          variant={"filled"}
          label={"Title"}
        />
        <TextField
          className={`w-full`}
          value={data.details}
          onChange={(e) => handleData("details", e.target.value)}
          variant={"filled"}
          multiline
          rows={4}
          label={"Details"}
        />
        <div className="flex gap-2.5">
          <FormControl fullWidth>
            <InputLabel id="select-label4">Viewer</InputLabel>
            <Select
              labelId="select-label4"
              value={data.screen_viewer}
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
            value={data.screen_viewer_id}
            onChange={(e) => handleData("screen_viewer_id", e.target.value)}
            variant={"filled"}
            label={"Viewer Id"}
          />
        </div>
        {data.screen_viewer !== ScreenViewerEnum.ANYDESK ? (
          <TextField
            className={`w-full`}
            value={data.screen_viewer_password}
            onChange={(e) => handleData("screen_viewer_password", e.target.value)}
            variant={"filled"}
            label={"Password"}
          />
        ) : (
          ""
        )}
      </div>
      <Button onClick={handleConfirm} variant="contained">
        Confirm Complaint
      </Button>
    </div>
  );
}
