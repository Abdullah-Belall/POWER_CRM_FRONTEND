"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import ManagerComplaintsTable from "../tables/manager-complaints-table";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../common/black-layer/black-layer";
import RespondForm from "../forms/respond-form";
import { SupporterReferAcceptEnum } from "@/app/utils/enums/supporter-accept-status.enum";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { REFER_RESPONSE } from "@/app/utils/requests-hub/supporters-reqs";
import { getCurrLang } from "@/app/utils/store/slices/languages-slice";
import { getDir } from "@/app/utils/base";

export default function SupporterNotificationPopup({ data }: { data: any }) {
  const notifiRefetch = useAppSelector((state) => selectPopup(state, "notifiRefetch"));
  const pathName = usePathname();
  const router = useRouter();
  const supporterReferResponse = useAppSelector((state) =>
    selectPopup(state, "supporterReferResponse")
  );
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const [loading, setLoading] = useState(false);
  const handleRefer = async (accept_status: SupporterReferAcceptEnum) => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(REFER_RESPONSE, {
      solvingId: supporterReferResponse.data?.solving[0]?.id,
      accept_status,
    });
    if (res.done) {
      dispatch(closePopup({ popup: "supporterReferResponse" }));
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Response successfully sended");
      if (pathName === "/supporter/complaints") {
        window.location.reload();
      } else {
        router.push("/supporters/complaints");
      }
      await notifiRefetch.data.refetch();
      dispatch(closePopup({ popup: "notifiRefetch" }));
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res?.message);
    }
    setLoading(false);
  };
  const lang = useAppSelector(getCurrLang());
  return (
    <>
      <div dir={getDir(lang)} className="w-4xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
        <h1 className="text-lg font-semibold text-black mx-auto w-fit">Notifications</h1>
        <div className="w-full max-h-[calc(100dvh-200px)] overflow-x-hidden overflow-y-scroll">
          <ManagerComplaintsTable data={data} popup={"supporterReferResponse"} />
        </div>
      </div>
      {supporterReferResponse.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "supporterReferResponse" }))}>
          <RespondForm
            title={"Select An Option"}
            acceptSlug={`Accept`}
            refuseSlug={`Refuse`}
            onAccept={async () => await handleRefer(SupporterReferAcceptEnum.ACCEPTED)}
            onRefuse={async () => await handleRefer(SupporterReferAcceptEnum.DECLINED)}
          />
        </BlackLayer>
      )}
    </>
  );
}
