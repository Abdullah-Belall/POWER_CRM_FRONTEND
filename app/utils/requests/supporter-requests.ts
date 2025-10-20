import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";

export const getSupportersComplaints = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
