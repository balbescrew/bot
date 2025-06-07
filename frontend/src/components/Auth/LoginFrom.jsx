import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');



    const result = await login(email, password);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Дополнительные действия после успешного входа
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Перенаправление на предыдущую страницу или по умолчанию
        const returnTo = '/';
        navigate(returnTo, { replace: true });
      } else {
        setError(result.message || 'Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError('Произошла ошибка при входе. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Вход</h2>
      {error && <div className="login-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="login-label">Пароль</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;