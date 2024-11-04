import axios from 'axios';
import { getTokenLocal } from '../storages/token';

const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

instance.interceptors.request.use(async function (config) {
    const token = await getTokenLocal();
    config.data = { ...config.data, token };
    return config;
});

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log('>>>>>',error.response.status)
        return Promise.reject(error);
    }
);
export default instance;
