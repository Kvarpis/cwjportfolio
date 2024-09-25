// src/ControlsOverlay.jsx
import React from 'react';

const ControlsOverlay = () => {
  return (
    <div style={styles.overlay}>
      <h3>Controls</h3>
      <ul>
        <li><strong>W/A/S/D</strong> or <strong>Arrow Keys</strong>: Move Spaceship</li>
        <li><strong>Q/E</strong>: Roll Left/Right</li>
        <li><strong>Shift/Ctrl</strong>: Throttle Up/Down</li>
        <li><strong>Spacebar</strong>: Shoot</li>
      </ul>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
};

export default ControlsOverlay;
