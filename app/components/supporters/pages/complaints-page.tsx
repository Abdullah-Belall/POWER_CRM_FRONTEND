"use client";
import ActiveComplaints from "@/app/components/clients/complaints/active-complaints";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { fillAnalytics } from "@/app/utils/store/slices/analytics-slice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ManagerComplaintsTable from "../../tables/manager-complaints-table";
import { getManagersComplaints } from "@/app/utils/requests/managers-requests";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../../common/black-layer/black-layer";
import ManagerComplaintForm from "../../forms/manager-complaint-form";
import { getSupportersComplaints } from "@/app/utils/requests/supporter-requests";
import SupporterComplaintForm from "../../forms/supporter-complaint-form";

export default function SupportersComplaintsPage() {
  const dispatch = useAppDispatch();
  const supporterComplaintDetails = useAppSelector((state) =>
    selectPopup(state, "supporterComplaintDetails")
  );
  useEffect(() => {
    dispatch(fillAnalytics({ analytics, chart }));
  }, []);
  const { data } = useQuery({
    queryKey: ["supporter-complaints"],
    queryFn: async () => {
      const result = await getSupportersComplaints();
      return result.data;
    },
  });
  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-[80%] flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-black">All Complaints</h1>
              <p className="font-[300] text-[#888] text-xs">Dashboard Drill-down</p>
            </div>
          </div>
          <ManagerComplaintsTable data={data?.complaints} popup={"supporterComplaintDetails"} />
        </div>
        <div className="w-[20%]">
          <ActiveComplaints />
        </div>
      </div>
      {supporterComplaintDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "supporterComplaintDetails" }))}>
          <SupporterComplaintForm
            closeForm={() => dispatch(closePopup({ popup: "supporterComplaintDetails" }))}
            id={supporterComplaintDetails.data?.id}
          />
        </BlackLayer>
      )}
    </>
  );
}
const chart = [
  { month: "Jan", col1: 2.5, col2: 3.0, col3: 2.8 },
  { month: "Feb", col1: 1.8, col2: 2.4, col3: 2.1 },
  { month: "Mar", col1: 2.9, col2: 3.2, col3: 2.7 },
  { month: "Apr", col1: 1.2, col2: 1.9, col3: 1.5 },
  { month: "May", col1: 3.1, col2: 2.7, col3: 3.3 },
  { month: "Jun", col1: 2.0, col2: 2.3, col3: 2.6 },
  // { month: "Jul", col1: 2.8, col2: 3.1, col3: 2.9 },
  // { month: "Aug", col1: 1.9, col2: 2.2, col3: 2.0 },
  // { month: "Sep", col1: 2.3, col2: 2.8, col3: 2.5 },
  // { month: "Oct", col1: 2.7, col2: 3.0, col3: 3.2 },
  // { month: "Nov", col1: 1.5, col2: 1.9, col3: 2.1 },
  // { month: "Dec", col1: 2.2, col2: 2.6, col3: 2.9 },
];
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
