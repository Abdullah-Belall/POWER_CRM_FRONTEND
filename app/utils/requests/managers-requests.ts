import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";

export const getManagersComplaints = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/managers`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
export const getComplaint = (complaint_id: string) =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/${complaint_id}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return { done: true, data: res.data };
  });
export const getSupporters = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/supporters`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
