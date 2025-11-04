"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import ManagerRolesTable from "../../tables/roles-table";
import BlackLayer from "../../common/black-layer/black-layer";
import RoleForm from "../../forms/role-form";
import { Button } from "@mui/material";
import { ADD_ROLE, GET_ROLES, UPDATE_ROLE } from "@/app/utils/requests-hub/managers-reqs";
import { useRouter } from "next/navigation";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { fillInitialDataSearch, setSearchColumns } from "@/app/utils/store/slices/search-slice";
import { MdOutlineRefresh } from "react-icons/md";
import { fillTable, getTable } from "@/app/utils/store/slices/tables-data-slice";

export default function ManagersRolesPage() {
  const router = useRouter();
  const trans = useAppSelector(getPageTrans("managersRolesPage"));
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrLang());
  const searchColumns = useMemo(() => {
    return [
      {
        alias: "role.code",
        slug: trans.table[0],
      },
      {
        alias: "role.name",
        slug: trans.table[1],
      },
    ];
  }, [lang]);
  const { data } = useAppSelector(getTable("managerRolesTable"));
  const searchObj = {
    search_in: "roles",
    columns: searchColumns,
    fillFunc: (obj: { total: number; data: any[] }) => {
      dispatch(
        fillTable({
          tableName: "managerRolesTable",
          obj,
        })
      );
    },
  };
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
      dispatch(
        fillTable({
          tableName: "managerRolesTable",
          obj: {
            data: res.data?.roles,
            total: res.data?.total,
          },
        })
      );
    } else {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(fillInitialDataSearch(searchObj));
  }, []);
  useEffect(() => {
    dispatch(
      setSearchColumns({
        columns: searchColumns,
      })
    );
  }, [lang]);
  const [refetchLoading, setRefetchLoading] = useState(false);

  return (
    <>
      <div className="flex gap-[20px] h-fit">
        <div className="w-full flex flex-col gap-[3px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (refetchLoading) return;
                  setRefetchLoading(true);
                  fetchData();
                  setRefetchLoading(false);
                }}
                className={`${
                  refetchLoading ? "animate-spin" : ""
                } cursor-pointer text-white text-2xl bg-lightgreen rounded-full px-1.5`}
              >
                <MdOutlineRefresh />
              </button>
              <Button onClick={() => setOpenForm(true)} variant="contained">
                {trans.btn}
              </Button>
            </div>
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
