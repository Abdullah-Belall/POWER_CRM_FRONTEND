"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useAppSelector } from "@/app/utils/store/hooks";
import { getCurrLang } from "@/app/utils/store/slices/languages-slice";

export default function ClockWidget() {
  const lang = useAppSelector(getCurrLang());
  const [hasMounted, setHasMounted] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setHasMounted(true);
    setDateTime(new Date());
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isArabic = lang === "ar";
  const locale = isArabic ? "ar-EG" : "en-US";
  const dir = isArabic ? "rtl" : "ltr";

  const timeString = dateTime
    ? dateTime.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  const dateString = dateTime
    ? dateTime.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "----------";

  return (
    <div className={`flex items-center gap-1 opacity-[.7]`} dir={dir}>
      <Typography variant="body2">{hasMounted ? dateString : "----------"}</Typography>
      <Typography variant="body1" className="!text-[14px]">
        {hasMounted ? timeString : "--:--:--"}
      </Typography>
    </div>
  );
}
