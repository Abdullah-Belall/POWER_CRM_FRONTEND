"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import UsersTable from "../tables/users-table";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_USERS } from "@/app/utils/requests-hub/supporters-reqs";
import { useRouter } from "next/navigation";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import UsersSelectTable from "../tables/users-select-table";
import { getDir } from "@/app/utils/base";
import { ASSIGN_SUPPORTER } from "@/app/utils/requests-hub/managers-reqs";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";

export default function AssignToSupporter() {
  const router = useRouter();
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
  const [assignData, setAssignData] = useState({
    note: "",
    max_time_to_solve: "",
  });
  const dispatch = useAppDispatch();
  const [supporters, setSupporters] = useState<UserInterface[]>([]);
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).assignPopup;
  const lang = useAppSelector(getCurrLang());
  const assignSupporterPopup = useAppSelector((state) => selectPopup(state, "assignSupporter"));
  const closeForm = assignSupporterPopup?.data?.closeForm;
  const complaint_id = assignSupporterPopup?.data?.complaint_id;
  const refetchComplaints = assignSupporterPopup?.data?.refetchComplaints;
  const supporter_id = assignSupporterPopup?.data?.user_id;

  const vaildation = () => {
    if (!supporter_id || supporter_id.length < 0) {
      dispatch(
        openSnakeBar({
          message: "Select Supporter to assign",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      return false;
    }
    return true;
  };

  const handleAssign: any = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(ASSIGN_SUPPORTER, {
      data: {
        supporter_id,
        complaint_id,
        note: assignData?.note?.trim().length > 0 ? assignData?.note?.trim() : undefined,
        max_time_to_solve:
          assignData?.max_time_to_solve?.trim().length > 0
            ? assignData?.max_time_to_solve?.trim()
            : undefined,
      },
    });
    setLoading(false);
    if (res.done) {
      closeForm();
      dispatch(
        openSnakeBar({
          message: "Successfully assigned complaint to the supporter",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      await refetchComplaints();
    } else {
      dispatch(
        openSnakeBar({
          message: res?.message,
          type: SnakeBarTypeEnum.ERROR,
        })
      );
    }
  };
  return (
    <div dir={getDir(lang)} className="w-2xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit pb-2">{trans.title}</h1>
      <div className="w-full max-h-[calc(100dvh-200px)] overflow-x-hidden">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 justify-center">
            <TextField
              className={`w-full`}
              value={assignData.note}
              onChange={(e) => setAssignData({ ...assignData, note: e.target.value })}
              variant={"filled"}
              label={trans.noteFSupporter}
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
              label={trans.maxTime}
            />
          </div>
          <UsersSelectTable data={supporters} type={"assignSupporter"} />
          <Button onClick={handleAssign} className="!mx-auto !mt-3" variant="contained">
            {trans.btn}
          </Button>
        </div>
      </div>
    </div>
  );
}
