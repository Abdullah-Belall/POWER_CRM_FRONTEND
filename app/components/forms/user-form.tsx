"use client";
import { RoleInterface } from "@/app/utils/interfaces/common.interface";
import { getManagersRolesSelectList } from "@/app/utils/requests/managers-requests";
import { COLLECTOR_REQ, getCookie } from "@/app/utils/requests/refresh-token-req";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserForm({
  closeForm,
  initialData,
}: {
  closeForm: () => void;
  initialData?: { user_name: string; role_id: string; user_id: string };
}) {
  const [data, setData] = useState({
    user_name: initialData?.user_name || "",
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
    const { role_id, user_name, password } = data;

    if (user_name.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "User Name must be more than 3 character");
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
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: typeof data) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create`,
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
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Created new user successfully");
      queryClient.invalidateQueries({ queryKey: ["manager-all-users"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data.message);
    },
  });
  const roleSelectList = useQuery({
    queryKey: ["roles-select-list"],
    queryFn: async () => {
      const result = await getManagersRolesSelectList();
      return result.data;
    },
  });
  useEffect(() => {
    if (roleSelectList.data) {
      setRoles(roleSelectList.data);
    }
  }, [roleSelectList.data]);
  const handleConfirm = async () => {
    if (isPending) return;
    if (!vaildation()) return;
    await COLLECTOR_REQ(mutateAsync, data);
  };
  return (
    <div className="w-md bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit">
        {initialData ? "Update" : "Create New"} User
      </h1>
      <div className="w-full my-[15px] flex flex-col gap-2.5">
        <TextField
          className={`w-full`}
          value={data.user_name}
          onChange={(e) => handleData("user_name", e.target.value)}
          variant={"filled"}
          label={"User Name"}
        />
        {!initialData && (
          <TextField
            className={`w-full`}
            value={data.password}
            onChange={(e) => handleData("password", e.target.value)}
            variant={"filled"}
            label={"Password"}
          />
        )}
        <FormControl fullWidth className="!text-darkgreen">
          <InputLabel id="select-label2">Role</InputLabel>
          <Select
            labelId="select-label2"
            value={data.role_id || ""}
            onChange={(e) => handleData("role_id", e.target.value)}
            className="!text-darkgreen !font-[600]"
            label="Role"
            MenuProps={{
              sx: { zIndex: 5001 },
              PaperProps: {
                sx: { zIndex: 5001 },
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
            {roles.map((e) => (
              <MenuItem key={e.id} className="hover:bg-xlightgreen! !font-[600]" value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Button disabled={!!initialData} onClick={handleConfirm} variant="contained">
        Confirm
      </Button>
    </div>
  );
}
