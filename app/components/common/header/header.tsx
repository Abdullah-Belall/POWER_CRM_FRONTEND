"use client";
import { IoNotificationsOutline } from "react-icons/io5";
import ClockWidget from "./clock/clock";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Avatar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import { FaSignOutAlt } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "@/app/utils/requests/refresh-token-req";
import { useRouter } from "next/navigation";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import BlackLayer from "../black-layer/black-layer";
import SupporterNotificationPopup from "../../supporters/notifi-popup";
import { getSupporterNotifi } from "@/app/utils/requests/supporter-requests";

export default function Header() {
  const router = useRouter();
  const [openNotifi, setOpenNotifi] = useState(false);
  const [notifiData, setNotifiData] = useState<any>();
  const user = useAppSelector((state) => selectCurrentUser(state));
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };

  //~===================
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateMenuPosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    updateMenuPosition();
    const onResize = () => updateMenuPosition();
    const onScroll = () => updateMenuPosition();
    const onClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchorRef.current && anchorRef.current.contains(target)) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("mousedown", onClickAway, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("mousedown", onClickAway, true);
    };
  }, [isMenuOpen, updateMenuPosition]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  //~===================

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-out`, {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Signed out successfully");
      router.push("/sign-in");
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data.message);
    },
  });
  const handleSignOut = async () => {
    if (isPending) return;
    await COLLECTOR_REQ(mutateAsync);
    closeMenu();
  };
  useQuery({
    queryKey: ["supporter-notifi"],
    queryFn: async () => {
      const result = await getSupporterNotifi();
      setNotifiData(result.data);
      return result.data;
    },
  });
  return (
    <>
      <header className="w-full z-[9] h-[140px] bg-lightgreen rounded-b-xl fixed top-0 left-0 overflow-visible">
        <div className="w-full h-full relative">
          <h1 className="text:[180px] cube font-bold text-nowrap text-[#eeeeee06] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            POWER SOFT
          </h1>
        </div>
        <div className="w-full fixed top-0 left-0 px-3 pt-3 flex items-center justify-between">
          <div className="flex gap-10 items-center justify-between">
            <div className="flex items-center gap-2">
              <img className="w-[40px]" src="./LOGUP.png" alt="aaa" />
              <div className="flex flex-col">
                <h1 className="text-sm">Power Soft</h1>
                <p className="text-[9px] font-[300]">CRM System</p>
              </div>
            </div>
            <div className="text-xs">
              <span className="opacity-[.5]">Welcome Back,</span> Alex!{" "}
              <span className="opacity-[.5]">Here are latest updates on your </span>Dashboard
            </div>
          </div>
          <div className="flex items-center gap-5">
            <ClockWidget />
            <button className="cursor-pointer text-lg">
              <CiSearch />
            </button>
            <button
              onClick={() => setOpenNotifi(true)}
              className="cursor-pointer relative text-lg rounded-full hover:bg-hovergreen duration-200 p-1"
            >
              <p
                className={`${
                  notifiData?.total == 0 ? "hidden" : ""
                } w-[12px] h-[12px] absolute right-[3] top-0 flex justify-center items-center rounded-full text-[8px] bg-rose-700`}
              >
                {notifiData?.total}
              </p>
              <IoNotificationsOutline />
            </button>
            <div
              ref={anchorRef}
              className="flex items-center gap-1 px-2 relative cursor-pointer"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <Avatar alt="Remy Sharp" src="/me.jpeg" />
              <h1 className="font-[300] text-xs ml-1">{user?.user_name}</h1>
              <MdOutlineKeyboardArrowDown className="opacity-[.5]" />
            </div>
          </div>
        </div>
      </header>
      {typeof window !== "undefined" && isMenuOpen && menuPos
        ? createPortal(
            <ul
              ref={menuRef}
              style={{
                position: "fixed",
                top: menuPos.top + 4,
                left: menuPos.left,
                width: menuPos.width,
              }}
              className="flex flex-col bg-xlightgreen overflow-hidden rounded-md shadow-2xl z-[200]"
            >
              <li
                className="flex gap-2 text-darkgreen items-center duration-200 p-2 hover:bg-[#ffffff22] cursor-pointer"
                onClick={handleSignOut}
              >
                <FaSignOutAlt />
                <span className="text-xs">Sign Out</span>
              </li>
            </ul>,
            document.body
          )
        : null}
      {openNotifi && user?.role?.roles?.includes("assignable") && (
        <BlackLayer onClick={() => setOpenNotifi(false)}>
          <SupporterNotificationPopup closeForm={() => setOpenNotifi(false)} data={notifiData} />
        </BlackLayer>
      )}
    </>
  );
}
