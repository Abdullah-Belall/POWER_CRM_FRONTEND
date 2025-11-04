"use client";
import { cairo } from "@/app/utils/fonts/cairo";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { analyticsState } from "@/app/utils/store/slices/analytics-slice";
import { getCurrLang } from "@/app/utils/store/slices/languages-slice";
import { selectPopup } from "@/app/utils/store/slices/popup-slice";
import { resetDataSearch } from "@/app/utils/store/slices/search-slice";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutChildren({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));
  const currLang = useAppSelector(getCurrLang());
  const { offSetTop } = useAppSelector(analyticsState);

  return (
    <div
      dir={currLang === "en" ? "ltr" : "rtl"}
      className={
        pathName !== "/sign-in"
          ? `${sideBar.isOpen ? "w-[calc(100%-240px)]" : "w-[calc(100%-62px)]"} ${
              currLang === "en" ? "right-0" : "left-0"
            } duration-200 px-4 h-[100dvh] ${pathName === "/" ? "pt-[52px]" : ""} fixed bottom-0`
          : `${cairo.className}`
      }
      style={
        pathName !== "/sign-in" && pathName !== "/"
          ? { paddingTop: `${offSetTop + 10}px` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
