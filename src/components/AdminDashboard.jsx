import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = ({ user }) => {
  const [testState, setTestState] = useState(null);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchTestState = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/test-state`);
        const data = await response.json();
        if (response.ok) {
          setTestState(data);
        }
      } catch (error) {
        setError('Failed to fetch test state');
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/participants`);
        const data = await response.json();
        if (response.ok) {
          setParticipants(data);
        }
      } catch (error) {
        setError('Failed to fetch participants');
      }
    };

    fetchTestState();
    fetchParticipants();
    const interval = setInterval(() => {
      fetchTestState();
      fetchParticipants();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartTest = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/start-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTestState(data);
      } else {
        setError(data.error || 'Failed to start test');
      }
    } catch (error) {
      setError('Failed to start test');
    }
  };

  const handleEndTest = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/end-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTestState(data);
      } else {
        setError(data.error || 'Failed to end test');
      }
    } catch (error) {
      setError('Failed to end test');
    }
  };

  const handleKickParticipant = async (participantId) => {
    try {
      const response = await fetch(`${API_URL}/admin/kick/${participantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setParticipants(participants.filter(p => p._id !== participantId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to kick participant');
      }
    } catch (error) {
      setError('Failed to kick participant');
    }
  };

  return (
    <motion.div 
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Admin Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="test-controls">
        <h3>Test Controls</h3>
        <div className="test-status">
          <p>Test Status: {testState?.isTestActive ? 'Active' : 'Inactive'}</p>
          <p>Current Round: {testState?.currentRound}</p>
          <p>Time Limit: {testState?.questionTimeLimit} seconds</p>
        </div>
        <div className="control-buttons">
          {!testState?.isTestActive ? (
            <button onClick={handleStartTest} className="start-btn">
              Start Test
            </button>
          ) : (
            <button onClick={handleEndTest} className="end-btn">
              End Test
            </button>
          )}
        </div>
      </div>

      <div className="participants-list">
        <h3>Participants ({participants.length})</h3>
        <div className="participants-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant._id}>
                  <td>{participant.username}</td>
                  <td>{participant.email}</td>
                  <td>{participant.isKicked ? 'Kicked' : 'Active'}</td>
                  <td>
                    {!participant.isKicked && (
                      <button 
                        onClick={() => handleKickParticipant(participant._id)}
                        className="kick-btn"
                      >
                        Kick
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard; 