"use client";
import { useEffect, useMemo, useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useAppSelector } from "@/app/utils/store/hooks";
import { canAccess } from "@/app/utils/base";
import { selectCurrentUserRoles } from "@/app/utils/store/slices/user-slice";
import { selectPopup } from "@/app/utils/store/slices/popup-slice";
import { getCurrLang } from "@/app/utils/store/slices/languages-slice";

export default function SideBarList({
  title,
  icon,
  affiliateLinks,
  onClose,
}: {
  title: string;
  icon: any;
  affiliateLinks: {
    path: string;
    name: string;
    roles: null | string[];
  }[];
  onClose: () => void;
}) {
  const path = usePathname();
  const lang = useAppSelector(getCurrLang());
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (!sideBar.isOpen) {
      setOpen(false);
    }
  }, [sideBar.isOpen]);
  const currLang = useAppSelector(getCurrLang());
  const roles = useAppSelector((state) => selectCurrentUserRoles(state));

  const allowedLinks = useMemo(
    () =>
      affiliateLinks.filter(
        (e) => e.roles === null || canAccess(roles as string[], e.roles as string[])
      ),
    [affiliateLinks, roles]
  );
  const displaySubLinks = useMemo(
    () =>
      affiliateLinks.map((e) => (
        <Link key={e.name} className="w-full" onClick={onClose} href={e.path}>
          <Button
            className={`${
              path === e.path ? "!bg-[#072632]" : ""
            } w-full group text-nowrap !rounded-md ${
              lang === "ar" ? "!justify-end" : "!justify-start"
            } !pe-[32px] !text-[16px] !text-white !font-[500] !py-1 hover:bg-[#072632]!`}
            variant="text"
          >
            {e.name}
          </Button>
        </Link>
      )),
    [allowedLinks, currLang]
  );
  return (
    <List className="w-full !py-0" component="nav" aria-labelledby="nested-list-subheader">
      <ListItemButton
        className={`group !flex ${
          lang === "ar" && "!flex-row-reverse"
        } !justify-between !rounded-md !px-[15px] !text-[16px] !font-[500] !py-1 !text-white hover:bg-[#072632]!`}
        onClick={handleClick}
      >
        <div className={`flex ${lang === "ar" && "!flex-row-reverse"} !items-center gap-2 py-1`}>
          <p>{icon}</p>
          {sideBar.isOpen && title}
        </div>
        {open ? <MdExpandLess /> : <MdExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className="w-full flex flex-col gap-[8px] !px-[18px]" component="div" disablePadding>
          {displaySubLinks}
        </List>
      </Collapse>
    </List>
  );
}
