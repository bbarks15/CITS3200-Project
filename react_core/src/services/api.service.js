import axios from 'axios';
import Config from '../config';
import AuthService from './auth.service';
import CacheService from './cache.service';



export const APIService = axios.create({
  adapter: CacheService.adapter
})


export default {
  setupInterceptors: (history) => {
    APIService.defaults.baseURL = Config.api_root;
    APIService.defaults.headers = { 'Content-Type': 'application/json' };

    APIService.interceptors.request.use(
      request => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.access_token) {
          const token = 'Bearer ' + user.access_token;
          request.headers.Authorization = token;
        }
        return request;
      });


    APIService.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.status === 401) {
          AuthService.logout();
          history.push('/login');
        }
        return Promise.reject(error);
      });
  }
}

