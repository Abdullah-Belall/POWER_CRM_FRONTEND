"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { checkNull, formatDate } from "@/app/utils/base";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { UserInterface } from "@/app/utils/interfaces/user-interface";

export default function AllUsersTable({ data, popup }: { data: UserInterface[]; popup: string }) {
  const dispatch = useAppDispatch();
  const formateData = data?.map((e) => ({
    ...e,
    created_at: formatDate(e.created_at),
    email: checkNull(e.email, "-"),
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
  { id: "user_name", label: "User Name" },
  { id: "email", label: "Email" },
  { id: "role.name", label: "Role" },
  { id: "complaints_count", label: "Complaints Count" },
  { id: "solving_count", label: "Solving Count" },
  {
    id: "created_at",
    label: "Created At",
    minWidth: 150,
  },
];
