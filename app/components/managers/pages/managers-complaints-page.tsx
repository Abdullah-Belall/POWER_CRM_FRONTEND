"use client";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { useEffect, useMemo, useState } from "react";
import ManagerComplaintsTable from "../../tables/manager-complaints-table";
import { closePopup, openPopup, selectPopup } from "@/app/utils/store/slices/popup-slice";
import BlackLayer from "../../common/black-layer/black-layer";
import ManagerComplaintForm from "../../forms/manager-complaint-form";
import { CLIENT_COLLECTOR_REQ } from "@/app/utils/requests-hub/common-reqs";
import { MANAGERS_COMPLAINTS } from "@/app/utils/requests-hub/managers-reqs";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import CreateComplaintForClient from "../../forms/create-complaint-for-client";
import { getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { fillTable, getTable } from "@/app/utils/store/slices/tables-data-slice";
import {
  fillInitialDataSearch,
  resetDataSearch,
  setSearchColumns,
} from "@/app/utils/store/slices/search-slice";
import CreateComplaintReportForm from "../../forms/create-complaint-report-form";
import { MdOutlineRefresh } from "react-icons/md";

export default function ManagersComplaintsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrLang());
  const managerComplaintDetails = useAppSelector((state) =>
    selectPopup(state, "managerComplaintDetails")
  );
  const createComplaintForClient = useAppSelector((state) =>
    selectPopup(state, "createComplaintForClient")
  );
  const createComplaintsReport = useAppSelector((state) =>
    selectPopup(state, "createComplaintsReport")
  );
  const trans = useAppSelector(getPageTrans("managersComplaintsPage"));

  const searchColumns = useMemo(() => {
    return [
      {
        alias: "client.user_name",
        slug: trans.table[0],
      },
      {
        alias: "complaint.full_name",
        slug: trans.table[1],
      },
      {
        alias: "complaint.phone",
        slug: trans.table[2],
      },
      {
        alias: "complaint.title",
        slug: trans.table[3],
      },
      {
        alias: "complaint.details",
        slug: trans.table[4],
      },
    ];
  }, [lang]);
  const searchObj = {
    search_in: "complaints",
    columns: searchColumns,
    fillFunc: (obj: { total: number; data: any[] }) => {
      dispatch(
        fillTable({
          tableName: "managerComplaintsTable",
          obj,
        })
      );
    },
  };
  const { data } = useAppSelector(getTable("managerComplaintsTable"));
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(MANAGERS_COMPLAINTS);
    if (res.done) {
      dispatch(
        fillTable({
          tableName: "managerComplaintsTable",
          obj: {
            total: res.data?.total,
            data: res.data?.complaints,
          },
        })
      );
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchData();
    dispatch(fillInitialDataSearch(searchObj));
  }, []);
  useEffect(() => {
    dispatch(
      setSearchColumns({
        columns: searchColumns,
      })
    );
  }, [lang]);
  const [refetchLoading, setRefetchLoading] = useState(false);
  return (
    <>
      <div className="flex gap-[20px]">
        <div className="w-full flex flex-col gap-[3px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl text-white">{trans.title}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (refetchLoading) return;
                  setRefetchLoading(true);
                  fetchData();
                  setRefetchLoading(false);
                }}
                className={`${
                  refetchLoading ? "animate-spin" : ""
                } cursor-pointer text-white text-2xl bg-lightgreen rounded-full px-1.5`}
              >
                <MdOutlineRefresh />
              </button>
              <Button
                onClick={() =>
                  dispatch(
                    openPopup({
                      popup: "createComplaintsReport",
                      data: { refetch: fetchData },
                    })
                  )
                }
                variant="contained"
              >
                {trans.reportBtn}
              </Button>
              <Button
                onClick={() =>
                  dispatch(
                    openPopup({
                      popup: "createComplaintForClient",
                      data: {},
                    })
                  )
                }
                variant="contained"
              >
                {trans.btn}
              </Button>
            </div>
          </div>
          <ManagerComplaintsTable data={data} popup={"managerComplaintDetails"} />
        </div>
      </div>
      {createComplaintForClient.isOpen && (
        <BlackLayer
          onClick={() => {
            dispatch(
              closePopup({
                popup: "createComplaintForClient",
              })
            );
            dispatch(
              closePopup({
                popup: "selectClientForCreateComplaint",
              })
            );
          }}
        >
          <CreateComplaintForClient
            closeForm={() => {
              dispatch(
                closePopup({
                  popup: "createComplaintForClient",
                })
              );
              dispatch(
                closePopup({
                  popup: "selectClientForCreateComplaint",
                })
              );
            }}
            refetch={fetchData}
          />
        </BlackLayer>
      )}
      {managerComplaintDetails.isOpen && (
        <BlackLayer onClick={() => dispatch(closePopup({ popup: "managerComplaintDetails" }))}>
          <ManagerComplaintForm
            closeForm={() => dispatch(closePopup({ popup: "managerComplaintDetails" }))}
            id={managerComplaintDetails.data?.id}
            refetchComplaints={fetchData}
          />
        </BlackLayer>
      )}
      {createComplaintsReport.isOpen && (
        <BlackLayer
          onClick={() =>
            dispatch(
              closePopup({
                popup: "createComplaintsReport",
              })
            )
          }
        >
          <CreateComplaintReportForm />
        </BlackLayer>
      )}
    </>
  );
}
