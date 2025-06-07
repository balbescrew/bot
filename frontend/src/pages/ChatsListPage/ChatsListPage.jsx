import React, { useState, useEffect } from 'react';
import { fetchChats } from '../../services/api';
import './ChatsListPage.css';

const ChatsListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        // Предполагаем, что API возвращает массив чатов в формате:
        // [{ id: number, title: string }, ...]
        const data = await fetchChats();
        setChats(data);
      } catch (error) {
        console.error('Error loading chats:', error);
        // Можно добавить состояние ошибки для отображения пользователю
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleBackClick = () => {
    // Здесь можно использовать react-router или window.location
    window.location.href = '/';
  };

  const handleChatClick = (chatId) => {
    // Переход на страницу чата
    window.location.href = `/chat/${chatId}`;
  };

  return (
    <div className="chats-list-page">
      <button className="back-button" onClick={handleBackClick}>
        Вернуться на главную
      </button>
      
      <div className="content">
        <div className="top-bar">
          Название чата
        </div>
        
        <div className="menu">
          <div className="chats-list-box">
            {loading ? (
              <div className="loading">Загрузка чатов...</div>
            ) : chats.length === 0 ? (
              <div className="no-chats">Чатов не найдено</div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.id}
                  className="chat-item-button"
                  onClick={() => handleChatClick(chat.id)}
                >
                  {chat.title || `Чат ${chat.id}`}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsListPage;