export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GET_USER_INFO: `${BASE_URL}/api/v1/auth/getUserInfo`,
    },
    DASHBOARD: `${BASE_URL}/api/v1/dashboard`,
    INCOME: {
        ADD_INCOME: `${BASE_URL}/api/v1/income/add`,
        GET_ALL_INCOME: `${BASE_URL}/api/v1/income`,
        DELETE_INCOME: (id) => `${BASE_URL}/api/v1/income/delete/${id}`,
        DOWNLOAD_INCOME: `${BASE_URL}/api/v1/income/downloadExcel`,

    },
    EXPENSE: {
        ADD_EXPENSE: `${BASE_URL}/api/v1/expense/add`,
        GET_ALL_EXPENSE: `${BASE_URL}/api/v1/expense`,
        DELETE_EXPENSE: (id) => `${BASE_URL}/api/v1/expense/delete/${id}`,
        DOWNLOAD_EXPENSE: `${BASE_URL}/api/v1/expense/downloadExcel`,
    },
    IMAGE:{
        UPLOAD_IMAGE: `${BASE_URL}/api/upload`,
    },
};
