"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useState } from "react";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import AllUsersTable from "../../tables/all-users-table";
import { Button } from "@mui/material";
import BlackLayer from "../../common/black-layer/black-layer";
import UserForm from "../../forms/user-form";
import { useRouter } from "next/navigation";
import { UserInterface } from "@/app/utils/interfaces/user-interface";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { GET_USERS } from "@/app/utils/requests-hub/supporters-reqs";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { ADD_USER } from "@/app/utils/requests-hub/managers-reqs";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";

export default function ManagersUsersPage() {
  const router = useRouter();
  const [data, setData] = useState<UserInterface[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useAppDispatch();
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
    console.log(res);
    if (res.done) {
      setData(res.data.users);
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const analytics = [
    {
      title: "Total Users",
      value: data.length.toString(),
      lastMonth: 10,
      onclick: () => "",
    },
    {
      title: "New Clients",
      value: "12",
      lastMonth: 15,
      onclick: () => "",
    },
    {
      title: "Complaints",
      value: "32",
      lastMonth: -10,
      onclick: () => "",
    },
    {
      title: "Opened Complaints",
      value: "3",
      lastMonth: -10,
      onclick: () => "",
    },
  ];
  const trans = useAppSelector(getPageTrans("managersUsersPage"));
  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-full flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <Button onClick={() => setOpenForm(true)} variant="contained">
              {trans.btn}
            </Button>
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
    </>
  );
}
