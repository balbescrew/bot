import React from 'react';
import './ActionButtons.css';

const ActionButtons = ({ onSpam, onNotSpam }) => {
  return (
    <div className="action-buttons">
      <button className="spam-button" onClick={onSpam}>
        Спам
      </button>
      <button className="not-spam-button" onClick={onNotSpam}>
        Не спам
      </button>
    </div>
  );
};

export default ActionButtons;