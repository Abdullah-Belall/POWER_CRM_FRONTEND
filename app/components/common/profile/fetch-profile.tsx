"use client";
import {
  CLIENT_COLLECTOR_REQ,
  CURR_USER_PROFILE,
  GET_ANALYTICS,
} from "@/app/utils/requests-hub/common-reqs";
import { getCookie, setCookie } from "@/app/utils/requests/refresh-token-req";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { AnalyticsInterface, fillAnalytics } from "@/app/utils/store/slices/analytics-slice";
import { changeLang, getCurrLang, getPageTrans } from "@/app/utils/store/slices/languages-slice";
import { selectCurrentUserId, setCurrentUser } from "@/app/utils/store/slices/user-slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FetchProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => selectCurrentUserId(state));
  const [analytics, setAnalytics] = useState<AnalyticsInterface[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>();
  const [roles, setRoles] = useState<string[]>([]);
  const analyticsTrans = useAppSelector(getPageTrans("analytics"));
  const lang = useAppSelector(getCurrLang());

  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(CURR_USER_PROFILE);
    if (res.done) {
      setCookie("lang", res.data.lang);
      dispatch(setCurrentUser(res.data));
      setRoles(res.data?.role?.roles);
      const analyticsRes = await CLIENT_COLLECTOR_REQ(GET_ANALYTICS);
      setAnalyticsData(analyticsRes.data);
    } else {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    if (analyticsData) {
      if (roles.includes("read-complaint")) {
        setAnalytics([
          {
            title: analyticsTrans.managerAnalytics[0],
            value: analyticsData?.totalManagerComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.managerAnalytics[1],
            value: analyticsData?.totalManagerDoneComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.managerAnalytics[2],
            value: analyticsData?.totalManagerOpenedComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.managerAnalytics[3],
            value: analyticsData?.totalManagerHighPriorityComplaints,
            lastMonth: 10,
          },
        ]);
      } else if (roles.includes("assignable")) {
        setAnalytics([
          {
            title: analyticsTrans.supporterAnalytics[0],
            value: analyticsData?.totalSupporterComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.supporterAnalytics[1],
            value: analyticsData?.totalSupporterDoneComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.supporterAnalytics[2],
            value: analyticsData?.totalSupporterOpenedComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.supporterAnalytics[3],
            value: analyticsData?.totalSupporterHighPriorityComplaints,
            lastMonth: 10,
          },
        ]);
      } else if (roles.includes("create-complaint")) {
        setAnalytics([
          {
            title: analyticsTrans.clientAnalytics[0],
            value: analyticsData?.totalClientComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.clientAnalytics[1],
            value: analyticsData?.totalClientDoneComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.clientAnalytics[2],
            value: analyticsData?.totalClientPendingComplaints,
            lastMonth: 10,
          },
          {
            title: analyticsTrans.clientAnalytics[3],
            value: analyticsData?.totalClientInProgressComplaints,
            lastMonth: 10,
          },
        ]);
      }
    }
  }, [analyticsData, lang]);

  useEffect(() => {
    fetchData();
    dispatch(
      changeLang({
        lang: (getCookie("lang") as "ar") || "ar",
      })
    );
  }, [user]);
  useEffect(() => {
    if (analytics.length > 0) {
      dispatch(
        fillAnalytics({
          analytics,
          offSetTop: 0,
        })
      );
    }
  }, [analytics]);
  return <></>;
}
