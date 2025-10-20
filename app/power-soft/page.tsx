"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../utils/store/hooks";
import { fillAnalytics } from "../utils/store/slices/analytics-slice";

export default function PowerSoftDashboard() {
  const dispatch = useAppDispatch();
  const chart = [
    { month: "Jan", col1: 2.5, col2: 3.0, col3: 2.8 },
    { month: "Feb", col1: 1.8, col2: 2.4, col3: 2.1 },
    { month: "Mar", col1: 2.9, col2: 3.2, col3: 2.7 },
    { month: "Apr", col1: 1.2, col2: 1.9, col3: 1.5 },
    { month: "May", col1: 3.1, col2: 2.7, col3: 3.3 },
    { month: "Jun", col1: 2.0, col2: 2.3, col3: 2.6 },
    // { month: "Jul", col1: 2.8, col2: 3.1, col3: 2.9 },
    // { month: "Aug", col1: 1.9, col2: 2.2, col3: 2.0 },
    // { month: "Sep", col1: 2.3, col2: 2.8, col3: 2.5 },
    // { month: "Oct", col1: 2.7, col2: 3.0, col3: 3.2 },
    // { month: "Nov", col1: 1.5, col2: 1.9, col3: 2.1 },
    // { month: "Dec", col1: 2.2, col2: 2.6, col3: 2.9 },
  ];
  const analytics = [
    {
      title: "Total Clients",
      value: "83",
      lastMonth: 10,
      onclick: () => "",
    },
    {
      title: "New Clients",
      value: "12",
      lastMonth: 15,
      onclick: () => "",
    },
    {
      title: "Complaints",
      value: "32",
      lastMonth: -10,
      onclick: () => "",
    },
    {
      title: "Opened Complaints",
      value: "3",
      lastMonth: -10,
      onclick: () => "",
    },
  ];
  useEffect(() => {
    dispatch(fillAnalytics({ analytics, chart }));
  }, []);
  return <div></div>;
}
