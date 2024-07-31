import React, { useState } from 'react';
import './Write.css';
import headerImage from './logo.png';
import { useLocation, useNavigate } from 'react-router-dom';


const Edit = () => {
  
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const diaryId = location.state?.diaryId;
  const diarycontent = location.state?.content;
  const [markdownText, setMarkdownText] = useState(diarycontent);

  const handleTextChange = (event) => {
    setMarkdownText(event.target.value);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    const requestData = {
      content: markdownText,
      diary_id: diaryId,
    };

    setLoading(true); // 로딩 시작

    try {
      const response = await fetch('http://172.10.5.46:80/edit', {
        method: 'PATCH',
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
      <div className="input-container">
        <textarea 
          placeholder="Content goes here..." 
          value={markdownText} 
          onChange={handleTextChange} 
          className="markdown-input"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : '수정'}
        </button>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Edit;
