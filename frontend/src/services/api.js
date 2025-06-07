import axios from 'axios';
import { getAuthHeader } from './auth';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    config.headers.Authorization = authHeader.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Обработка случая, когда токен недействителен
      console.error('Unauthorized - возможно, нужно разлогинить пользователя');
    }
    return Promise.reject(error);
  }
);


/////////////////////////////////////

export const fetchChats = async () => {
  const response = await fetch('/api/chats');
  if (!response.ok) throw new Error('Failed to fetch chats');
  const data = await response.json();
  
  // Преобразуем данные в нужный формат
  return data.map(chat => ({
    chat_id: chat.id,
    title: chat.title || `Чат ${chat.id}`,
    type: chat.type,
    unread_count: chat.unread_count || 0
  }));
};

export const fetchWarnings = async () => {
  const response = await fetch('/api/warnings');
  if (!response.ok) throw new Error('Failed to fetch warnings');
  return await response.json();
};

export const markAsSpam = async (messageId) => {
  const response = await fetch('/api/mark-spam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message_id: messageId })
  });
  if (!response.ok) throw new Error('Failed to mark as spam');
};

export const markAsNotSpam = async (messageId) => {
  const response = await fetch('/api/mark-not-spam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message_id: messageId })
  });
  if (!response.ok) throw new Error('Failed to mark as not spam');
};


