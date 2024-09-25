import React from 'react';
import { Text } from '@react-three/drei';
import ProjectScreen from './ProjectScreen';

const projectsData = [
  {
    title: 'Danorelektro',
    url: 'https://danorelektro.no',
    imageUrl: '/assets/projects/danorelektro.png',
    position: [0, 15, -100]
  },
  {
    title: 'Scandicommerce AS',
    url: 'https://scandicommerce.no',
    imageUrl: '/assets/projects/scandicommerce.png',
    position: [0, 0, -100]
  },
  {
    title: 'Shitaa.no',
    url: 'https://shitaa.no',
    imageUrl: '/assets/projects/shitaa.png',
    position: [25, 0, -100]
  },
  {
    title: 'farskapet.no',
    url: 'https://farskapet.no',
    imageUrl: '/assets/projects/farskapet.png',
    position: [25, 15, -100]
  },
  {
    title: 'morskapet.no',
    url: 'https://morskapet.no',
    imageUrl: '/assets/projects/morskapet.png',
    position: [-25, 15, -100]
  },
  {
    title: 'Custom Plugin',
    url: 'https://plugin.com',
    imageUrl: '/assets/projects/danorelektro.png',
    position: [-25, 0, -100]
  }
];

const ProjectScreensManager = () => {
  const handleHit = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <Text
        position={[0, 25, -100]}
        fontSize={5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Projects
      </Text>
      {projectsData.map((project, index) => (
        <ProjectScreen
          key={index}
          index={index}  // Add this line
          position={project.position}
          onHit={handleHit}
          projectData={project}
        />
      ))}
    </>
  );
};

export default ProjectScreensManager;