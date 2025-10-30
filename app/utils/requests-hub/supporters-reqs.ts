import axios from "axios";
import { getCookie } from "../requests/refresh-token-req";
import { BASE_URL, errMsg } from "./common-reqs";

export const GET_SUPPORTER_COMPLAINT = async ({ complaint_id }: { complaint_id: string }) => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints/${complaint_id}/supporter`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.id
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
export const SUPPORTERS_COMPLAINTS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.complaints
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const SUPPORTER_NOTIFICATIONS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints/supporter-notifi`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.complaints
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const GET_USERS = async (data: { roleAttributes?: string }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users?${data?.roleAttributes ? `roleAttributes=` + data?.roleAttributes : ""}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.users
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const REFER_SUPPORTER = async (data: { complaint_id: string; supporter_id: string }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints-solving/${data?.complaint_id}/refer-to/${data?.supporter_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const REFER_RESPONSE = async (data: { solvingId: string; accept_status: string }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints-solving/${data?.solvingId}/refer-response`,
      { accept_status: data?.accept_status },
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const FINISH_SOLVE = async ({ data }: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints/${data?.id}/finish`,
      { status: data?.status },
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
