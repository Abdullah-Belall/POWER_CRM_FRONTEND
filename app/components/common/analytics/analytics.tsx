"use client";
import { useEffect, useRef } from "react";
import { getDir } from "@/app/utils/base";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { analyticsState, setOffsetTop } from "@/app/utils/store/slices/analytics-slice";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { selectPopup } from "@/app/utils/store/slices/popup-slice";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

export default function Analytics() {
  const sectionRef = useRef<HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { analytics } = useAppSelector(analyticsState);
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));
  const currLang = useAppSelector(getCurrLang());
  const lang = useAppSelector(getCurrLang());
  const vsLast = useAppSelector(getPageTrans("analytics")).vsLast;

  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const distance = rect.bottom;
      dispatch(setOffsetTop(distance));
    }
  }, [dispatch, sideBar.isOpen, analytics]);
  const analyticsDir = currLang === "ar" ? "left-[calc(50%-62px/2)]" : "left-[calc(50%+62px/2)]";
  return (
    <section
      ref={sectionRef}
      dir={getDir(lang)}
      className={`${
        sideBar.isOpen
          ? currLang === "ar"
            ? "w-[calc(90%-120px)] left-[calc(50%-120px)]"
            : "w-[calc(90%-120px)] left-[calc(50%+120px)]"
          : ""
      } w-[90%] ${analyticsDir} translate-x-[-50%] flex duration-200 rounded-xl border border-lightgreen shadow-xl h-fit overflow-hidden fixed top-[65px] z-30`}
    >
      {analytics.map((e, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 w-full text-white bg-lightgreen cursor-pointer duration-300  py-4 px-6 hover:bg-transparent"
        >
          <h1 className="text-xs font-[300]">{e.title}</h1>
          <p className="text-2xl font-[600]">{e.value}</p>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-[#eeeeee2e] rounded-md flex items-center text-xs">
              <span className="text-white">
                {e.lastMonth > 0 ? "+" + e.lastMonth : e.lastMonth}%
              </span>
              {e.lastMonth > 0 ? (
                <FaArrowTrendUp className="text-[10px] ml-1 text-white" />
              ) : (
                <FaArrowTrendDown className="text-[10px] ml-1 text-white" />
              )}
            </div>
            <p className="text-[10px] opacity-[.7]">{vsLast}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
