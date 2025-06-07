import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WarningsPage.css';

const WarningsPage = () => {
  const navigate = useNavigate();
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из БД
  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        // Замените на ваш реальный API-вызов
        const response = await fetch('/api/warnings');
        const data = await response.json();
        setWarnings(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке предупреждений:', error);
        setIsLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="warnings-page">
      <button className="back-button" onClick={handleBackClick}>
        Вернуться на главную
      </button>
      <button className="filter-button">Фильтр по чату</button>
      
      <div className="content-warnings">
        <div className="top-bar">
          Список предупреждений
        </div>
        
        <div className="menu">
          <div className="chats-list-box">
            {isLoading ? (
              <div className="loading-message">Загрузка...</div>
            ) : warnings.length === 0 ? (
              <div className="no-warnings">Нет предупреждений</div>
            ) : (
              warnings.map((warning, index) => (
                <button 
                  key={warning.id || index}
                  className="chat-item-button"
                  onClick={() => navigate(`/warning/${warning.id}`)}
                >
                  Предупреждение {index + 1}: {warning.message || warning.reason}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningsPage;