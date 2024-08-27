import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Form } from 'react-bootstrap';
import ScrolltoBottom from "react-scroll-to-bottom"
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatComponent = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const [chatId, setChatId] = useState(null);
  const [chatSubject, setChatSubject] = useState("");
  const [isChatSelected, setIsChatSelected] = useState(false);

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
    const fetchChats = async () => {
      try {
        const response = await axios.get('/chats/');
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats', error);
      }
    };
    fetchChats();
  }, [user]);

  const handleChatClick = useCallback(async (id) => {
    setChatId(id);
    try {
      const response = await axios.get(`/chats/${id}/messages`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      socket.emit("joinChat", id);
      setSelectedChatMessages(response.data);
      setIsChatSelected(true);
    } catch (error) {
      console.error('Failed to fetch chat messages', error);
    }
  }, [user]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
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

        await axios.post(`/chats/${chatId}/messages`, messagePayload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        socket.emit("send_message", messagePayload);

        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    } else {
      alert("Enter a message");
    }
  };

  useEffect(() => {
    socket.on('recieve_message', (message) => {
      setSelectedChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('recieve_message');
    };
  }, [socket]);

  return (
    <Container fluid className="p-3 bg-light">
      <Row>
        <Col xs={12} md={4} className="mb-3">
          <h5 className="font-weight-bold mb-3">Chats</h5>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                {chats.length === 0 ? (
                  <ListGroup.Item>No chats available</ListGroup.Item>
                ) :
                (
                  chats.map((chat, index) => (
                    chat.Messages.length !== 0 && (
                      <ListGroup.Item
                        key={`${chat.id}-${index}`}
                        action
                        onClick={() => handleChatClick(chat.id)}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <div>
                            <p className="mb-1 fw-bold">
                              {chat.subject.toUpperCase()}
                            </p>
                            <p className="mb-0 text-muted">
                              {chat.Messages[chat.Messages.length - 1]?.content.slice(0, 10) + '...'}
                            </p>
                          </div>
                        </div>
                      </ListGroup.Item>
                    )
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card>
            <Card.Body>
              <h3>{isChatSelected ? chatSubject : ''}</h3>
              <ListGroup variant="flush">
                {selectedChatMessages.map((message, index) => (
                  <ListGroup.Item
                    key={`${message.id}-${index}`}
                    className="d-flex align-items-start mb-3"
                    style={{
                      justifyContent: localStorage.getItem('prenom') === message.Utilisateur?.prenom ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <img
                      src="assets/images/avatar/fallback.jpg"
                      alt="avatar"
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="" style={{ flex: 1 }}>
                      <Card style={{
                        backgroundColor: localStorage.getItem('prenom') === message.Utilisateur?.prenom ? '#F5F5DC' : '#B4B8A7',
                        maxWidth: '300px',
                        margin: '0',
                        padding: '10px',
                      }}>
                        <Card.Header>
                          <div className="flex justify-content-between">
                          <p className="fw-bold mb-0">
                              {message.Utilisateur?.nom}{message.Utilisateur?.prenom}
                            </p>
                            <p className="text-muted mb-0 small">
                              <i className="far fa-clock"></i> {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <p className="mb-0" style={{ color: '#333333' }}>{message.content}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <Form>
                <Form.Group controlId="messageTextarea">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleMessageChange}
                    style={{ resize: 'none' }}
                  />
                </Form.Group>
                <Button variant="info" className="mt-2" onClick={handleSendMessage}>Send</Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatComponent;
