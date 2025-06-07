import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange, items, onItemClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
        <button
          className={`tab-button ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => onTabChange('chats')}
        >
          Список чатов
        </button>
        <button
          className={`tab-button ${activeTab === 'warnings' ? 'active' : ''}`}
          onClick={() => onTabChange('warnings')}
        >
          Список предупреждений
        </button>
      </div>
      
      <div className="items-list">
        {items.map(item => (
          <div 
            key={item.message_id} 
            className="item"
            onClick={() => onItemClick(item)}
          >
            {item.text.substring(0, 50)}...
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;