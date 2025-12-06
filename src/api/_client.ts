import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants/api';

// BASE_URL 는 실제 API 서버의 루트 주소만 가지도록 합니다.
// 예) VITE_API_BASE_URL=http://54.180.234.73:8000
// 각 요청에서는 '/api/...' 와 같이 전체 경로를 지정합니다.
const client = axios.create({ baseURL: BASE_URL });

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError): Promise<never> | void => {
    if (error.response?.status === 401) {
      window.alert('로그인이 만료되었습니다.\n다시 로그인해주세요.');

      return;
    }

    window.alert('알 수 없는 오류가 발생되었습니다.\n잠시 후 다시 이용바랍니다.');

    return Promise.reject(error);
  }
);

export default client;
