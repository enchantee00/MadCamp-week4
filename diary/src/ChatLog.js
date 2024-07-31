import React, { useEffect, useState } from 'react';
import './Chat.css';
import { useLocation, useNavigate } from 'react-router-dom';
import headerImage from './logo.png'; // 이미지 파일 가져오기


const ChatLog = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const diaryId = location.state?.diaryId;
  const [diary, setDiary] = useState(null);
  const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  console.log(userId, diaryId);

  const handleLogoClick = () => {
    navigate('/main', { state: { userId } });
  };

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        
        const response = await fetch(`http://172.10.5.46:80/read/${userId}/${diaryId}`);
        // const response = await fetch(`http://172.10.5.46:80/read/1/20`);
        const data = await response.json();
        if (data.status === 'success') {
          setDiary(data.diary);
        } else {
          console.error('Failed to fetch diary:', data.message);
        }
      } catch (error) {
        console.error('Error fetching diary:', error);
      }
    };

    fetchDiary();
  }, [userId, diaryId, baseURL]);

  if (!diary) {
    return <div>Loading...</div>;
  }

  const messages = diary.content.split('[CLS]').map((msg, index) => ({
    sender: index % 2 === 0 ? 'user' : 'bot',
    text: msg.trim(),
  }));

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
        <h2>Diary Chatbot Record</h2>
        <div id="chatboxlog">
            {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
                <div className="message-content">
                {msg.text}
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};

export default ChatLog;