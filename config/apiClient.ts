import axios from "axios";
import { render } from "vike/abort";
import { UNAUTHORIZED } from "@/server/constants/http";
import queryClient from "./queryClient";

const options = {
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}`,
  withCredentials: true,
};

// To avoid any interceptors defined on the default Axios instance or the API client,
// create a new separate instance for un-intercepted requests.
// https://stackoverflow.com/questions/70763748/axios-post-blocked-by-cors-using-cloudinary-api
export const CloudinaryClient = axios.create();

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      // try to refresh the access token behind the scenes
      try {
        // refresh the access token, then retry the original request
        await TokenRefreshClient.get("/api/auth/refresh");
        return TokenRefreshClient(config);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // handle refresh errors by clearing the query cache & redirecting to login
        queryClient.clear();
        throw render("/auth/login");
      }
    }

    return Promise.reject({ status, ...data });
  },
);

export default API;
