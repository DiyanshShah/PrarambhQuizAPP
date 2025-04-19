import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const WaitingRoom = ({ user }) => {
  const [testState, setTestState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTestState = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/test-state`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch test state');
        }

        setTestState(data);

        if (data.isTestActive) {
          window.location.href = '/round1';
        }
      } catch (err) {
        setError(err.message);
      }
    };

    // Check test state every 5 seconds
    const interval = setInterval(checkTestState, 5000);
    checkTestState(); // Initial check

    return () => clearInterval(interval);
  }, []);

  if (user.isKicked) {
    return (
      <motion.div 
        className="kicked-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>You have been removed from the test</h2>
        <p>Please contact the administrator if you believe this is a mistake.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="waiting-room"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Welcome, {user.username}!</h2>
      <p>Please wait for the test to begin...</p>
      {error && <div className="error-message">{error}</div>}
      <motion.div 
        className="waiting-animation"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ⏳
      </motion.div>
    </motion.div>
  );
};

export default WaitingRoom; 