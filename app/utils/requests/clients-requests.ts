import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";

export const getClientComplaints = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/clients`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
