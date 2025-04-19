import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Auth from './components/Auth'
import WaitingRoom from './components/WaitingRoom'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [testState, setTestState] = useState(null);

  const REQUIRED_ATTEMPTS = 10;
  const TOTAL_QUESTIONS = 20;
  const CORRECT_POINTS = 4;
  const WRONG_POINTS = -1;

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check test state
    const checkTestState = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/test-state`);
        const data = await response.json();
        if (response.ok) {
          setTestState(data);
        }
      } catch (error) {
        console.error('Error checking test state:', error);
      }
    };

    checkTestState();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSelectedLanguage(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAttemptedQuestions(0);
    setIsQuizComplete(false);
    setSkippedQuestions([]);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(138, 43, 226, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 4px 8px rgba(138, 43, 226, 0.2)",
      transition: { duration: 0.1 }
    }
  };

  const fetchQuestions = async (language) => {
    try {
      const response = await fetch(`/data/${language}-round1.json`);
      const data = await response.json();
      setQuestions(data.questions);
      setSelectedLanguage(language);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAttemptedQuestions(0);
      setSkippedQuestions([]);
      setIsQuizComplete(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAttemptedQuestions(prev => prev + 1);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + CORRECT_POINTS);
    } else {
      setScore(score + WRONG_POINTS);
    }
    
    moveToNextQuestion();
  };

  const handleSkip = () => {
    setSkippedQuestions([...skippedQuestions, currentQuestionIndex]);
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (attemptedQuestions >= REQUIRED_ATTEMPTS) {
        setIsQuizComplete(true);
      } else {
        // Show skipped questions if minimum attempts not met
        const nextSkipped = skippedQuestions.find(index => index < currentQuestionIndex);
        if (nextSkipped !== undefined) {
          setCurrentQuestionIndex(nextSkipped);
          setSkippedQuestions(skippedQuestions.filter(i => i !== nextSkipped));
        } else {
          setIsQuizComplete(true);
        }
      }
    }
  };

  const renderQuizComplete = () => (
    <motion.div 
      className="quiz-complete"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2>Quiz Complete!</h2>
      <div className="final-score">
        <p>Total Questions: {TOTAL_QUESTIONS}</p>
        <p>Attempted Questions: {attemptedQuestions}</p>
        <p>Final Score: {score}</p>
      </div>
      {attemptedQuestions < REQUIRED_ATTEMPTS && (
        <p className="warning">You need to attempt at least {REQUIRED_ATTEMPTS} questions to qualify.</p>
      )}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="restart-btn"
        onClick={() => setSelectedLanguage(null)}
      >
        Try Another Language
      </motion.button>
    </motion.div>
  );

  const renderLanguageSelection = () => (
    <motion.div 
      className="language-selection"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Select Programming Language
      </motion.h2>
      <div className="language-buttons">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => fetchQuestions('python')}
          className="language-btn"
        >
          Python
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => fetchQuestions('c')}
          className="language-btn"
        >
          C
        </motion.button>
      </div>
    </motion.div>
  );

  const renderQuestion = () => {
    if (!questions.length) return null;
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <motion.div 
        className="question-container"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={currentQuestionIndex}
      >
        <motion.div 
          className="question-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="language-title">
            Round 1 - {selectedLanguage.toUpperCase()}
          </h3>
          <h3 className="question-progress">
            Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
          </h3>
          <div className="quiz-stats">
            <p>Attempted: {attemptedQuestions}/{REQUIRED_ATTEMPTS} required</p>
            <p>Score: {score}</p>
          </div>
        </motion.div>

        <motion.h2 
          className="question-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {currentQuestion.question}
        </motion.h2>

        <motion.div 
          className="options"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentQuestion.options.map((option, index) => (
            <motion.button 
              key={index}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleAnswer(option)}
              className="option-btn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {option}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="question-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {attemptedQuestions < REQUIRED_ATTEMPTS && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSkip}
              className="skip-btn"
            >
              Skip Question
            </motion.button>
          )}
        </motion.div>

        <motion.div className="scoring-info">
          <p>Correct Answer: +{CORRECT_POINTS} points</p>
          <p>Wrong Answer: {WRONG_POINTS} point</p>
        </motion.div>
      </motion.div>
    );
  };

  const renderHeader = () => (
    <header className="app-header">
      <h1>Programming Quiz</h1>
      {user && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );

  if (!user) {
    return (
      <div className="app">
        {renderHeader()}
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  // Check if user is admin
  if (user.email === 'diyansh@gmail.com') {
    return (
      <div className="app">
        {renderHeader()}
        <AdminDashboard user={user} />
      </div>
    );
  }

  if (!testState?.isTestActive) {
    return (
      <div className="app">
        {renderHeader()}
        <WaitingRoom user={user} />
      </div>
    );
  }

  return (
    <div className="app">
      {renderHeader()}
      <AnimatePresence mode="wait">
        {!selectedLanguage && renderLanguageSelection()}
        {selectedLanguage && !isQuizComplete && renderQuestion()}
        {isQuizComplete && renderQuizComplete()}
      </AnimatePresence>
    </div>
  );
}

export default App
