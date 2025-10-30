"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useState } from "react";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import ManagerRolesTable from "../../tables/roles-table";
import BlackLayer from "../../common/black-layer/black-layer";
import RoleForm from "../../forms/role-form";
import { Button } from "@mui/material";
import { RoleInterface } from "@/app/utils/interfaces/common.interface";
import { ADD_ROLE, GET_ROLES, UPDATE_ROLE } from "@/app/utils/requests-hub/managers-reqs";
import { useRouter } from "next/navigation";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";

export default function ManagersRolesPage() {
  const router = useRouter();
  const trans = useAppSelector(getPageTrans("managersRolesPage"));
  const [openForm, setOpenForm] = useState(false);
  const [data, setData] = useState<RoleInterface[]>([]);
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const managerRolesForm = useAppSelector((state) => selectPopup(state, "managerRolesForm"));
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_ROLES);
    if (res.done) {
      setData(res.data.roles);
    } else {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="flex gap-[20px] h-fit">
        <div className="w-full flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <Button onClick={() => setOpenForm(true)} variant="contained">
              {trans.btn}
            </Button>
          </div>
          <ManagerRolesTable data={data} />
        </div>
      </div>
      {openForm && (
        <BlackLayer onClick={() => setOpenForm(false)}>
          <RoleForm
            closeForm={() => setOpenForm(false)}
            onConfirm={async (data: any) => {
              const res = await CLIENT_COLLECTOR_REQ(ADD_ROLE, data);
              if (res.done) {
                setOpenForm(false);
                handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Role added successfully");
                fetchData();
              } else {
                handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
              }
            }}
          />
        </BlackLayer>
      )}
      {managerRolesForm.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "managerRolesForm" }))}>
          <RoleForm
            closeForm={() => dispatch(closePopup({ popup: "managerRolesForm" }))}
            initialData={{
              id: managerRolesForm?.data?.id,
              name: managerRolesForm?.data?.name,
              code: managerRolesForm?.data?.code,
              roles: managerRolesForm?.data?.roles,
            }}
            onConfirm={async (data: any) => {
              const res = await CLIENT_COLLECTOR_REQ(UPDATE_ROLE, data);
              if (res.done) {
                dispatch(closePopup({ popup: "managerRolesForm" }));
                handleOpenSnakeBar(
                  SnakeBarTypeEnum.SUCCESS,
                  "Role attributes successfully updated"
                );
                fetchData();
              } else {
                handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
              }
            }}
          />
        </BlackLayer>
      )}
    </>
  );
}
