"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { ClientComplaintInterface } from "@/app/utils/interfaces/clients.interface";
import {
  checkNull,
  ComplaintPriorityStatusViewer,
  ComplaintStatusViewer,
  formatDate,
  ScreenViewer,
} from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function ManagerComplaintsTable({
  data,
  popup,
}: {
  data: ClientComplaintInterface[];
  popup: string;
}) {
  const dispatch = useAppDispatch();
  const formateData = data?.map((e) => ({
    ...e,
    created_at: formatDate(e.created_at),
    start_solve_at: e.start_solve_at ? formatDate(e.start_solve_at) : "-",
    details: e.details?.slice(0, 80) + "...",
    screen_viewer_password: checkNull(e.screen_viewer_password, "-"),
  }));
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).table;

  const columns: TableColumnInterface[] = [
    { id: "index", label: "#" },
    { id: "client.user_name", label: trans[0] },
    { id: "full_name", label: trans[1] },
    { id: "phone", label: trans[2] },
    { id: "title", label: trans[3], minWidth: 140 },
    {
      id: "details",
      label: trans[4],
      minWidth: 290,
    },
    {
      id: "status",
      label: trans[5],
      render: (row) => <ComplaintStatusViewer status={row.status} />,
    },
    {
      id: "priority_status",
      label: trans[6],
      render: (row) => <ComplaintPriorityStatusViewer status={row.priority_status} />,
    },
    {
      id: "start_solve_at",
      label: trans[7],
      minWidth: 150,
    },

    {
      id: "created_at",
      label: trans[8],
      minWidth: 150,
    },
  ];
  return (
    <div>
      <MainTable
        columns={columns}
        rows={formateData}
        onRowClick={(data) => {
          dispatch(openPopup({ popup: popup as any, data }));
        }}
        hieght={popup === "supporterReferResponse" ? "h-fit max-h-[calc(100dvh-200px)]" : undefined}
      />
    </div>
  );
}
