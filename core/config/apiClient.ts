import axios from "axios";

const options = {
  baseURL:
    import.meta.env.MODE === "development"
      ? `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}`
      : `${import.meta.env.VITE_APP_BASE_URL}`,
  withCredentials: true,
};

// https://stackoverflow.com/questions/70763748/axios-post-blocked-by-cors-using-cloudinary-api
export const CloudinaryClient = axios.create();

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
