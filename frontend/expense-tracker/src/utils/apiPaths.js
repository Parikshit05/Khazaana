// export const BASE_URL = "http://localhost:8000";
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GET_USER_INFO: `${BASE_URL}/api/v1/auth/getUserInfo`,
    },
    DASHBOARD: {
         GET_DASHBOARD_DATA: `${BASE_URL}/api/v1/dashboard`,
    },
    INCOME: {
        ADD_INCOME: `${BASE_URL}/api/v1/income/add`,
        GET_ALL_INCOME: `${BASE_URL}/api/v1/income/all`,
        DELETE_INCOME: (id) => `${BASE_URL}/api/v1/income/delete/${id}`,
        DOWNLOAD_INCOME: `${BASE_URL}/api/v1/income/download/excel`,

    },
    EXPENSE: {
        ADD_EXPENSE: `${BASE_URL}/api/v1/expense/add`,
        GET_ALL_EXPENSE: `${BASE_URL}/api/v1/expense/all`,
        DELETE_EXPENSE: (id) => `${BASE_URL}/api/v1/expense/delete/${id}`,
        DOWNLOAD_EXPENSE: `${BASE_URL}/api/v1/expense/download/excel`,
    },
    IMAGE:{
        UPLOAD_IMAGE: `${BASE_URL}/api/upload`,
    },
};
