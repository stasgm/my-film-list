import Axios, { AxiosRequestConfig } from 'axios';
import { lsUtils } from '../utils';
// import { FetchError } from './apiFilms';

export const apiClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

// const convertAxiosError = (error: AxiosError) => {
//   const e = error.toJSON();
//   if (error.response) {
//     const { status, statusText, data } = error.response;
//     return {
//       ...e, response: {
//         data,
//         status,
//         statusText
//       }
//     };
//   }

//   return e;
// };

apiClient.interceptors.request.use((config: AxiosRequestConfig = {}) => {
  const token = lsUtils.getToken();
  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // const message = error.response?.data?.message || error.message;
    // console.log({
    //   type: 'error',
    //   title: 'Error',
    //   message,
    // });
    // const err = convertAxiosError(error);
    // return Promise.reject(
    //   new FetchError(
    //     error.response.config.method,
    //     error.response.config.url,
    //     error.response.request.status,
    //     error.response.request.code,
    //     "Failed to fetch"
    //   ));
    return Promise.reject(error);
  }
);


// const request = async ({ ...options }) => {
//   apiClientClient.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

//   const onSuccess = (response: any) => response;
//   const onError = (error: any) => {
//     // optionaly catch errors and add some additional logging here
//     return error;
//   }

//   try {
//     const response = await apiClientClient(options);
//     return onSuccess(response);
//   } catch (error) {
//     return onError(error);
//   }
// }

export default apiClient;
