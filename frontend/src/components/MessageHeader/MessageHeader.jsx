import React from 'react';
import './MessageHeader.css';

const MessageHeader = ({ messageId, userId, chatId }) => {
  return (
    <div className="message-header">
      <div className="header-row">
        <span className="label">Message ID:</span>
        <span className="value">{messageId}</span>
      </div>
      <div className="header-row">
        <span className="label">User ID:</span>
        <span className="value">{userId}</span>
      </div>
      <div className="header-row">
        <span className="label">Chat ID:</span>
        <span className="value">{chatId}</span>
      </div>
    </div>
  );
};

export default MessageHeader;