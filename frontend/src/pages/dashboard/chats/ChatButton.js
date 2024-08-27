import React, { useState } from "react";
import ChatBox from '../chats/ChatBox.js'

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button className="chat-button" onClick={toggleChatBox}>
        💬
      </button>
      {isOpen && <ChatBox onClose={toggleChatBox} />}
    </div>
  );
};

export default ChatButton;
