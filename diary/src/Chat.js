import React, { useState, useEffect } from 'react';
import './Chat.css';
import headerImage from './logo.png'; // 이미지 파일 가져오기
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const username = location.state?.username;
  const tId = location.state?.threadId;

  console.log(tId);
  const [threadId, setThreadId] = useState(tId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [emotionPercentages, setEmotionPercentages] = useState({});
  const baseURL = process.env.REACT_APP_BASE_URL;

  const toPastelColor = (r, g, b, pastelFactor = 0.5) => {
    r = (r + 255 * pastelFactor) / (1 + pastelFactor);
    g = (g + 255 * pastelFactor) / (1 + pastelFactor);
    b = (b + 255 * pastelFactor) / (1 + pastelFactor);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const emotionColors = {
    "공포": toPastelColor(0, 0, 0),        // 검정
    "놀람": toPastelColor(128, 0, 128),    // 보라
    "분노": toPastelColor(255, 0, 0),      // 빨강
    "슬픔": toPastelColor(0, 0, 255),      // 파랑
    "중립": toPastelColor(128, 128, 128),  // 회색
    "행복": toPastelColor(255, 255, 0),    // 노랑
    "혐오": toPastelColor(0, 255, 0),      // 초록
    "불안": toPastelColor(255, 165, 0)     // 주황
  };

  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/main', { state: { userId } });
  };

  const sendMessage = async () => {
    if (!input || !threadId) return;

    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');

    console.log(username);
    const response = await fetch(`http://172.10.5.46:80/chat_response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input, thread_id: threadId, username: username }),
    });

    const data = await response.json();
    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: data.message }]);
  };

  const endConversation = async () => {
    if (!threadId) return;

    const response = await fetch(`http://172.10.5.46:80/end_conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thread_id: threadId, user_id: userId, created_at: new Date().toISOString().split('T')[0] }),
    });

    const data = await response.json();
    setShowPopup(true); // First, show the popup
    setTimeout(() => {
      setEmotionPercentages(data.emotion_percentages); // Then, set the emotion percentages after a short delay
    }, 100);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ChatPage">
      <div className="Chat-header">
        <img
          src={headerImage}
          alt="Logo"
          className="header-image"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="chat-container">
        <h2>Diary Chatbot</h2>
        <button className="end-button" onClick={endConversation}>End Conversation</button>
        <div id="chatbox">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="textarea-container">
          <textarea
            id="message"
            rows="3"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
        {showPopup && (
          <div className="popup-overlay" onClick={() => setShowPopup(false)}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h3>감정 상태</h3>
              <div>
                {Object.entries(emotionPercentages).map(([emotion, percentage]) => (
                  <div key={emotion} className="emotion-bar-container">
                    <div className="emotion-label">{emotion}: {(percentage * 100).toFixed(2)}%</div>
                    <div className="emotion-bar" style={{ width: `${percentage * 100}%`, maxWidth: '100%', backgroundColor: emotionColors[emotion] }}></div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate(-1)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
