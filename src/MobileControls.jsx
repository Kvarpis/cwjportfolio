import React, { useState } from 'react';

const MobileControls = ({ onShoot, onThrottle }) => {
  const [isThrottling, setIsThrottling] = useState(false);

  const handleShoot = () => {
    onShoot();
  };

  const handleThrottleStart = () => {
    setIsThrottling(true);
    onThrottle(true);
  };

  const handleThrottleEnd = () => {
    setIsThrottling(false);
    onThrottle(false);
  };

  return (
    <div style={styles.controlsContainer}>
      <button 
        style={styles.shootButton} 
        onTouchStart={handleShoot}
      >
        Shoot
      </button>
      <button 
        style={{
          ...styles.throttleButton,
          backgroundColor: isThrottling ? '#00ffff' : 'transparent',
        }}
        onTouchStart={handleThrottleStart}
        onTouchEnd={handleThrottleEnd}
      >
        Throttle
      </button>
    </div>
  );
};

const styles = {
  controlsContainer: {
    position: 'fixed',
    bottom: 20,
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  shootButton: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
  },
  throttleButton: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '2px solid #00ffff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
  },
};

export default MobileControls;