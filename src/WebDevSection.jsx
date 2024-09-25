// src/WebDevSection.jsx
import React from 'react';

const WebDevSection = ({ projects }) => {
  return (
    <div className="web-dev-section">
      {projects.map((project) => (
        <div key={project.id} className="project">
          <img src={project.image} alt={project.name} />
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        </div>
      ))}
    </div>
  );
};

export default WebDevSection;
