"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { formatDate } from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { RoleInterface } from "@/app/utils/interfaces/common.interface";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function ManagerRolesTable({ data }: { data: RoleInterface[] }) {
  const dispatch = useAppDispatch();
  const trans = useAppSelector(getPageTrans("managersRolesPage")).table;

  const columns: TableColumnInterface[] = [
    { id: "code", label: trans[0] },
    { id: "name", label: trans[1] },
    { id: "usersCount", label: trans[2] },
    {
      id: "created_at",
      label: trans[3],
      minWidth: 150,
    },
  ];
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
          dispatch(openPopup({ popup: "managerRolesForm", data }));
        }}
      />
    </div>
  );
}
