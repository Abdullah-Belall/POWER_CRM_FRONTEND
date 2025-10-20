import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";

export const getManagersComplaints = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get("http://localhost:5000/api/complaints/managers", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
export const getComplaint = (complaint_id: string) =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`http://localhost:5000/api/complaints/${complaint_id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
export const getSupporters = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`http://localhost:5000/api/users/supporters`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
