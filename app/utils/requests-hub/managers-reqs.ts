import axios from "axios";
import { BASE_URL, errMsg } from "./common-reqs";
import { getCookie } from "../requests/refresh-token-req";

export const GET_COMPLAINT = async ({ complaint_id }: { complaint_id: string }) => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints/${complaint_id}`, {
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

export const MANAGERS_COMPLAINTS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints/managers`, {
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

export const GET_ROLES = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.roles
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

export const GET_ROLES_SELECT_LIST = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roles/select-list`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.roles
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

export const GET_USERS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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

export const ADD_USER = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/create`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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
export const CHANGE_PRIORITY_STATUS = async ({ data }: any) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/complaints/${data?.id}/change-priority-status`,
      { priority_status: data?.priority_status },
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
export const ASSIGN_SUPPORTER = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/complaints-assigner/assign`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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

export const START_SOLVE_COMPLAINT = async ({ complaint_id, data }: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints-solving/${complaint_id}/start-solving`,
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

export const ADD_ROLE = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/roles`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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

export const UPDATE_ROLE = async ({ data, id }: any) => {
  try {
    const response = await axios.patch(`${BASE_URL}/roles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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
