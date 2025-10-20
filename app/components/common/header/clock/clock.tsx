"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function ClockWidget() {
  const [hasMounted, setHasMounted] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setHasMounted(true);
    setDateTime(new Date());
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const timeString = dateTime
    ? dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  const dateString = dateTime
    ? dateTime.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "----------";

  return (
    <div className="flex items-center gap-1 opacity-[.7]">
      <Typography variant="body2">{hasMounted ? dateString : "----------"}</Typography>
      <Typography variant="body1" className="!text-[14px]">
        {hasMounted ? timeString : "--:--:--"}
      </Typography>
    </div>
  );
}
