import React from 'react';
import MessageHeader from '../MessageHeader/MessageHeader';
import ActionButtons from '../ActionButtons/ActionButtons';
import './MessageView.css';

const MessageView = ({ message, onSpam, onNotSpam }) => {
  return (
    <div className="message-view">
      <MessageHeader 
        messageId={message.message_id}
        userId={message.user_id}
        chatId={message.chat_id}
      />
      
      <div className="message-content">
        {message.text}
      </div>
      
      <ActionButtons 
        onSpam={onSpam}
        onNotSpam={onNotSpam}
      />
    </div>
  );
};

export default MessageView;