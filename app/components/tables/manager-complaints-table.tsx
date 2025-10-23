"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { ClientComplaintInterface } from "@/app/utils/interfaces/clients.interface";
import { checkNull, ComplaintStatusViewer, formatDate, ScreenViewer } from "@/app/utils/base";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";

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
  return (
    <div>
      <MainTable
        columns={columns}
        rows={formateData}
        onRowClick={(data) => {
          dispatch(openPopup({ popup: popup as any, data }));
        }}
      />
    </div>
  );
}

const columns: TableColumnInterface[] = [
  { id: "index", label: "#" },
  { id: "user.user_name", label: "Company" },
  { id: "full_name", label: "User" },
  { id: "phone", label: "Phone" },
  { id: "title", label: "Title", minWidth: 140 },
  {
    id: "details",
    label: "Details",
    minWidth: 290,
  },
  {
    id: "status",
    label: "Status",
    render: (row) => <ComplaintStatusViewer status={row.status} />,
  },
  {
    id: "screen_viewer",
    label: "Screen Viewer",
    render: (row) => <ScreenViewer viewer={row.screen_viewer} />,
  },
  {
    id: "screen_viewer_id",
    label: "Viewer Id",
  },
  {
    id: "screen_viewer_password",
    label: "Viewer Password",
  },
  {
    id: "start_solve_at",
    label: "Working At",
    minWidth: 150,
  },

  {
    id: "created_at",
    label: "Created At",
    minWidth: 150,
  },
];
