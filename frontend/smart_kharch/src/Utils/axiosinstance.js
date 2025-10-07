import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Requist interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            window.location.href = "/login";
        }
        else if (status === 500) {
            console.error("Server error. please try again later.");
        }
        else if (error.code === "ECONNABORTED") {
            console.error("Request timed out. please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;