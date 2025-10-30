"use client";
import BlackLayer from "@/app/components/common/black-layer/black-layer";
import ClientComplaintForm from "@/app/components/forms/client-complaint-form";
import ClientComplaintsTable from "@/app/components/tables/client-complaint-table";
import { ClientComplaintInterface } from "@/app/utils/interfaces/clients.interface";
import { CLIENT_COMPLAINTS } from "@/app/utils/requests-hub/clients-reqs";
import { CLIENT_COLLECTOR_REQ, CREATE_COMPLAINT } from "@/app/utils/requests-hub/common-reqs";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { closePopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import { openSnakeBar, SnakeBarTypeEnum } from "@/app/utils/store/slices/snake-bar-slice";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function ComplaintsPage() {
  const trans = useAppSelector(getPageTrans("clientsComplaintsPage"));
  const [createNewPopup, setCreateNewPopup] = useState(false);
  const [data, setData] = useState<ClientComplaintInterface[]>([]);
  const dispatch = useAppDispatch();
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const clientComplaintDetails = useAppSelector((state) =>
    selectPopup(state, "clientComplaintDetails")
  );
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(CLIENT_COMPLAINTS);
    if (res.done) {
      setData(res.data?.complaints);
    } else {
      // router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleCreateComplaint = async (data: any) => {
    const res = await CLIENT_COLLECTOR_REQ(CREATE_COMPLAINT, {
      data,
    });
    if (res.done) {
      setCreateNewPopup(false);
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Created complaint successfully");
      await fetchData();
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };

  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-full flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <Button onClick={() => setCreateNewPopup(true)} variant="contained">
              {trans.btn}
            </Button>
          </div>
          <ClientComplaintsTable data={data} />
        </div>
      </div>
      {createNewPopup && (
        <BlackLayer onClick={() => setCreateNewPopup(false)}>
          <ClientComplaintForm
            closeForm={() => setCreateNewPopup(false)}
            onDone={(data: any) => handleCreateComplaint(data)}
          />
        </BlackLayer>
      )}
      {clientComplaintDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "clientComplaintDetails" }))}>
          <ClientComplaintForm
            closeForm={() => dispatch(closePopup({ popup: "clientComplaintDetails" }))}
            initialData={clientComplaintDetails.data}
          />
        </BlackLayer>
      )}
    </>
  );
}
