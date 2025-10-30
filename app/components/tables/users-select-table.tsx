"use client";
import MainTable from "@/app/components/tables/main-table";
import { TableColumnInterface } from "@/app/utils/interfaces/table.interface";
import { checkNull, formatDate } from "@/app/utils/base";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { FormControlLabel, Radio } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function UsersSelectTable({
  data,
  type,
}: {
  data: UserInterface[];
  type: "selectClientForCreateComplaint" | "assignSupporter" | "refereToSupporter";
}) {
  const dispatch = useAppDispatch();
  const popup = useAppSelector((state) => selectPopup(state, type));
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).popup.inputs.table;
  const columns: TableColumnInterface[] = [
    { id: "radio", label: "*" },
    { id: "index", label: "#" },
    { id: "user_name", label: trans[0] },
    { id: "email", label: trans[1] },
    { id: "phone", label: trans[2] },
  ];

  const formateData = data?.map((e) => ({
    ...e,
    created_at: formatDate(e.created_at),
    email: checkNull(e.email, "-"),
    phone: checkNull(e.phone, "-"),
    radio: (
      <FormControlLabel
        onClick={() => {
          dispatch(
            openPopup({
              popup: type,
              data: {
                ...popup.data,
                user_id: e.id,
              },
            })
          );
        }}
        className="!m-0"
        value="male"
        control={<Radio />}
        label=""
        checked={popup?.data?.user_id === e?.id}
      />
    ),
  }));
  return (
    <div>
      <MainTable columns={columns} rows={formateData} hieght="!h-[250px]" />
    </div>
  );
}
