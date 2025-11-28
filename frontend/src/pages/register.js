import React from 'react';

import RegisterForm from '../components/auth/RegisterForm';
import './HomePage.css'; // import the styles

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
