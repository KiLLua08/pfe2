import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import ScrolltoBottom from "react-scroll-to-bottom"

const socket = io("http://localhost:5000");

const ChatBox = ({ onClose, chats }) => {
  const [user, setUser] = useState(null);
  const [isChatCreated, setIsChatCreated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newChatSubject, setNewChatSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatSubject, setChatSubject] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (id && token) {
      setUser({ id, token });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const storedChatId = localStorage.getItem("chatId");
    if (storedChatId) {
      setChatId(storedChatId);
      setChatSubject(localStorage.getItem("chatSubject"));
      setIsChatCreated(true);
      loadMessages(storedChatId);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("recieveChat", (chat) => {
      chats((prevChats) => [...prevChats, chat]);
    });

    return () => {
      socket.off("message");
    };
  }, [chatId, chats]);

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(`/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleCreateChat = () => {
    if (user) {
      axios
        .post(
          "/chats",
          { subject: newChatSubject, creatorId: user.id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then((response) => {
          const newChatId = response.data.id;
          setChatId(newChatId);
          localStorage.setItem("chatId", newChatId);
          localStorage.setItem("chatSubject", newChatSubject);
          socket.emit("createdChat", response.data);
          setChatSubject(newChatSubject);
          setIsChatCreated(true);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleSendMessage = async () => {
    if (user && chatId && newMessage.trim()) {
      try {
        const messagePayload = {
          chatId: chatId,
          content: newMessage,
          senderId: user.id,
          attachment: null,
          seen: false,
        };
        const response = await axios.post(`/chats/${chatId}/messages`, messagePayload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        socket.emit("message", response.data); // Send message via WebSocket
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    } else {
      alert("Enter a message");
    }
  };

  return (
    <div className="chat-box card">
      {isChatCreated ? (
        <>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title">{chatSubject}</h3>
            <button className="btn btn-danger btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="card-body chat-messages">
            {messages.length === 0 ? (
              <p className="text-center">No messages yet</p>
            ) : (
              <ScrolltoBottom className="list-group">
              {messages.map((msg, index) => (
                <div key={index} className="list-group-item">
                  <strong>{msg.senderId} :</strong> {msg.content}
                </div>
              ))}
            </ScrolltoBottom>
            )}
          </div>
          <div className="card-footer d-flex">
            <input
              type="text"
              className="form-control"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button className="btn btn-primary ml-2" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="card-body chat-creation">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={newChatSubject}
              onChange={(e) => setNewChatSubject(e.target.value)}
              placeholder="Enter chat subject..."
            />
          </div>
          <button className="btn btn-success" onClick={handleCreateChat}>
            Create Chat
          </button>
          {loading && <p>Loading...</p>}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
