"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useState } from "react";
import ManagerComplaintsTable from "../../tables/manager-complaints-table";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../../common/black-layer/black-layer";
import SupporterComplaintForm from "../../forms/supporter-complaint-form";
import { ManagerComplaintInterface } from "@/app/utils/interfaces/manager.interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { SUPPORTERS_COMPLAINTS } from "@/app/utils/requests-hub/supporters-reqs";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import CreateComplaintForClient from "../../forms/create-complaint-for-client";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { resetDataSearch } from "@/app/utils/store/slices/search-slice";
import { MdOutlineRefresh } from "react-icons/md";

export default function SupportersComplaintsPage() {
  const router = useRouter();
  const [createComplaint, setCreateNewPopup] = useState(false);
  const [data, setData] = useState<ManagerComplaintInterface[]>([]);
  const dispatch = useAppDispatch();
  const supporterComplaintDetails = useAppSelector((state) =>
    selectPopup(state, "supporterComplaintDetails")
  );
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(SUPPORTERS_COMPLAINTS);
    console.log(res);
    if (res.done) {
      setData(res?.data?.complaints);
    } else {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(resetDataSearch());
  }, []);
  const trans = useAppSelector(getPageTrans("managersComplaintsPage"));
  const [refetchLoading, setRefetchLoading] = useState(false);
  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-full flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white pb-2">{trans.title}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (refetchLoading) return;
                  setRefetchLoading(true);
                  fetchData();
                  setRefetchLoading(false);
                }}
                className={`${
                  refetchLoading ? "animate-spin" : ""
                } cursor-pointer text-white text-2xl bg-lightgreen rounded-full px-1.5`}
              >
                <MdOutlineRefresh />
              </button>
              <Button onClick={() => setCreateNewPopup(true)} variant="contained">
                {trans.btn}
              </Button>
            </div>
          </div>
          <ManagerComplaintsTable data={data} popup={"supporterComplaintDetails"} />
        </div>
      </div>
      {supporterComplaintDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "supporterComplaintDetails" }))}>
          <SupporterComplaintForm
            closeForm={() => dispatch(closePopup({ popup: "supporterComplaintDetails" }))}
            id={supporterComplaintDetails.data?.id}
            refetchComplaints={fetchData}
          />
        </BlackLayer>
      )}
      {createComplaint && (
        <BlackLayer
          onClick={() => {
            setCreateNewPopup(false);
            dispatch(
              closePopup({
                popup: "selectClientForCreateComplaint",
              })
            );
          }}
        >
          <CreateComplaintForClient
            closeForm={() => {
              setCreateNewPopup(false);
              dispatch(
                closePopup({
                  popup: "selectClientForCreateComplaint",
                })
              );
            }}
            refetch={fetchData}
          />
        </BlackLayer>
      )}
    </>
  );
}
