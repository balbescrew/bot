import {api} from './api';
import { storeToken, getToken, clearToken } from './storage';
import axios from 'axios';

const API_URL = 'http://10.10.127.4'; // Замените на ваш URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, {
      email,
      password
    });
    
    // Предполагаем, что сервер возвращает { access_token: "ваш.jwt.токен" }
    const { access_token } = response.data;
    
    // Сохраняем токен в localStorage
    localStorage.setItem('token', access_token);
    
    return { success: true, token: access_token };
  } catch (error) {
    console.error('Ошибка входа:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Ошибка входа' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};