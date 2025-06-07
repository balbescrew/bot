import React, { useState, useEffect } from 'react';
import { fetchChats, fetchWarnings } from '../../services/api';
import './MainPage.css';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [items, setItems] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = activeTab === 'chats' 
          ? await fetchChats() 
          : await fetchWarnings();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleItemClick = (message) => {
    setSelectedMessage(message);
  };

  const handleSpamAction = () => {
    console.log('Marked as spam:', selectedMessage.message_id);
    // Здесь будет логика отправки на бэкенд
  };

  const handleNotSpamAction = () => {
    console.log('Marked as not spam:', selectedMessage.message_id);
    // Здесь будет логика отправки на бэкенд
  };

  return (
    <div className="content">
      <div className="header-box">
        <h2>Панель управления</h2>
      </div>
      
      <div className="menu">
        <div className="info-box">
          {selectedMessage ? (
            `ID User: ${selectedMessage.user_id}, ID Message: ${selectedMessage.message_id}, ID Chat: ${selectedMessage.chat_id}`
          ) : (
            "ID User, ID Message, ID Chat"
          )}
        </div>
        
        <div className="chats-list-box">
          {selectedMessage ? (
            selectedMessage.text
          ) : (
            "Текст сообщения"
          )}
        </div>

        <div className="spam-buttons">
          <button 
            className="button spam-button" 
            onClick={handleNotSpamAction}
          >
            НЕ СПАМ
          </button>
          <button 
            className="button spam-button spam" 
            onClick={handleSpamAction}
          >
            СПАМ
          </button>
        </div>
      </div>
      
      <div className="menu-buttons">
        <button 
          className={`button ${activeTab === 'warnings' ? 'active' : ''}`}
          onClick={() => window.location.href = '/warnings'}
        >
          Список предупреждений
        </button>
        <button 
          className="button"
          onClick={() => window.location.href = '/chats'} 
        >
          Список чатов
        </button>
      </div>
    </div>
  );
};

export default MainPage;