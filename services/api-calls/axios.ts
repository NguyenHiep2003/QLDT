import axios from 'axios';
import { getTokenLocal } from '../storages/token';
import {
    ForbiddenException,
    InternalServerError,
    NetworkError,
    UnauthorizedException,
} from '@/utils/exception';
import NetInfo from '@react-native-community/netinfo';

const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

instance.interceptors.request.use(async function (config) {
    const token = await getTokenLocal();
    if (config.headers['no-need-token']) return config;
    config.data = { ...config.data, token };
    return config;
});

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    async function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const data = error.response?.data;
        console.log('>>>>>', data?.meta?.code ?? data?.status_code);
        console.log('error axios', JSON.stringify(error));
        const httpStatusCode = error.response?.status;
        if (httpStatusCode == 401)
            return Promise.reject(new UnauthorizedException(data));
        if (httpStatusCode == 403)
            return Promise.reject(new ForbiddenException(data));
        else if (httpStatusCode)
            return Promise.reject(new InternalServerError(data));
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable) {
            return Promise.reject(new InternalServerError(data));
        }
        return Promise.reject(new NetworkError(data));
    }
);
export default instance;
