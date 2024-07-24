import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Main from './MainPage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://172.10.5.46:80/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      alert('Login successful!');
      navigate('/main');
    } else {
      alert('Login failed!');
    }
  };

  const handleSignUpClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const response = await fetch("http://172.10.5.46:80/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      alert('Sign up successful!');
      handleModalClose();
    } else {
      alert('Sign up failed!');
    }
  };

  return (
    <div className="entire-page">
      <div className="entire-section">
        <div className="mood-section">
          <div className="logo-section"></div>
          <div className="backimage-section"></div>
        </div>

        <div className="login-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login Your Account</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="signup-link" onClick={handleSignUpClick}>Sign up</div>
            <button type="submit" className="submit-button">Sign in</button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-close" onClick={handleModalClose}>X</div>
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSignUpSubmit}>
              <input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="submit-button">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
};

export default App;