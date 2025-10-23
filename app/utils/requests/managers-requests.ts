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
    //! Make it Dynamic
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?role=Supporter`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
export const getManagersRoles = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
export const getManagersUsers = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });

export const getManagersRolesSelectList = () =>
  COLLECTOR_REQ(async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/select-list`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return { done: true, data: res.data };
  });
