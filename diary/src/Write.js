import React, { useState } from 'react';
import './Write.css';
import headerImage from './logo.png';
import { useLocation, useNavigate } from 'react-router-dom';


const Write = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const handleTextChange = (event) => {
    setMarkdownText(event.target.value);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    const requestData = {
      content: markdownText,
      user_id: userId,
      created_at: new Date().toISOString().split('T')[0]
    };

    setLoading(true); // 로딩 시작

    try {
      const response = await fetch('http://172.10.5.46:80/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Request successful');
        // Add any additional actions on success, e.g., navigate to another page
      } else {
        alert('Request failed');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request');
    }

    setLoading(false); // 로딩 종료
    navigate(-1);
  };

  return (
    <div>
      <div className="inner_header">
        <img 
          src={headerImage}
          alt="Logo" 
          className="header-image" 
          onClick={handleLogoClick} 
          style={{ cursor: 'pointer' }} 
        />
      </div>
      <textarea 
        placeholder="Content goes here..." 
        value={markdownText} 
        onChange={handleTextChange} 
        className="markdown-input"
      />
      <footer id="footer">
        <button onClick={handleSubmit}>완료</button>
      </footer>
    </div>
  );
};

export default Write;
