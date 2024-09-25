let thrusterSound = null;
let backgroundSound = null;
let isThrusterActive = false;

export const initializeSounds = () => {
  thrusterSound = new Audio('/sounds/thruster.mp3');
  thrusterSound.loop = true;
  thrusterSound.volume = 0.7;

  backgroundSound = new Audio('/sounds/deepspace.mp3');
  backgroundSound.loop = true;
  
  backgroundSound.addEventListener('timeupdate', () => {
    if (backgroundSound.currentTime > 30) {
      backgroundSound.currentTime = 0;
    }
  });
  
  // Start playing background sound immediately
  playBackgroundSound();
};

export const playBackgroundSound = () => {
  if (backgroundSound) {
    backgroundSound.play().catch(error => console.log('Playback prevented. User interaction needed.'));
  }
};

export const playShootSound = () => {
  const shootSound = new Audio('/sounds/shoot1.mp3');
  shootSound.play().catch(error => console.log('Playback prevented. User interaction needed.'));
};

export const playThrusterSound = () => {
  if (thrusterSound) {
    isThrusterActive = true;
    thrusterSound.play().catch(error => console.log('Playback prevented. User interaction needed.'));
  }
};

export const stopThrusterSound = () => {
  if (thrusterSound) {
    isThrusterActive = false;
    thrusterSound.pause();
  }
};

export const updateThrusterSound = (speed) => {
  if (thrusterSound && isThrusterActive) {
    if (thrusterSound.paused) {
      thrusterSound.play().catch(error => console.log('Playback prevented. User interaction needed.'));
    }
  }
};

export const cleanupSounds = () => {
  if (thrusterSound) {
    thrusterSound.pause();
    thrusterSound = null;
  }
  if (backgroundSound) {
    backgroundSound.pause();
    backgroundSound = null;
  }
};