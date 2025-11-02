"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { formatDate } from "@/app/utils/base";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { checkNull } from "../../utils/base";

export default function UsersTable({
  data,
  hieght,
}: {
  data: UserInterface[];
  managerForm?: {
    closeForm: () => void;
    complaint_id: string;
    note?: string;
    max_time_to_solve?: number;
    refetchComplaints: () => Promise<void>;
  };
  supporterForm?: {
    closeForm: () => void;
    complaint_id: string;
    refetchComplaints: () => Promise<void>;
  };
  hieght?: string;
}) {
  const formateData = data?.map((e) => ({
    ...e,
    email: checkNull(e.email, "-"),
    phone: e.phone === "+20" ? "-" : e.phone,
    created_at: formatDate(e.created_at),
  }));

  return (
    <div>
      <MainTable columns={columns} rows={formateData} hieght={hieght} />
    </div>
  );
}

const columns: TableColumnInterface[] = [
  { id: "index", label: "#" },
  { id: "user_name", label: "User Name" },
  { id: "email", label: "Email" },
  { id: "created_at", label: "Created At", minWidth: 140 },
];
