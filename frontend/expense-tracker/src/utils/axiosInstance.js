import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Set a timeout of 10 seconds
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor

axiosInstance.interceptors.request.use(
    (config) => {
        // You can add any custom logic before the request is sent
        // For example, adding an authorization token
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // You can add any custom logic for the response here
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                window.location.href = "/login";
            }else if(error.response.status === 500){
                console.error("Server error. Please try again later.");
            }
        }else if(error.code === "ECONNABORTED"){
            console.error("Request timed out. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
