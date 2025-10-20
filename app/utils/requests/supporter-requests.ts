import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";

export const getSupportersComplaints = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get("http://localhost:5000/api/complaints", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
