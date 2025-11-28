import React from 'react';

import LoginForm from '../components/auth/LoginForm';
import './HomePage.css'; // import the styles

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <LoginForm />
        
      </div>
    </div>
  );
};

export default LoginPage;
