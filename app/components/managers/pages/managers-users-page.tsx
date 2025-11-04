"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import AllUsersTable from "../../tables/all-users-table";
import { Button } from "@mui/material";
import BlackLayer from "../../common/black-layer/black-layer";
import UserForm from "../../forms/user-form";
import { useRouter } from "next/navigation";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_USERS } from "@/app/utils/requests-hub/supporters-reqs";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { ADD_USER } from "@/app/utils/requests-hub/managers-reqs";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { fillTable, getTable } from "@/app/utils/store/slices/tables-data-slice";
import UploadUserExcelFile from "../../forms/upload-user-excel-file";
import { fillInitialDataSearch, setSearchColumns } from "@/app/utils/store/slices/search-slice";
import { MdOutlineRefresh } from "react-icons/md";

export default function ManagersUsersPage() {
  const router = useRouter();
  const trans = useAppSelector(getPageTrans("managersUsersPage"));
  const [openForm, setOpenForm] = useState(false);
  const { data } = useAppSelector(getTable("managerUsersTable"));
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrLang());
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const managerUserDetails = useAppSelector((state) => selectPopup(state, "managerUserDetails"));
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS);
    if (res.done) {
      dispatch(
        fillTable({
          tableName: "managerUsersTable",
          obj: {
            total: res.data.total,
            data: res.data.users,
          },
        })
      );
    } else {
      router.push("/sign-in");
    }
  };
  const searchColumns = useMemo(() => {
    return [
      {
        alias: "u.user_name",
        slug: trans.table[0],
      },
      {
        alias: "u.phone",
        slug: trans.table[1],
      },
      {
        alias: "u.email",
        slug: trans.table[2],
      },
    ];
  }, [lang]);
  const searchObj = {
    search_in: "users",
    columns: searchColumns,
    fillFunc: (obj: { total: number; data: any[] }) => {
      dispatch(
        fillTable({
          tableName: "managerUsersTable",
          obj,
        })
      );
    },
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
  const uploadUserExcelFile = useAppSelector((state) => selectPopup(state, "uploadUserExcelFile"));
  const [refetchLoading, setRefetchLoading] = useState(false);
  return (
    <>
      <div className="flex gap-[20px]">
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
                  dispatch(fillInitialDataSearch(searchObj));
                  setRefetchLoading(false);
                }}
                className={`${
                  refetchLoading ? "animate-spin" : ""
                } cursor-pointer text-white text-2xl bg-lightgreen rounded-full px-1.5`}
              >
                <MdOutlineRefresh />
              </button>
              <Button
                onClick={() =>
                  dispatch(
                    openPopup({
                      popup: "uploadUserExcelFile",
                      data: {
                        refetchUsers: fetchData,
                      },
                    })
                  )
                }
                variant="contained"
              >
                {trans.uploadExcelFileBtn}
              </Button>
              <Button onClick={() => setOpenForm(true)} variant="contained">
                {trans.btn}
              </Button>
            </div>
          </div>
          <AllUsersTable data={data} popup={"managerUserDetails"} />
        </div>
      </div>
      {openForm && (
        <BlackLayer onClick={() => setOpenForm(false)}>
          <UserForm
            closeForm={() => setOpenForm(false)}
            onConfirm={async (data: any) => {
              const res = await CLIENT_COLLECTOR_REQ(ADD_USER, data);
              if (res.done) {
                setOpenForm(false);
                handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Created new user successfully");
                fetchData();
              } else {
                handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
              }
            }}
          />
        </BlackLayer>
      )}
      {managerUserDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "managerUserDetails" }))}>
          <UserForm
            closeForm={() => dispatch(closePopup({ popup: "managerUserDetails" }))}
            initialData={{
              user_id: managerUserDetails?.data?.id,
              user_name: managerUserDetails?.data?.user_name,
              role_id: managerUserDetails?.data?.role?.id,
              email: managerUserDetails?.data?.email,
              phone: managerUserDetails?.data?.phone,
            }}
            onConfirm={async () => {}}
          />
        </BlackLayer>
      )}
      {uploadUserExcelFile.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "uploadUserExcelFile" }))}>
          <UploadUserExcelFile />
        </BlackLayer>
      )}
    </>
  );
}
