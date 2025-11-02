"use client";
import { RoleInterface } from "@/app/utils/interfaces/common.interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_ROLES_SELECT_LIST, UPLOAD_USERS_EXCEL } from "@/app/utils/requests-hub/managers-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadUserExcelFile() {
  const [data, setData] = useState<{
    file: File | null;
    role_id: string;
  }>({
    file: null,
    role_id: "",
  });
  const uploadUserExcelFile = useAppSelector((state) => selectPopup(state, "uploadUserExcelFile"));
  const handleData = (key: keyof typeof data, value: string | File | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const handleSubmit = async () => {
    if (loading) return;
    if (data.role_id.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "الرجاء تحديد نوع المستخدمين");
      return;
    }
    if (!data.file) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "الرجاء اختيار ملف");
      return;
    }

    const validExcelExtensions = [".xlsx", ".xls"];
    const fileExtension = data.file.name.toLowerCase().substring(data.file.name.lastIndexOf("."));

    if (!validExcelExtensions.includes(fileExtension)) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "الرجاء اختيار ملف Excel فقط (.xlsx, .xls, .xlsm, .xlsb)"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", data.file);
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(UPLOAD_USERS_EXCEL, {
      data: formData,
      role_id: data.role_id,
    });
    setLoading(false);
    if (res.done) {
      uploadUserExcelFile.data?.refetchUsers();
      dispatch(
        closePopup({
          popup: "uploadUserExcelFile",
        })
      );
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "تم رفع الملف واستيراد البيانات بنجاح");
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };

  const [roles, setRoles] = useState<RoleInterface[]>([]);
  useEffect(() => {
    const fetchRoles = async () => {
      const res = await CLIENT_COLLECTOR_REQ(GET_ROLES_SELECT_LIST);
      if (res.done) {
        setRoles(res.data.roles);
      }
    };
    fetchRoles();
  }, []);
  return (
    <div className="w-xs bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit pb-2">رفع ملف Excel</h1>
      <div className="w-full mb-2 flex gap-2">
        <FormControl fullWidth className="!text-darkgreen">
          <InputLabel id="select-label2">Role</InputLabel>
          <Select
            labelId="select-label2"
            value={roles.find((e) => e.id === data.role_id)?.id || ""}
            onChange={(e) => handleData("role_id", e.target.value as string)}
            className="!text-lightgreen !font-[600]"
            label={"Role"}
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
            {roles?.map((e) => (
              <MenuItem key={e.id} className="hover:bg-xlightgreen! !font-[600]" value={e.id}>
                {e.code} {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          component="label"
          className="!bg-transparent !text-black !border !border-black !w-full !flex !items-center !justify-between"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<IoMdCloudUpload className="text-black" />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept=".xlsx,.xls,.xlsm,.xlsb,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={(event) => handleData("file", event.target.files?.[0] || null)}
            multiple
          />
        </Button>
      </div>
      <Button onClick={handleSubmit} disabled={loading} variant="contained">
        {loading ? "Loading..." : "Upload and Import Data"}
      </Button>
    </div>
  );
}
