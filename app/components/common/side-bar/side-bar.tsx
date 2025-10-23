"use client";
import { Button } from "@mui/material";
import SideBarList from "./side-bar-list";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { RiBillLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { BsList } from "react-icons/bs";
import { SiGooglecampaignmanager360 } from "react-icons/si";
import { FaUsers } from "react-icons/fa6";
import { IoFlag } from "react-icons/io5";
import { MdHeadsetMic } from "react-icons/md";
import { selectCurrentUserRoles } from "@/app/utils/store/slices/user-slice";

export default function SideBar() {
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));
  const roles = useAppSelector((state) => selectCurrentUserRoles(state));
  const dispatch = useAppDispatch();
  const path = usePathname();
  const handleClose = useCallback(() => dispatch(closePopup({ popup: "sideBar" })), []);
  const dataItems = useMemo(
    () =>
      sideBarItems.map((item, index) => (
        <SideBarList
          key={index}
          title={item.title}
          icon={item.icon}
          affiliateLinks={item.affiliateLinks}
          onClose={handleClose}
        />
      )),
    []
  );
  const sideBarSelectList = useMemo(() => {
    return (roles as string[])?.includes("create-tenant")
      ? ManagerPackage
      : (roles as string[])?.includes("assignable")
      ? SupportePackage
      : (roles as string[])?.includes("create-complaint") &&
        !(roles as string[])?.includes("update-complaint")
      ? ClientsPackage
      : sideBarMainLinks;
  }, [roles]);

  const mainSideBarLinks = useMemo(
    () =>
      sideBarSelectList.map((e, i) => (
        <Link key={i} className="w-full" onClick={handleClose} href={e.path}>
          <Button
            className={`${
              path === e.path ? "!bg-hovergreen" : ""
            } group w-full !rounded-md !px-[15px] !flex !gap-[8px] !items-center !justify-start !text-white !text-[16px] !font-[500] !py-1 hover:bg-hovergreen!`}
            variant="text"
          >
            {e.icon}
            {e.name}
          </Button>
        </Link>
      )),
    [sideBarMainLinks, path, roles]
  );
  return (
    <aside
      className={`${
        sideBar.isOpen ? "left-0" : "left-[-240px]"
      } duration-200 rounded-r-xl flex flex-col gap-2 px-[5px] py-[20px] fixed bottom-[10px] w-[240px] h-[calc(100dvh-159px)] bg-lightgreen z-[3000]`}
    >
      <button
        onClick={() =>
          dispatch(
            sideBar.isOpen
              ? closePopup({ popup: "sideBar" })
              : openPopup({ popup: "sideBar", data: {} })
          )
        }
        className={`${
          sideBar.isOpen ? "left-[240px]" : "left-0"
        } duration-200 cursor-pointer bg-lightgreen fixed top-[35%] text-xl p-1 rounded-r-md z-[200] bg-[red]`}
      >
        <BsList />
      </button>
      {mainSideBarLinks}
      {dataItems}
    </aside>
  );
}

const sameClass = "opacity-50 group-hover:opacity-100";

const sideBarMainLinks = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
];
const sideBarItems = [
  {
    title: "Test",
    icon: <RiBillLine className={sameClass} />,
    affiliateLinks: [
      {
        title: "Sub link 1",
        link: "/",
      },
      {
        title: "Sub link 2",
        link: "/",
      },
      {
        title: "Sub link 3",
        link: "/",
      },
      {
        title: "Sub link 4",
        link: "/",
      },
    ],
  },
];
const ManagerPackage = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
  {
    path: "/managers",
    name: "Overview",
    icon: (
      <SiGooglecampaignmanager360 className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />
    ),
  },
  {
    path: "/managers/users",
    name: "Users",
    icon: <FaUsers className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
  {
    path: "/managers/roles",
    name: "Roles",
    icon: <IoFlag className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
  {
    path: "/managers/complaints",
    name: "Complaints",
    icon: <MdHeadsetMic className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
];
const SupportePackage = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
  {
    path: "/supporters",
    name: "Overview",
    icon: (
      <SiGooglecampaignmanager360 className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />
    ),
  },
  {
    path: "/supporters/complaints",
    name: "Complaints",
    icon: <MdHeadsetMic className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
];
const ClientsPackage = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
  {
    path: "/clients",
    name: "Overview",
    icon: (
      <SiGooglecampaignmanager360 className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />
    ),
  },
  {
    path: "/clients/complaints",
    name: "Complaints",
    icon: <MdHeadsetMic className="opacity-[.7] font-bold group-hover:opacity-100 text-[17px]" />,
  },
];
