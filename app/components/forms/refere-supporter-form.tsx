"use client";
import { getDir } from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { useEffect, useState } from "react";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_USERS, REFER_SUPPORTER } from "@/app/utils/requests-hub/supporters-reqs";
import { useRouter } from "next/navigation";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import UsersSelectTable from "../tables/users-select-table";
import { selectCurrentUserId } from "@/app/utils/store/slices/user-slice";
import { selectPopup } from "@/app/utils/store/slices/popup-slice";
import { Button } from "@mui/material";

export default function RefereToSupporter() {
  const router = useRouter();
  const [supporters, setSupporters] = useState<UserInterface[]>([]);
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const fetchSupporters = async () => {
    if (supporters.length > 0) return;
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
      roleAttributes: JSON.stringify(["assignable"]),
    });
    if (res.done) {
      setSupporters(res.data.users);
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchSupporters();
  }, []);
  const [loading, setLoading] = useState(false);
  const refereToSupporterPopup = useAppSelector((state) => selectPopup(state, "refereToSupporter"));
  const complaint_id = refereToSupporterPopup?.data?.complaint_id;
  const closeForm = refereToSupporterPopup?.data?.closeForm;
  const refetchComplaints = refereToSupporterPopup?.data?.refetchComplaints;
  const supporter_id = refereToSupporterPopup?.data?.user_id;
  const handleRefer = async () => {
    if (loading) return;
    if (!supporter_id || supporter_id?.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select supporter to refere");
      return;
    }
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(REFER_SUPPORTER, {
      complaint_id: complaint_id,
      supporter_id,
    });
    setLoading(false);
    if (res.done) {
      closeForm();
      handleOpenSnakeBar(
        SnakeBarTypeEnum.SUCCESS,
        "Successfully refered complaint to another supporter"
      );
      await refetchComplaints();
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res?.message);
    }
  };
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).assignPopup;
  const currUserId = useAppSelector((state) => selectCurrentUserId(state));
  return (
    <div dir={getDir(lang)} className="w-2xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit pb-2">{trans.referTitle}</h1>
      <div className="w-full max-h-[calc(100dvh-200px)] flex items-center flex-col">
        <div className="w-full">
          <UsersSelectTable
            data={supporters.filter((e) => e.id !== currUserId)}
            type={"refereToSupporter"}
          />
        </div>
        <Button onClick={handleRefer} className="!mt-3" variant="contained">
          {trans.referBtn}
        </Button>
      </div>
    </div>
  );
}
