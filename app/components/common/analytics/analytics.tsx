"use client";
import { useAppSelector } from "@/app/utils/store/hooks";
import { analyticsState } from "@/app/utils/store/slices/analytics-slice";
import { selectPopup } from "@/app/utils/store/slices/popup-slice";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function Analytics() {
  const { analytics, chart } = useAppSelector(analyticsState);
  const sideBar = useAppSelector((state) => selectPopup(state, "sideBar"));

  return (
    <section
      className={`${
        sideBar.isOpen
          ? "w-[calc(100%-280px)] left-[calc(50%+120px)]"
          : "w-[calc(100%-100px)] left-[50%]"
      } flex duration-200 rounded-xl bg-darkgreen overflow-hidden max-h-[134px] fixed translate-x-[-50%] top-[70px] z-30`}
    >
      {analytics.map((e, i) => (
        <div
          key={i}
          className="flex flex-col gap-2.5 w-full cursor-pointer border-lightgreen duration-300 hover:border-b-5 py-4 px-6 hover:bg-xdarkgreen"
        >
          <h1 className="text-xs font-[300] opacity-[.7]">{e.title}</h1>
          <p className="text-3xl font-[600]">{e.value}</p>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-[#eeeeee0f] flex items-center text-xs">
              <span className="text-xlightgreen">
                {e.lastMonth > 0 ? "+" + e.lastMonth : e.lastMonth}%
              </span>
              {e.lastMonth > 0 ? (
                <FaArrowTrendUp className="text-[10px] ml-1 opacity-[.5]" />
              ) : (
                <FaArrowTrendDown className="text-[10px] ml-1 opacity-[.5]" />
              )}
            </div>
            <p className="text-[10px] opacity-[.7]">vs last month</p>
          </div>
        </div>
      ))}
      <div className="w-full p-4">
        <h1 className="text-xs font-[300] opacity-[.7]">Analytics</h1>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={chart} barCategoryGap="30%">
            <XAxis
              dataKey="month"
              stroke="var(--light-green)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--light-green)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              contentStyle={{ backgroundColor: "#1a1a1a", borderRadius: "8px", border: "none" }}
              labelStyle={{ color: "var(--light-green)", fontWeight: "bold" }}
            />
            <Bar dataKey="col1" fill="var(--light-green)" radius={[6, 6, 0, 0]} barSize={6} />
            <Bar dataKey="col2" fill="var(--light-green)" radius={[6, 6, 0, 0]} barSize={6} />
            <Bar dataKey="col3" fill="var(--light-green)" radius={[6, 6, 0, 0]} barSize={6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
