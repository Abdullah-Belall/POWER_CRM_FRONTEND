import axios from "axios";
import { COLLECTOR_REQ, getCookie } from "./refresh-token-req";
import { ComplaintStatusEnum } from "../enums/complaint-status-enum";

export const getProfile = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/complaints/${id}/finish`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return { done: true, data: res.data };
  });
