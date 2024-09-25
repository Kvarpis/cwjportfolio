// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Contains the Canvas and 3D scene
import Project from './Project'; // Your project details
import CV from './CV'; // Your curriculum vitae
import ControlsOverlay from './ControlsOverlay'; // UI Overlay for controls
import HUD from './HUD'; // Heads-Up Display

function App() {
  return (
    <>
      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/cv" element={<CV />} />
      </Routes>

      {/* UI Overlays */}
      <ControlsOverlay />
      <HUD />
    </>
  );
}

export default App;
