"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { ClientComplaintInterface } from "@/app/utils/interfaces/clients.interface";
import { checkNull, ComplaintStatusViewer, formatDate } from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function ClientComplaintsTable({ data }: { data: ClientComplaintInterface[] }) {
  const dispatch = useAppDispatch();
  const formateData = data?.map((e) => ({
    ...e,
    created_at: formatDate(e.created_at),
    start_solve_at: e.start_solve_at ? formatDate(e.start_solve_at) : "-",
    details: e.details?.slice(0, 80) + "...",
    screen_viewer_password: checkNull(e.screen_viewer_password, "-"),
  }));
  const trans = useAppSelector(getPageTrans("clientsComplaintsPage")).table;

  const columns: TableColumnInterface[] = [
    { id: "index", label: "#" },
    { id: "full_name", label: trans[0] },
    { id: "phone", label: trans[1] },
    { id: "title", label: trans[2], minWidth: 140 },
    {
      id: "details",
      label: trans[3],
      minWidth: 290,
    },
    {
      id: "status",
      label: trans[4],
      render: (row) => <ComplaintStatusViewer status={row.status} />,
    },
    {
      id: "created_at",
      label: trans[5],
      minWidth: 150,
    },
  ];
  return (
    <div>
      <MainTable
        columns={columns}
        rows={formateData}
        onRowClick={(row) =>
          dispatch(
            openPopup({
              popup: "clientComplaintDetails",
              data: row,
            })
          )
        }
      />
    </div>
  );
}

// ,
//   {
//     id: "screen_viewer",
//     label: "Screen Viewer",
//     render: (row) => <ScreenViewer viewer={row.screen_viewer} />,
//   },
//   {
//     id: "screen_viewer_id",
//     label: "Viewer Id",
//   },
//   {
//     id: "screen_viewer_password",
//     label: "Viewer Password",
//   },
//   {
//     id: "start_solve_at",
//     label: "Working At",
//     minWidth: 150,
//   },
