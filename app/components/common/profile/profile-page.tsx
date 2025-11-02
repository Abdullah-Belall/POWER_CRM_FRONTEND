"use client";

import { CHANGE_PASSWORD, CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleData = (key: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  const user = useAppSelector((state) => selectCurrentUser(state));
  const trans = useAppSelector(getPageTrans("profile"));
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const vaildation = () => {
    const { old_password, new_password, confirm_new_password } = data;
    if (old_password.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please insert the current password to confirm");
      return false;
    }
    if (new_password.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please insert the new password to confirm");
      return false;
    }
    if (new_password.length < 8) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "New password must be more than 8 characters");
      return false;
    }
    if (new_password.trim() === "123456789") {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "New password cannot be this easy");
      return false;
    }
    if (new_password !== confirm_new_password) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "New Password and confirm new password must match"
      );
      return false;
    }
    return true;
  };
  const handleConfirm = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CHANGE_PASSWORD, {
      data: {
        old_password: data.old_password,
        new_password: data.new_password,
      },
    });
    setLoading(false);
    if (res.done) {
      router.push("/");
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };
  return (
    <section className="w-xl mx-auto p-3 rounded-xl bg-white w-full flex flex-col">
      <h1 className="font-bold mx-auto pb-2 text-xl">{trans.title}</h1>
      <div className="w-full flex flex-col gap-2.5">
        <TextField
          className={`w-full`}
          value={user?.user_name || ""}
          variant={"filled"}
          label={trans.user_name}
          disabled
        />
        <TextField
          className={`w-full`}
          value={data.old_password}
          onChange={(e) => handleData("old_password", e.target.value)}
          variant={"filled"}
          label={trans.passwordForm.oldPass}
          type="password"
        />
        <TextField
          className={`w-full`}
          value={data.new_password}
          onChange={(e) => handleData("new_password", e.target.value)}
          variant={"filled"}
          label={trans.passwordForm.newPass}
          type="password"
        />
        <TextField
          className={`w-full`}
          value={data.confirm_new_password}
          onChange={(e) => handleData("confirm_new_password", e.target.value)}
          variant={"filled"}
          label={trans.passwordForm.confirmNewPass}
          type="password"
        />
        <Button onClick={handleConfirm} className="!mx-auto" variant="contained">
          {trans.passwordForm.btn}
        </Button>
      </div>
    </section>
  );
}
