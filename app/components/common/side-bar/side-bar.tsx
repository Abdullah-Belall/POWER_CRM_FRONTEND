"use client";
import SideBarList from "./side-bar-list";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { FaUsers } from "react-icons/fa6";
import { IoFlag } from "react-icons/io5";
import { MdHeadsetMic } from "react-icons/md";
import { selectCurrentUserRoles } from "@/app/utils/store/slices/user-slice";
import { canAccess } from "@/app/utils/base";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";

interface SubLink {
  path: string;
  name: string;
  roles: string[] | null;
}

interface NavLink {
  path: string;
  name: string;
  icon?: ReactNode;
  roles: string[] | null;
  subLinks?: SubLink[];
}

export default function SideBar() {
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("sideBar"));
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));
  const roles = useAppSelector((state) => selectCurrentUserRoles(state));
  const dispatch = useAppDispatch();
  const path = usePathname();
  const handleClose = useCallback(() => dispatch(closePopup({ popup: "sideBar" })), []);
  const sameClass = "opacity-[.7] font-bold group-hover:opacity-100 !text-[22px]";
  const SideBarLinks: NavLink[] = [
    {
      path: "/",
      name: trans.home,
      icon: <FaHome className={sameClass} />,
      roles: null,
    },
    {
      path: "/managers/users",
      name: trans.users,
      icon: <FaUsers className={sameClass} />,
      roles: ["read-user"],
    },
    {
      path: "/managers/roles",
      name: trans.roles,
      icon: <IoFlag className={sameClass} />,
      roles: ["read-role"],
    },
    {
      path: "/managers/complaints",
      name: trans.complaints,
      icon: <MdHeadsetMic className={sameClass} />,
      roles: ["read-complaint"],
    },
    {
      path: "/supporters/complaints",
      name: trans.complaints,
      icon: <MdHeadsetMic className={sameClass} />,
      roles: ["assignable"],
    },
    {
      path: "/clients/complaints",
      name: trans.complaints,
      icon: <MdHeadsetMic className={sameClass} />,
      roles: ["create-complaint"],
    },
  ];
  const allowedLinks = SideBarLinks.filter(
    (e) => e.roles === null || canAccess(roles as string[], e.roles as string[])
  );
  const displaySideBarLinks = allowedLinks.map((e, i) =>
    e.subLinks ? (
      <SideBarList
        key={i}
        title={e.name}
        icon={e.icon}
        affiliateLinks={e.subLinks}
        onClose={handleClose}
      />
    ) : (
      <Link key={i} className="w-full" onClick={handleClose} href={e.path}>
        <button
          className={`${path === e.path ? "!bg-[#072632] !text-white" : ""} ${
            lang === "ar" ? "flex-row-reverse" : " "
          } group duration-200 cursor-pointer w-full !text-nowrap !rounded-md !px-[15px] !flex !gap-[8px] !text-white !items-center !justify-start !text-[16px] !font-[500] !py-1 hover:bg-[#072632]! hover:text-white!`}
        >
          <p className="!m-0">{e.icon}</p>
          {sideBar.isOpen && e.name}
        </button>
      </Link>
    )
  );
  return (
    <aside
      onMouseEnter={() => dispatch(openPopup({ popup: "sideBar", data: {} }))}
      onMouseLeave={() => dispatch(closePopup({ popup: "sideBar" }))}
      className={`${sideBar.isOpen ? "w-[240px]" : "w-[62px]"} duration-200 ${
        lang === "ar" ? "rounded-l-xl right-0" : "rounded-r-xl left-0"
      } flex flex-col shadow-lg gap-2 px-[5px] py-[20px] fixed bottom-[10px] h-[80dvh] bg-lightgreen z-[3000]`}
    >
      <div className="relative z-10 flex flex-col gap-2">{displaySideBarLinks}</div>
    </aside>
  );
}
