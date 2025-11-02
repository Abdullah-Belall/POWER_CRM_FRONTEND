"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useState } from "react";
import ManagerComplaintsTable from "../../tables/manager-complaints-table";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../../common/black-layer/black-layer";
import ManagerComplaintForm from "../../forms/manager-complaint-form";
import { ManagerComplaintInterface } from "@/app/utils/interfaces/manager.interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { MANAGERS_COMPLAINTS } from "@/app/utils/requests-hub/managers-reqs";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import CreateComplaintForClient from "../../forms/create-complaint-for-client";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { fillTable, getTable } from "@/app/utils/store/slices/tables-data-slice";

export default function ManagersComplaintsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const managerComplaintDetails = useAppSelector((state) =>
    selectPopup(state, "managerComplaintDetails")
  );
  const createComplaintForClient = useAppSelector((state) =>
    selectPopup(state, "createComplaintForClient")
  );
  const { data } = useAppSelector(getTable("managerComplaintsTable"));
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(MANAGERS_COMPLAINTS);
    if (res.done) {
      dispatch(
        fillTable({
          tableName: "managerComplaintsTable",
          obj: {
            total: res.data?.total,
            data: res.data?.complaints,
          },
        })
      );
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const trans = useAppSelector(getPageTrans("managersComplaintsPage"));

  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-full flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <Button
              onClick={() =>
                dispatch(
                  openPopup({
                    popup: "createComplaintForClient",
                    data: { refetch: fetchData },
                  })
                )
              }
              variant="contained"
            >
              {trans.btn}
            </Button>
          </div>
          <ManagerComplaintsTable data={data} popup={"managerComplaintDetails"} />
        </div>
      </div>
      {createComplaintForClient.isOpen && (
        <BlackLayer
          onClick={() => {
            dispatch(
              closePopup({
                popup: "createComplaintForClient",
              })
            );
            dispatch(
              closePopup({
                popup: "selectClientForCreateComplaint",
              })
            );
          }}
        >
          <CreateComplaintForClient
            closeForm={() => {
              dispatch(
                closePopup({
                  popup: "createComplaintForClient",
                })
              );
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
      {managerComplaintDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "managerComplaintDetails" }))}>
          <ManagerComplaintForm
            closeForm={() => dispatch(closePopup({ popup: "managerComplaintDetails" }))}
            id={managerComplaintDetails.data?.id}
            refetchComplaints={fetchData}
          />
        </BlackLayer>
      )}
    </>
  );
}
const analytics = [
  {
    title: "Total Clients",
    value: "83",
    lastMonth: 10,
    onclick: () => "",
  },
  {
    title: "New Clients",
    value: "12",
    lastMonth: 15,
    onclick: () => "",
  },
  {
    title: "Complaints",
    value: "32",
    lastMonth: -10,
    onclick: () => "",
  },
  {
    title: "Opened Complaints",
    value: "3",
    lastMonth: -10,
    onclick: () => "",
  },
];
