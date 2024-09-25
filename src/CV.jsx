// src/CV.jsx
import React from 'react';

const CV = () => {
  return (
    <div style={styles.container}>
      <h1>My Curriculum Vitae</h1>
      {/* Replace with your CV details */}
      <section style={styles.section}>
        <h2>Personal Information</h2>
        <p>Name: Chris Jensen</p>
        <p>Email: chrisjensen@example.com</p>
        <p>Phone: +1 (234) 567-8901</p>
      </section>

      <section style={styles.section}>
        <h2>Education</h2>
        <p>Bachelor of Science in Computer Science, XYZ University, 20XX - 20XX</p>
        {/* Add more education details as needed */}
      </section>

      <section style={styles.section}>
        <h2>Experience</h2>
        <p>Software Developer at ABC Company, 20XX - Present</p>
        {/* Add more experience details as needed */}
      </section>

      <section style={styles.section}>
        <h2>Skills</h2>
        <ul>
          <li>React.js</li>
          <li>Three.js</li>
          <li>JavaScript (ES6+)</li>
          <li>HTML & CSS</li>
          <li>Git & GitHub</li>
          {/* Add more skills as needed */}
        </ul>
      </section>

      <section style={styles.section}>
        <h2>Projects</h2>
        <p>
          Include a summary of your projects or link back to the Projects page.
        </p>
      </section>

      {/* Add more CV sections as desired */}
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
  section: {
    marginBottom: '40px',
  },
};

export default CV;
