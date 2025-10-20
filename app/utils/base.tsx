import { SiAnydesk, SiTeamviewer } from "react-icons/si";
import { ScreenViewerEnum } from "./enums/screen-viewer.enum";
import { ComplaintStatusEnum } from "./enums/complaint-status-enum";

export const BASE_URL = (process.env.BASE_SERVER_URL || "http://localhost:5000") + "api";

export const formatDate = (input: string | Date) => {
  let date: Date;

  if (typeof input === "string") {
    const fixedString = input.replace(" ", "T");
    date = new Date(fixedString);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    return "تاريخ غير صالح";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const hours = getPart("hour");
  const minutes = getPart("minute");
  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const ScreenViewer = ({ viewer }: { viewer: ScreenViewerEnum }) => {
  switch (viewer) {
    case ScreenViewerEnum.ANYDESK:
      return (
        <div className="flex gap-1.5 items-center text-nowrap">
          <SiAnydesk className="text-lg text-[#f44034]" />
          <div className="!text-black font-[600]">Any Desk</div>
        </div>
      );

    case ScreenViewerEnum.TEAMVIEWR:
      return (
        <div className="flex gap-1.5 items-center !text-[#0b1157] text-nowrap">
          <SiTeamviewer className="text-lg" />
          <div className="font-[600]">Team Viewer</div>
        </div>
      );

    case ScreenViewerEnum.ULTRAVIEWER:
      return (
        <div className="flex gap-1.5 items-center !text-[#2675cc] text-nowrap ml-[-3px]">
          <img src="/ultraviewer.webp" alt="UltraViewer" className="w-[22px]" />
          <div className="font-[600]">Ultra Viewer</div>
        </div>
      );

    default:
      return null;
  }
};
export const ComplaintStatusViewer = ({ status }: { status: ComplaintStatusEnum }) => {
  switch (status) {
    case ComplaintStatusEnum.COMPLETED:
      return (
        <button className="p-1 text-xs text-nowrap bg-green-900 text-green-300 rounded-md border-2 border-green-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.CANCELLED:
      return (
        <button className="p-1 text-xs text-nowrap bg-red-900 text-red-300 rounded-md border-2 border-red-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.IN_PROGRESS:
      return (
        <button className="p-1 text-xs text-nowrap bg-sky-900 text-sky-300 rounded-md border-2 border-sky-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.PENDING:
      return (
        <button className="p-1 text-xs text-nowrap bg-orange-900 text-orange-300 rounded-md border-2 border-orange-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.CLIENT_CANCELLED:
      return (
        <button className="p-1 text-xs text-nowrap bg-slate-900 text-slate-300 rounded-md border-2 border-slate-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.SUSPENDED:
      return (
        <button className="p-1 text-xs text-nowrap bg-indigo-900 text-indigo-300 rounded-md border-2 border-indigo-300">
          {status}
        </button>
      );
  }
};

export const checkNull = (value: any, message: string) => {
  return !value || value?.trim() === "" ? message : value;
};
