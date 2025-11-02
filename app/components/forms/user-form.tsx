"use client";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_ROLES_SELECT_LIST } from "@/app/utils/requests-hub/managers-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function UserForm({
  initialData,
  onConfirm,
}: {
  closeForm: () => void;
  initialData?: {
    user_name: string;
    email: string;
    phone: string;
    role_id: string;
    user_id: string;
  };
  onConfirm: (data: any) => Promise<void>;
}) {
  const [data, setData] = useState({
    user_name: initialData?.user_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "+20",
    password: "",
    role_id: initialData?.role_id || "",
  });
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
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
    const { role_id, user_name, phone, email, password } = data;

    if (user_name.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "User Name must be more than 3 character");
      return false;
    }
    if (email.trim().length > 0) {
      const re =
        /^(?!.*\.\.)(?!\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,}$/;
      if (!re.test(email)) {
        handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild email address");
        return false;
      }
    }
    if (phone.trim() !== "+20" && phone.trim().length !== 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
      return false;
    }
    if (password.trim().length < 7) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Password must be more than 7 character");
      return false;
    }
    if (role_id.trim() === "") {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "You must pick role to confirm");
      return false;
    }
    return true;
  };
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_ROLES_SELECT_LIST);
    if (res.done) {
      setRoles(res.data.roles);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    await onConfirm({ data: { ...data, phone: data.phone === "+20" ? undefined : data.phone } });
    setLoading(false);
  };
  const trans = useAppSelector(getPageTrans("managersUsersPage")).popup;
  return (
    <div className="w-md bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">
        {initialData ? trans.title.update : trans.title.create}
      </h1>
      <div className="w-full px-1 my-[15px] flex flex-col gap-2.5">
        <TextField
          className={`w-full`}
          value={data.user_name}
          onChange={(e) => handleData("user_name", e.target.value)}
          variant={"filled"}
          label={trans.inputs.userName}
        />
        <TextField
          className={`w-full`}
          value={data.email}
          onChange={(e) => handleData("email", e.target.value)}
          variant={"filled"}
          label={trans.inputs.email}
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
          label={trans.inputs.phone}
        />
        {!initialData && (
          <TextField
            className={`w-full`}
            value={data.password}
            onChange={(e) => handleData("password", e.target.value)}
            variant={"filled"}
            label={trans.inputs.password}
          />
        )}
        {!initialData && (
          <FormControl fullWidth className="!text-darkgreen">
            <InputLabel id="select-label2">{trans.inputs.role}</InputLabel>
            <Select
              labelId="select-label2"
              value={data.role_id || ""}
              onChange={(e) => handleData("role_id", e.target.value)}
              className="!text-lightgreen !font-[600]"
              label={trans.inputs.role}
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
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <Button disabled={!!initialData} onClick={handleConfirm} variant="contained">
        Confirm
      </Button>
    </div>
  );
}
