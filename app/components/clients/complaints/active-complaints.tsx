export default function ActiveComplaints() {
  return (
    <section className="w-full px-4 flex flex-col gap-[40px] text-black">
      <div>
        <h1 className="font-bold text-lg">Active Complaints</h1>
        <p className="font-[300] text-[#888] text-sm">Dashboard Drill-down</p>
      </div>
      <ul className="flex flex-col gap-[25px] w-full">
        <li className="flex gap-3 items-center w-full">
          <div className="rounded-[50%] p-2 border border-[#888]">40</div>
          <div>
            <h1>Payment Method</h1>
            <p className="font-[300] text-[#888] text-xs">my payment method is returning a error</p>
          </div>
        </li>
        <li className="flex gap-3 items-center w-full">
          <div className="rounded-[50%] p-2 border border-[#888]">49</div>
          <div>
            <h1>Payment Method</h1>
            <p className="font-[300] text-[#888] text-xs">my payment method is returning a error</p>
          </div>
        </li>
        <li className="flex gap-3 items-center w-full">
          <div className="rounded-[50%] p-2 border border-[#888]">63</div>
          <div>
            <h1>Payment Method</h1>
            <p className="font-[300] text-[#888] text-xs">my payment method is returning a error</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
