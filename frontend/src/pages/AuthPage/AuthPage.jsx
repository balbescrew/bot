import React from 'react';
import LoginForm from '../../components/Auth/LoginFrom';
import './AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default AuthPage;