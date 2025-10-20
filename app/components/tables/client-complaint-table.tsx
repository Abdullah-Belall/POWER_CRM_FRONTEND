"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { ComplaintStatusEnum } from "@/app/utils/enums/complaint-status-enum";
import { ScreenViewerEnum } from "@/app/utils/enums/screen-viewer.enum";
import { SiAnydesk, SiTeamviewer } from "react-icons/si";
import { ComplaintStatusViewer, ScreenViewer } from "@/app/utils/base";

export default function ClientComplaintsTable() {
  return (
    <div>
      <MainTable columns={columns} rows={rows} />
    </div>
  );
}
function createData(
  index: number,
  title: string,
  details: string,
  screen_viewer: any,
  screen_viewer_id: string,
  start_solve_at: string,
  status: any,
  created_at: string
) {
  return {
    index,
    title,
    details,
    screen_viewer,
    screen_viewer_id,
    start_solve_at,
    status,
    created_at,
  };
}
const columns: TableColumnInterface[] = [
  { id: "index", label: "#" },
  { id: "title", label: "Title" },
  {
    id: "details",
    label: "Details",
  },
  {
    id: "screen_viewer",
    label: "Screen Viewer",
  },
  {
    id: "screen_viewer_id",
    label: "Screen Viewer Id",
  },
  {
    id: "start_solve_at",
    label: "Working At",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "created_at",
    label: "Created At",
  },
];
const rows = [
  createData(
    1,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.ANYDESK} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.COMPLETED} />,
    "10:45 19/10/2025"
  ),
  createData(
    2,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.TEAMVIEWR} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.IN_PROGRESS} />,
    "10:45 19/10/2025"
  ),
  createData(
    3,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.ANYDESK} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.CLIENT_CANCELLED} />,
    "10:45 19/10/2025"
  ),
  createData(
    4,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.ULTRAVIEWER} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.SUSPENDED} />,
    "10:45 19/10/2025"
  ),
  createData(
    5,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.ANYDESK} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.PENDING} />,
    "10:45 19/10/2025"
  ),
  createData(
    6,
    "Payment Method",
    "my payment method is returning a error",
    <ScreenViewer viewer={ScreenViewerEnum.TEAMVIEWR} />,
    "15387714",
    "10:45 19/10/2025",
    <ComplaintStatusViewer status={ComplaintStatusEnum.CANCELLED} />,
    "10:45 19/10/2025"
  ),
];
