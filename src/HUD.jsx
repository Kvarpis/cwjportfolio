import React, { useState, useEffect } from 'react';
import { useStore } from './store';

const HUD = () => {
  const speed = useStore((state) => state.speed);
  const shipPosition = useStore((state) => state.shipPosition);
  const shipRotation = useStore((state) => state.shipRotation);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 50, y: 35 });
  const [manualOffset, setManualOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('Ship Position:', shipPosition);
    console.log('Ship Rotation:', shipRotation);
    
    if (shipPosition) {
      const screenX = (shipPosition.x / window.innerWidth) * 100;
      const screenY = (shipPosition.y / window.innerHeight) * 100;
      console.log('Calculated Screen Position:', { x: screenX, y: screenY });
      
      setCrosshairPosition({
        x: screenX + manualOffset.x,
        y: screenY + manualOffset.y
      });
    }
  }, [shipPosition, shipRotation, manualOffset]);

  const moveCrosshair = (direction) => {
    setManualOffset(prev => {
      const newOffset = { ...prev };
      switch(direction) {
        case 'up': newOffset.y -= 1; break;
        case 'down': newOffset.y += 1; break;
        case 'left': newOffset.x -= 1; break;
        case 'right': newOffset.x += 1; break;
      }
      console.log('New Manual Offset:', newOffset);
      return newOffset;
    });
  };

  return (
    <div style={styles.hudContainer}>
      <div style={styles.hud}>
        <p><strong>Speed:</strong> {speed ? speed.toFixed(2) : 'N/A'}</p>
      </div>
      <div style={{
        ...styles.crosshair,
        left: `${crosshairPosition.x}%`,
        top: `${crosshairPosition.y}%`,
      }}>
        <div style={styles.crosshairVertical}></div>
        <div style={styles.crosshairHorizontal}></div>
      </div>
    </div>
  );
};

const styles = {
  hudContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  hud: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  crosshair: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    transform: 'translate(-50%, -50%)',
  },
  crosshairVertical: {
    position: 'absolute',
    top: '0',
    left: '50%',
    width: '2px',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: 'translateX(-50%)',
  },
  crosshairHorizontal: {
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '100%',
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: 'translateY(-50%)',
  },
  controls: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '5px',
    pointerEvents: 'auto',
  },
};

export default HUD;