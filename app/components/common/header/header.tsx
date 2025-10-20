import { IoNotificationsOutline } from "react-icons/io5";
import ClockWidget from "./clock/clock";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Avatar } from "@mui/material";

export default function Header() {
  return (
    <header className="w-full h-[140px] bg-lightgreen rounded-b-xl fixed top-0 left-0 overflow-hidden">
      <div className="w-full h-full relative">
        <h1 className="text-[180px] cube font-bold text-nowrap text-[#eeeeee06] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
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
          <button className="cursor-pointer text-lg">
            <IoNotificationsOutline />
          </button>
          <div className="flex items-center gap-1">
            <Avatar alt="Remy Sharp" src="/me.jpeg" />
            <h1 className="font-[300] text-xs ml-1">Abdullah</h1>
            <MdOutlineKeyboardArrowDown className="opacity-[.5]" />
          </div>
        </div>
      </div>
    </header>
  );
}
