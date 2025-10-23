"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { selectCurrentUser } from "@/app/utils/store/slices/user-slice";
import ManagerComplaintsTable from "../tables/manager-complaints-table";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../common/black-layer/black-layer";
import RespondForm from "../forms/respond-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "@/app/utils/requests/refresh-token-req";
import { SupporterReferAcceptEnum } from "@/app/utils/enums/supporter-accept-status.enum";
import { useRouter } from "next/navigation";

export default function SupporterNotificationPopup({
  closeForm,
  data,
}: {
  closeForm: () => void;
  data: any;
}) {
  const router = useRouter();
  const currUser = useAppSelector((state) => selectCurrentUser(state));
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
  const queryClient = useQueryClient();
  const referResponse = useMutation({
    mutationFn: async (dataBody: any) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints-solving/${dataBody?.solvingId}/refer-response`,
        {
          accept_status: dataBody.accept_status,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      closeForm();
      dispatch(closePopup({ popup: "supporterReferResponse" }));
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Response successfully sended");
      router.push("/supporters/complaints");
      queryClient.invalidateQueries({ queryKey: ["supporter-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["supporter-notifi"] });
    },
    onError: (error: any) => {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data?.message);
    },
  });

  return (
    <>
      <div className="w-4xl bg-[#eee] p-3 rounded-md flex flex-col items-center">
        <h1 className="text-lg font-semibold text-black mx-auto w-fit">Notifications</h1>
        <div className="w-full max-h-[calc(100dvh-200px)] overflow-x-hidden overflow-y-scroll">
          <ManagerComplaintsTable data={data?.complaints} popup={"supporterReferResponse"} />
        </div>
      </div>
      {supporterReferResponse.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "supporterReferResponse" }))}>
          <RespondForm
            title={"Select An Option"}
            acceptSlug={`Accept`}
            refuseSlug={`Refuse`}
            onAccept={async () => {
              referResponse.mutateAsync({
                solvingId: supporterReferResponse.data?.solving[0]?.id,
                accept_status: SupporterReferAcceptEnum.ACCEPTED,
              });
            }}
            onRefuse={async () => {
              console.log(supporterReferResponse.data?.solving[0]?.id);
              referResponse.mutateAsync({
                solvingId: supporterReferResponse.data?.solving[0]?.id,
                accept_status: SupporterReferAcceptEnum.DECLINED,
              });
            }}
          />
        </BlackLayer>
      )}
    </>
  );
}
