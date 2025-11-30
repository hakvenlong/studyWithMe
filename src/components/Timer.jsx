// PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { AiFillSetting } from 'react-icons/ai';
import './style/pomodoro.css';

const FIXED_BACKGROUND = 'https://cdn.shopify.com/s/files/1/0475/8513/2708/files/sebastien-gabriel--imlv9jlb24-unsplash-1.jpg?v=1734059829';

export default function PomodoroTimer() {
  const [mode, setMode] = useState('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const times = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(times[newMode]);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(times[mode]);
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: `url(${FIXED_BACKGROUND})`,  // Background never changes
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="glass-card">
        <div className="tabs">
          <button
            className={`tab ${mode === 'pomodoro' ? 'active' : ''}`}
            onClick={() => switchMode('pomodoro')}
          >
            Pomodoro
          </button>
          <button
            className={`tab ${mode === 'short' ? 'active' : ''}`}
            onClick={() => switchMode('short')}
          >
            Short Break
          </button>
          <button
            className={`tab ${mode === 'long' ? 'active' : ''}`}
            onClick={() => switchMode('long')}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="timer">
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div className="controls">
          <button
            className="start-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>

          <div className="icons">
            <button onClick={reset} className="icon-btn">
              <GrPowerReset size={26} />
            </button>
            <button className="icon-btn" 
              onClick={()=> alert('cumming soon')}
            >
              <AiFillSetting size={26} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}