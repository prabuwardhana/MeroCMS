import axios from "axios";

const options = {
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}`,
  withCredentials: true,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const { status, data } = response || {};

    return Promise.reject({ status, ...data });
  },
);

export default API;
