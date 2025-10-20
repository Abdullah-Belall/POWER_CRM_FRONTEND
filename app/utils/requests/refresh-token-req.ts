import axios from "axios";
const unCountedMessage = `There is a problem, please call support.`;

export const REFRESH_TOKEN_REQ = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
      {
        withCredentials: true,
      }
    );
    if (response?.data?.access_token) {
      setCookie("access_token", response?.data?.access_token);
    }
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
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
export const COLLECTOR_REQ = async (
  reqFunc: (dataBody?: any) => Promise<{ done: true; data: any }>,
  dataBody?: any
) => {
  const access_token = getCookie("access_token");
  if (!access_token) {
    await REFRESH_TOKEN_REQ();
  }

  return await reqFunc(dataBody);
};
export const CLIENT_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  const access_token = getCookie("access_token");
  if (!access_token) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
  }
  const response = await varFunction(dataBody);
  if (!response.done && response.status === 401) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    const retryResponse = await varFunction(dataBody);
    return retryResponse;
  }
  return response;
};
//* COOKIES HANDLERS
export const setCookie = (keyName: string, value: string) => {
  document.cookie = `${keyName}=${value}; path=/; max-age=${15 * 60}; SameSite=Strict`;
};
export const getCookie = (keyName: string): string | null => {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${keyName}=`));
  return cookie ? cookie.split("=")[1] : null;
};
