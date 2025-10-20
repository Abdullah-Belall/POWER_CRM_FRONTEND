"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { formatDate } from "@/app/utils/base";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { checkNull } from "../../utils/base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "@/app/utils/requests/refresh-token-req";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";

export default function UsersTable({
  data,
  managerForm,
}: {
  data: UserInterface[];
  managerForm?: {
    closeForm: () => void;
    complaint_id: string;
    note?: string;
    max_time_to_solve?: number;
  };
}) {
  const formateData = data?.map((e) => ({
    ...e,
    email: checkNull(e.email, "-"),
    created_at: formatDate(e.created_at),
  }));
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints-assigner/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      if (managerForm?.closeForm) {
        managerForm?.closeForm();
      }
      handleOpenSnakeBar(
        SnakeBarTypeEnum.SUCCESS,
        "Successfully assigned complaint to the supporter"
      );
      queryClient.invalidateQueries({ queryKey: ["manager-assign-supporter"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data?.message);
    },
  });
  return (
    <div>
      <MainTable
        columns={columns}
        rows={formateData}
        onRowClick={(row) => {
          !isPending
            ? mutateAsync({
                supporter_id: row.id,
                complaint_id: managerForm?.complaint_id,
                note: managerForm?.note,
                max_time_to_solve: managerForm?.max_time_to_solve,
              })
            : "";
        }}
      />
    </div>
  );
}

const columns: TableColumnInterface[] = [
  { id: "index", label: "#" },
  { id: "user_name", label: "User Name" },
  { id: "email", label: "Email" },
  { id: "created_at", label: "Created At", minWidth: 140 },
];
