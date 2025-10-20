import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";
import { ComplaintStatusEnum } from "../enums/complaint-status-enum";

export const getProfile = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });

export const changeComplaintStatus = ({
  id,
  status,
}: {
  id: string;
  status: ComplaintStatusEnum;
}) =>
  COLLECTOR_REQ(async () => {
    const res = await axios.post(
      `http://localhost:5000/api/complaints/${id}/finish`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return { done: true, data: res.data };
  });
