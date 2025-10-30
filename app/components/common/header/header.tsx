"use client";
import { IoNotificationsOutline } from "react-icons/io5";
import ClockWidget from "./clock/clock";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Avatar, Button, ButtonGroup } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import { FaFacebookF, FaLinkedinIn, FaPhone, FaSignOutAlt } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import BlackLayer from "../black-layer/black-layer";
import SupporterNotificationPopup from "../../supporters/notifi-popup";
import { CLIENT_COLLECTOR_REQ, SIGN_OUT } from "@/app/utils/requests-hub/common-reqs";
import { SUPPORTER_NOTIFICATIONS } from "@/app/utils/requests-hub/supporters-reqs";
import { ManagerComplaintInterface } from "@/app/utils/interfaces/manager.interface";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import Image from "next/image";
import logo from "@/public/LOGUP.png";
import { changeLang, getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { getDir } from "@/app/utils/base";

export default function Header() {
  const router = useRouter();
  const [notifiData, setNotifiData] = useState<ManagerComplaintInterface[]>([]);
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
  const notifiRefetch = useAppSelector((state) => selectPopup(state, "notifiRefetch"));
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
  const [isPending, setIsPending] = useState(false);
  const handleSignOut = async () => {
    if (isPending) return;
    setIsPending(true);
    const res = await CLIENT_COLLECTOR_REQ(SIGN_OUT);
    setIsPending(false);
    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Signed out successfully");
      router.push("/sign-in");
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
    closeMenu();
  };
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(SUPPORTER_NOTIFICATIONS);
    if (res.done) {
      setNotifiData(res.data.complaints);
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handlechangeLang = (lang: "ar" | "en") => {
    dispatch(
      changeLang({
        lang,
      })
    );
  };
  const lang = useAppSelector(getCurrLang());
  const trans = useAppSelector(getPageTrans("header"));
  return (
    <>
      <header
        dir={getDir(lang)}
        className="w-full bg-[#072632]s rounded-b-2xl text-white z-[9] h-[15dvh] fixed top-0 left-0 overflow-visible"
      >
        <div className="w-full fixed top-0 left-0 mt-[40px]s px-3 pt-3 flex items-center justify-between">
          <div className="flex gap-10 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-xl">
                <Image width={40} height={44} src={logo} alt="aaa" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm">Power Soft</h1>
                <p className="text-[9px] font-[300]">CRM System</p>
              </div>
            </div>
            <div className="text-xs">
              <span className="opacity-[.5]">{trans.sentence[0]}</span> {user?.user_name}!{" "}
              <span className="opacity-[.5]">{trans.sentence[1]} </span>
              {trans.sentence[2]}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <ClockWidget />
            <button className="cursor-pointer text-lg">
              <CiSearch />
            </button>
            <button
              onClick={() =>
                dispatch(
                  openPopup({
                    popup: "notifiRefetch",
                    data: {
                      refetch: fetchData,
                    },
                  })
                )
              }
              className="cursor-pointer relative text-lg rounded-full hover:bg-hovergreen duration-200 p-1"
            >
              <p
                className={`${
                  notifiData?.length == 0 ? "hidden" : ""
                } w-[12px] h-[12px] absolute right-[3] top-0 flex justify-center items-center rounded-full text-[8px] bg-rose-700`}
              >
                {notifiData?.length}
              </p>
              <IoNotificationsOutline />
            </button>
            <ButtonGroup
              variant="text"
              className="!flex !text-white !bg-lightgreen"
              aria-label="Basic button group"
            >
              <Button className=" !text-white" onClick={() => handlechangeLang("ar")}>
                Ar
              </Button>
              <Button className=" !text-white" onClick={() => handlechangeLang("en")}>
                En
              </Button>
            </ButtonGroup>
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
                <span className="text-xs">{trans.dropDownMenu.signOut}</span>
              </li>
            </ul>,
            document.body
          )
        : null}
      {notifiRefetch.isOpen && user?.role?.roles?.includes("assignable") && (
        <BlackLayer
          onClick={() =>
            dispatch(
              closePopup({
                popup: "notifiRefetch",
              })
            )
          }
        >
          <SupporterNotificationPopup data={notifiData} />
        </BlackLayer>
      )}
    </>
  );
}
