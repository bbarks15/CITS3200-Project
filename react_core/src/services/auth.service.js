import React from "react";
import axios from "axios";
import Config from '../config';
import CacheService from './cache.service';

const AUTH_URL = Config.auth_root;

export const UserContext = React.createContext();

const defaultOptions = {
    baseURL: Config.auth_root,
    headers: {
      'Content-Type': 'application/json',
    },
  };

class AuthService {
  AuthProvider = axios.create(defaultOptions);

  async login(username, password) {
    return this.AuthProvider
      .post(AUTH_URL + "login", {
        username,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response;
      })
  }

  logout() {
    localStorage.removeItem("user");
    CacheService.invalidate();
  }

  isAuth() {
    return localStorage.getItem('user');
  }
}

export default new AuthService();
