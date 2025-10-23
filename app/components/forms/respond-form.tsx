"use client";
import { Button } from "@mui/material";

export default function RespondForm({
  title,
  warn,
  acceptSlug,
  refuseSlug,
  onAccept,
  onRefuse,
}: {
  title: string;
  warn?: string;
  acceptSlug: string;
  refuseSlug: string;
  onAccept: () => Promise<void>;
  onRefuse: () => Promise<void>;
}) {
  return (
    <div className="w-fit bg-[#eee] p-3 rounded-md flex flex-col items-center">
      <h1 className="text-lg font-semibold text-black mx-auto w-fit mb-1">{title}</h1>
      <p className="max-w-[90%] text-center mx-auto text-[9px] mb-2">{warn}</p>
      <div className="flex gap-2">
        <Button onClick={onAccept} variant="contained">
          {acceptSlug}
        </Button>
        <Button onClick={onRefuse} variant="contained">
          {refuseSlug}
        </Button>
      </div>
    </div>
  );
}
