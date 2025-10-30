"use client";
import { getDir, ScreenViewer } from "@/app/utils/base";
import { ScreenViewerEnum } from "@/app/utils/enums/screen-viewer.enum";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import { handleUpload } from "../common/cloudinary/cloudinary-reqs";
import { RiUploadCloud2Line } from "react-icons/ri";
import { selectCurrentUserId } from "@/app/utils/store/slices/user-slice";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";

export default function ClientComplaintForm({
  initialData,
  onDone,
}: {
  closeForm: () => void;
  initialData?: {
    full_name: string;
    phone: string;
    title: string;
    details: string;
    screen_viewer: ScreenViewerEnum;
    screen_viewer_id: string;
    screen_viewer_password: string;
    server_viewer: ScreenViewerEnum;
    server_viewer_id: string;
    server_viewer_password: string;
    intervention_date: Date | string | Dayjs | null;
    image1: string;
    image2: string;
  };
  onDone?: (data: any) => Promise<void>;
}) {
  let initialDate: Dayjs | null = null;
  let initialTime: PickerValue | null = null;
  if (initialData?.intervention_date) {
    let dateObj: Dayjs | null = null;
    if (initialData.intervention_date instanceof Date) {
      dateObj = dayjs(initialData.intervention_date);
    } else if (typeof initialData.intervention_date === "string") {
      dateObj = dayjs(initialData.intervention_date);
    } else {
      dateObj = initialData.intervention_date as Dayjs;
    }
    initialDate = dateObj;
    initialTime = dateObj;
  }

  const [data, setData] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "+20",
    title: initialData?.title || "",
    details: initialData?.details || "",
    screen_viewer: initialData?.screen_viewer || ScreenViewerEnum.ANYDESK,
    screen_viewer_id: initialData?.screen_viewer_id || "",
    screen_viewer_password: initialData?.screen_viewer_password || "",
    server_viewer: initialData?.server_viewer || "",
    server_viewer_id: initialData?.server_viewer_id || "",
    server_viewer_password: initialData?.server_viewer_password || "",
    intervention_date: initialDate,
    image1: initialData?.image1 || "",
    image2: initialData?.image2 || "",
  });
  const [time, setTime] = useState<PickerValue | null>(initialTime);
  const userId = useAppSelector((state) => selectCurrentUserId(state));
  const [imgLoading, setImageLoading] = useState(false);
  const imgEle = useRef<any>(null);
  const imgEle2 = useRef<any>(null);
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("clientsComplaintsPage")).popup;
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

      server_viewer,
      server_viewer_id,
      server_viewer_password,

      intervention_date,
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
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Screen Viewer id must be more than 8 character");
      return false;
    }
    if (
      screen_viewer !== ScreenViewerEnum.ANYDESK &&
      (screen_viewer_password.trim().length < 5 || screen_viewer_password.trim().length > 9)
    ) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "Screen Viewer Password length must be between 4 and 8 character"
      );
      return false;
    }
    if (server_viewer) {
      if (server_viewer_id.trim().length < 9) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "Server Viewer id must be more than 8 character"
        );
        return false;
      }
      if (
        server_viewer !== ScreenViewerEnum.ANYDESK &&
        (server_viewer_password.trim().length < 5 || server_viewer_password.trim().length > 9)
      ) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "Server Viewer Password length must be between 4 and 8 character"
        );
        return false;
      }
    }
    if (!server_viewer && (server_viewer_id !== "" || server_viewer_password !== "")) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select server viewer");
      return false;
    }

    if (intervention_date && !time) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention time");
      return false;
    }
    if (!intervention_date && time) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention date");
      return false;
    }
    if (intervention_date) {
      const now = dayjs();

      if (intervention_date.isBefore(now, "day")) {
        handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Intervention date cannot be in the past");
        return false;
      }

      if (time && typeof time !== "string" && typeof time !== "number") {
        const combinedDateTime = intervention_date
          .hour(time.hour())
          .minute(time.minute())
          .second(0)
          .millisecond(0);

        const oneHourLater = now.add(1, "hour");
        if (combinedDateTime.isBefore(oneHourLater)) {
          handleOpenSnakeBar(
            SnakeBarTypeEnum.ERROR,
            "Intervention date and time must be at least 1 hour from now"
          );
          return false;
        }
      }
    }

    return true;
  };
  const [isPending, setIsPending] = useState(false);
  const handleConfirm = async () => {
    if (isPending) return;
    if (!vaildation()) return;
    let image1 = "";
    let image2 = "";
    if (imgEle.current?.files?.[0]) {
      image1 = await handleUpload(
        { target: { files: [imgEle.current?.files[0]] } },
        "Complaints/saved"
      );
    }
    if (imgEle2.current?.files?.[0]) {
      image2 = await handleUpload(
        { target: { files: [imgEle2.current?.files[0]] } },
        "Complaints/saved"
      );
    }

    // Combine date and time into a single datetime
    let combinedDateTime: Date | null = null;
    if (data.intervention_date && time && typeof time !== "string" && typeof time !== "number") {
      // Both date and time are Dayjs objects, combine them
      combinedDateTime = data.intervention_date
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .millisecond(0)
        .toDate();
    }

    setIsPending(true);
    if (!onDone) return;
    await onDone({
      ...data,
      intervention_date: combinedDateTime,
      client_id: userId,
      image1: image1 === "" ? undefined : image1,
      image2: image2 === "" ? undefined : image2,
      server_viewer: (data.server_viewer as any) === "" ? undefined : data.server_viewer,
      server_viewer_id: data.server_viewer_id === "" ? undefined : data.server_viewer_id,
      server_viewer_password:
        data.server_viewer_password === "" ? undefined : data.server_viewer_password,
    });
    setIsPending(false);
  };

  return (
    <div dir={getDir(lang)} className="w-2xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">
        {initialData ? trans.title[1] : trans.title}
      </h1>
      <div className="w-full flex flex-col items-center max-h-[calc(100dvh-200px)] overflow-y-scroll">
        <div className="w-full my-[15px] px-1 flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <TextField
              className={`w-full`}
              value={data.full_name}
              onChange={(e) => handleData("full_name", e.target.value)}
              variant={"filled"}
              label={trans?.inputs.name}
              disabled={!!initialData}
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
              label={trans?.inputs.phone}
              disabled={!!initialData}
            />
          </div>
          <TextField
            className={`w-full`}
            value={data.title}
            onChange={(e) => handleData("title", e.target.value)}
            variant={"filled"}
            label={trans?.inputs.title}
            disabled={!!initialData}
          />
          <TextField
            className={`w-full`}
            value={data.details}
            onChange={(e) => handleData("details", e.target.value)}
            variant={"filled"}
            multiline
            rows={4}
            label={trans?.inputs.details}
            disabled={!!initialData}
          />
          <div className="flex gap-2.5">
            <FormControl fullWidth disabled={!!initialData}>
              <InputLabel id="select-label4">{trans?.inputs.screenViewer}</InputLabel>
              <Select
                labelId="select-label4"
                value={data.screen_viewer}
                label={trans?.inputs.screenViewer}
                onChange={(e) => handleData("screen_viewer", e.target.value)}
                MenuProps={{
                  sx: { zIndex: 999999 },
                  PaperProps: {
                    sx: { zIndex: 999999 },
                  },
                  container: typeof window !== "undefined" ? document.body : undefined,
                }}
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
              label={trans?.inputs.viewerId}
              disabled={!!initialData}
            />
          </div>{" "}
          {data.screen_viewer !== ScreenViewerEnum.ANYDESK ? (
            <TextField
              className={`w-full`}
              value={data.screen_viewer_password}
              onChange={(e) => handleData("screen_viewer_password", e.target.value)}
              variant={"filled"}
              label={trans?.inputs.password}
            />
          ) : (
            ""
          )}
          <div className="flex gap-2.5">
            <FormControl fullWidth disabled={!!initialData}>
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
              disabled={!!initialData}
            />
          </div>
          {(data.server_viewer as any) !== "" && data.server_viewer !== ScreenViewerEnum.ANYDESK ? (
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
                    value={data.intervention_date as any}
                    minDate={dayjs()}
                    slotProps={{
                      popper: {
                        sx: { zIndex: 99999999999 },
                      },
                      textField: {
                        disabled: !!initialData,
                      },
                    }}
                  />
                  <TimePicker
                    className="w-full"
                    value={time}
                    onChange={(newValue) => setTime(newValue)}
                    slotProps={{
                      popper: {
                        sx: { zIndex: 99999999999 },
                      },
                      textField: {
                        disabled: !!initialData,
                      },
                    }}
                  />
                </div>
              </DemoItem>
            </LocalizationProvider>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <label
              htmlFor="dropzone-file"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full h-[210px] border-2 border-gray-300 border-dashed rounded-md cursor-pointer text-darkgreen hover:border-darkgreen duration-200"
            >
              <Image
                className={data.image1 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data.image1}`}
                alt="Post Image"
              />
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  data.image1 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">{trans?.inputs.img[0]}</span>{" "}
                  {trans?.inputs.img[1]}
                </p>
                <p className="text-xs">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                ref={imgEle}
                disabled={!!initialData}
                onChange={async (e) => {
                  if (imgLoading) return;
                  setImageLoading(true);
                  const saved = await handleUpload(e, "Complaints/temporary");
                  handleData("image1", saved);
                  setImageLoading(false);
                }}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </label>
            <label
              htmlFor="dropzone-file1"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full h-[210px] border-2 border-gray-300 border-dashed rounded-md cursor-pointer text-darkgreen hover:border-darkgreen duration-200"
            >
              <Image
                className={data.image2 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data.image2}`}
                alt="Post Image"
              />
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  data.image2 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">{trans?.inputs.img[0]}</span>{" "}
                  {trans?.inputs.img[1]}
                </p>
                <p className="text-xs">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                ref={imgEle2}
                onChange={async (e) => {
                  if (imgLoading) return;
                  setImageLoading(true);
                  const saved = await handleUpload(e, "Complaints/temporary");
                  handleData("image2", saved);
                  setImageLoading(false);
                }}
                id="dropzone-file1"
                type="file"
                className="hidden"
                disabled={!!initialData}
              />
            </label>
          </div>
        </div>
        {!initialData ? (
          <Button
            disabled={imgLoading}
            onClick={handleConfirm}
            className="!mx-auto"
            variant="contained"
          >
            {trans?.inputs.btn}
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
