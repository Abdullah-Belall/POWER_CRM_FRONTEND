"use client";
import MainTable from "@/app/components/tables/main-table";
import { canAccess, checkNull, formatDate } from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openPopup } from "@/app/utils/store/slices/popup-slice";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function AllUsersTable({ data, popup }: { data: UserInterface[]; popup: string }) {
  const dispatch = useAppDispatch();
  const formateData = data?.map((e: any) => {
    return {
      ...e,
      created_at: formatDate(e.created_at),
      email: checkNull(e.email, "-"),
      phone: checkNull(e.phone, "-"),
      complaints_count: canAccess(e.role?.roles, ["create-complaint"]) ? e.complaints_count : "-",
      solving_count: canAccess(e.role?.roles, ["sub-complaint-f-client"]) ? e.solving_count : "-",
    };
  });
  const trans = useAppSelector(getPageTrans("managersUsersPage")).table;
  const columns: TableColumnInterface[] = [
    { id: "index", label: "#" },
    { id: "user_name", label: trans[0] },
    { id: "phone", label: trans[1] },
    { id: "email", label: trans[2] },
    { id: "role.name", label: trans[3] },
    { id: "complaints_count", label: trans[4] },
    { id: "solving_count", label: trans[5] },
    {
      id: "created_at",
      label: trans[6],
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
      />
    </div>
  );
}
