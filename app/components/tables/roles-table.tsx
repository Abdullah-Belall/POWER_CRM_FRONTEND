"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { formatDate } from "@/app/utils/base";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { RoleInterface } from "@/app/utils/interfaces/common.interface";

export default function ManagerRolesTable({ data }: { data: RoleInterface[] }) {
  const dispatch = useAppDispatch();
  const formateData = data?.map((e) => ({
    ...e,
    created_at: formatDate(e.created_at),
    updated_at: formatDate(e.updated_at),
  }));
  return (
    <div>
      <MainTable
        columns={columns}
        rows={formateData}
        onRowClick={(data) => {
          dispatch(openPopup({ popup: "roleUsers", data }));
        }}
      />
    </div>
  );
}

const columns: TableColumnInterface[] = [
  { id: "code", label: "Code" },
  { id: "name", label: "Name" },
  { id: "usersCount", label: "Users Count" },
  {
    id: "created_at",
    label: "Created At",
    minWidth: 150,
  },
];
