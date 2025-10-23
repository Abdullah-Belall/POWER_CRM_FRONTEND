"use client";
import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export default function SideBarList({
  title,
  icon,
  affiliateLinks,
  onClose,
}: {
  title: string;
  icon: any;
  affiliateLinks: {
    title: string;
    link: string;
  }[];
  onClose: () => void;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List className="w-full !py-0" component="nav" aria-labelledby="nested-list-subheader">
      <ListItemButton
        className="group !justify-between !rounded-md !px-[15px] !text-[16px] !font-[500] !py-1 hover:bg-hovergreen!"
        onClick={handleClick}
      >
        <div className="flex !items-center gap-[5px] py-1">
          {icon}
          {title}
        </div>
        {open ? <MdExpandLess /> : <MdExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className="w-full flex flex-col gap-[8px] !px-[18px]" component="div" disablePadding>
          {affiliateLinks.map((e) => (
            <Link key={e.title} className="w-full" onClick={onClose} href={e.link}>
              <Button
                className={`${
                  path === e.link.split("?")[0] ? "!bg-hovergreen" : ""
                } w-full group !rounded-md !justify-start !pe-[32px] !text-[16px] !text-white !font-[500] !py-1 hover:bg-hovergreen!`}
                variant="text"
              >
                {e.title}
              </Button>
            </Link>
          ))}
        </List>
      </Collapse>
    </List>
  );
}
