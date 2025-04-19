import { useState } from 'react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Notify parent component
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="toggle-auth">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Auth; 