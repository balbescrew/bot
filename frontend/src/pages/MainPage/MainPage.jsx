import React, { useState, useEffect } from 'react';
import { fetchChats, fetchWarnings } from '../../services/api';
import './MainPage.css';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [items, setItems] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unprocessedMessages, setUnprocessedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки непрочитанных сообщений
  const fetchUnprocessedMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://10.10.127.4/messages/unprocessed', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
      }

      const data = await response.json();
      setUnprocessedMessages(data);
      // Устанавливаем первое сообщение как выбранное по умолчанию
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnprocessedMessages();
  }, []);

  const handleItemClick = (message) => {
    setSelectedMessage(message);
  };

  const processMessage = async (messageId, isSpam) => {
    if (!messageId || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const url = `http://10.10.127.4/messages/${messageId}/process`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_spam: isSpam
        })
      });

      if (response.ok) {
        // Удаляем обработанное сообщение из списка
        setUnprocessedMessages(prev => prev.filter(msg => msg.message_id !== messageId));
        // Выбираем следующее сообщение или null, если список пуст
        setSelectedMessage(prev => {
          const remaining = unprocessedMessages.filter(msg => msg.message_id !== messageId);
          return remaining.length > 0 ? remaining[0] : null;
        });
      } else {
        console.error('Failed to process message:', await response.text());
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpamAction = () => {
    if (selectedMessage) {
      processMessage(selectedMessage.message_id, true);
    }
  };

  const handleNotSpamAction = () => {
    if (selectedMessage) {
      processMessage(selectedMessage.message_id, false);
    }
  };

  return (
    <div className="content">
      <div className="header-box">
        <h2>Панель управления</h2>
        <button 
          onClick={fetchUnprocessedMessages}
          disabled={isLoading}
          className="refresh-button"
        >
          {isLoading ? 'Загрузка...' : 'Обновить'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="menu">
        {/* Список непрочитанных сообщений */}
        <div className="messages-list">
          <h3>Непрочитанные сообщения:</h3>
          {isLoading ? (
            <p>Загрузка сообщений...</p>
          ) : unprocessedMessages.length === 0 ? (
            <p>Нет непрочитанных сообщений</p>
          ) : (
            <ul>
              {unprocessedMessages.map(msg => (
                <li 
                  key={msg.message_id} 
                  onClick={() => handleItemClick(msg)}
                  className={selectedMessage?.message_id === msg.message_id ? 'selected' : ''}
                >
                  {msg.user_first_name || 'Аноним'}: {msg.text ? msg.text.slice(0, 50) + (msg.text.length > 50 ? '...' : '') : 'Нет текста'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="info-box">
          {selectedMessage ? (
            `ID User: ${selectedMessage.user_id}, ID Message: ${selectedMessage.message_id}, ID Chat: ${selectedMessage.chat_id}`
          ) : (
            "Выберите сообщение для просмотра деталей"
          )}
        </div>
        
        <div className="chats-list-box">
          {selectedMessage ? (
            <div className="message-content">
              <pre>{selectedMessage.text || 'Нет текста сообщения'}</pre>
              {selectedMessage.spam_score && (
                <p className="spam-score">Вероятность спама: {(selectedMessage.spam_score * 100).toFixed(2)}%</p>
              )}
            </div>
          ) : (
            "Выберите сообщение для просмотра текста"
          )}
        </div>

        <div className="spam-buttons">
          <button 
            className="button spam-button" 
            onClick={handleNotSpamAction}
            disabled={!selectedMessage || isProcessing}
          >
            {isProcessing ? 'Обработка...' : 'НЕ СПАМ'}
          </button>
          <button 
            className="button spam-button spam" 
            onClick={handleSpamAction}
            disabled={!selectedMessage || isProcessing}
          >
            {isProcessing ? 'Обработка...' : 'СПАМ'}
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