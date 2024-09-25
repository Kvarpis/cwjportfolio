import React, { useState, useEffect } from 'react';

const GameOverlay = ({ onStart, onProgress, setGameStarted }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 1, 100);
          onProgress(newProgress);
          if (newProgress === 100) {
            clearInterval(timer);
            setLoading(false);
            setGameStarted(true);
            onStart();
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [loading, onStart, setGameStarted, onProgress]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleStart = () => {
    setLoading(true);
  };

  const buttonStyle = {
    ...styles.startButton,
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const buttonGlowStyle = {
    ...styles.buttonGlow,
    transform: isHovered ? 'scale(1)' : 'scale(0)',
  };

  const contentStyle = {
    ...styles.content,
    boxShadow: `0 0 ${20 + pulse / 5}px rgba(0, 255, 255, ${0.5 + pulse / 200})`,
  };

  return (
    <div style={styles.overlay}>
      <div style={contentStyle}>
        {!loading && (
          <button 
            style={buttonStyle} 
            onClick={handleStart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span style={styles.buttonText}>Start Game</span>
            <div style={buttonGlowStyle}></div>
          </button>
        )}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingBar}>
              <div style={{ ...styles.loadingProgress, width: `${progress}%` }} />
            </div>
            <p style={styles.loadingText}>{Math.round(progress)}% Loaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 9999,
  },
  content: {
    position: 'relative',
    padding: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
  },
  startButton: {
    position: 'relative',
    fontSize: '24px',
    padding: '15px 30px',
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '2px solid #00ffff',
    borderRadius: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  buttonText: {
    position: 'relative',
    zIndex: 1,
  },
  buttonGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: '50%',
    transform: 'scale(0)',
    transition: 'transform 0.5s ease',
  },
  loadingContainer: {
    width: '300px',
  },
  loadingBar: {
    width: '100%',
    height: '20px',
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
  },
  loadingProgress: {
    height: '100%',
    backgroundImage: 'linear-gradient(90deg, #00ffff, #00aaff)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
    transition: 'width 0.2s ease-in-out',
  },
  loadingText: {
    color: '#00ffff',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    textShadow: '0 0 5px rgba(0, 255, 255, 0.7)',
  },
};

export default GameOverlay;