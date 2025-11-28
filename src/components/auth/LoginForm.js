import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import './auth-form.css';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      // If error is due to deactivated account, show activate option
      if (msg.toLowerCase().includes('deactivated') || msg.toLowerCase().includes('inactive')) {
        setShowActivate(true);
      }
    }
  };

  const [showActivate, setShowActivate] = useState(false);

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {showActivate && (
        <div style={{ marginTop: '18px', fontSize: '15px', color: '#007bff' }}>
          <p>Your account is deactivated. <Link to="/activate-account?email=" className="auth-form-link">Activate Account</Link></p>
        </div>
      )}
      <p style={{ marginTop: '18px', fontSize: '15px' }}>
        {' '}
        <Link to="/register" className="auth-form-link">Register</Link>
      </p>
      <p style={{ marginTop: '18px', fontSize: '15px' }}>
        {' '}
        <Link to="/reset-password" className="auth-form-link">Reset password</Link>
      </p>
    </div>
  );
}

export default LoginForm;
