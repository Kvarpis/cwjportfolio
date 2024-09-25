// src/Project.jsx
import React from 'react';

const Project = () => {
  return (
    <div style={styles.container}>
      <h1>My Projects</h1>
      {/* Replace with your project details */}
      <div style={styles.project}>
        <h2>Interactive Portfolio</h2>
        <p>
          Description of your interactive portfolio project. Include features, technologies used, and any other relevant information.
        </p>
        <a href="https://github.com/yourusername/interactive-portfolio" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </div>
      {/* Add more projects as desired */}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: '#fff',
    backgroundColor: '#000', // Dark background for contrast
    minHeight: '100vh',
  },
  project: {
    marginBottom: '40px',
  },
};

export default Project;
