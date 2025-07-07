import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./tableStyles.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-button"
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
    >
      Logout
    </button>
  );
};

export default LogoutButton;