import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './store';
import * as THREE from 'three';

const CollisionManager = () => {
  const { scene, raycaster } = useThree();
  const incrementScore = useStore((state) => state.incrementScore);
  const floatingAsteroids = useRef({});
  const frameCount = useRef(0);

  useEffect(() => {
    console.log("CollisionManager mounted");
    return () => {
      Object.values(floatingAsteroids.current).forEach(cancelAnimationFrame);
    };
  }, []);

  const findPlane = () => {
    let plane = scene.getObjectByName('Plane');
    if (!plane) {
      scene.traverse((object) => {
        if (object.name === 'Plane' || object.name.toLowerCase().includes('Plane')) {
          plane = object;
        }
      });
    }
    return plane;
  };

  const makeAsteroidFloat = (asteroid) => {
    const floatDuration = 2000; // 2 seconds
    const startTime = Date.now();
    const startPosition = asteroid.position.clone();
    const floatDistance = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    const animateFloat = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / floatDuration, 1);
      
      if (progress < 1) {
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        asteroid.position.lerpVectors(startPosition, startPosition.clone().add(floatDistance), easedProgress);
        floatingAsteroids.current[asteroid.uuid] = requestAnimationFrame(animateFloat);
      } else {
        delete floatingAsteroids.current[asteroid.uuid];
      }
    };

    floatingAsteroids.current[asteroid.uuid] = requestAnimationFrame(animateFloat);
  };

  useFrame(() => {
    frameCount.current += 1;
    const shouldLog = frameCount.current % 60 === 0;

    if (shouldLog) {
      console.log("Scene children:", scene.children.map(child => `${child.name} (${child.type})`));
    }

    const projectiles = scene.children.filter(child => child.name.startsWith('projectile-'));
    const asteroids = scene.children.filter(child => child.name.startsWith('asteroid-'));
    const linkedInLogos = scene.children.filter(child => child.name === 'linkedin-logo');
    const projectScreens = scene.children.filter(child => child.name.startsWith('project-screen-'));

    const plane = findPlane();

    if (plane) {
      if (shouldLog) {
        console.log("Plane found:", plane.name, plane.position);
      }
    
      const planePos = new THREE.Vector3();
      plane.getWorldPosition(planePos);
      const planeRadius = 1; // Adjust this based on your plane's actual size
    
      // Store the plane's previous position
      if (!plane.userData.previousPosition) {
        plane.userData.previousPosition = planePos.clone();
      }
    
      // Calculate plane's movement direction and speed
      const planeMovement = new THREE.Vector3().subVectors(planePos, plane.userData.previousPosition);
      const planeSpeed = planeMovement.length();
    
      asteroids.forEach(asteroid => {
        if (asteroid.userData.isAsteroid) {
          const asteroidPos = new THREE.Vector3();
          asteroid.getWorldPosition(asteroidPos);
          const asteroidRadius = asteroid.userData.boundingRadius || 2;
    
          const distance = planePos.distanceTo(asteroidPos);
          
          if (distance < planeRadius + asteroidRadius) {
            console.log("Collision detected between plane and asteroid!");
            console.log("Plane position:", planePos);
            console.log("Asteroid position before collision:", asteroidPos);
            
            // Calculate collision normal
            const collisionNormal = new THREE.Vector3().subVectors(asteroidPos, planePos).normalize();
            
            // Move only the asteroid
            const pushDistance = (planeRadius + asteroidRadius) - distance + 0.1; // Small extra distance to ensure separation
            asteroid.position.add(collisionNormal.multiplyScalar(pushDistance));
            
            // Set or update asteroid's momentum
            if (!asteroid.userData.momentum) {
              asteroid.userData.momentum = new THREE.Vector3();
            }
            
            // Transfer momentum from plane to asteroid
            const impactStrength = Math.max(0.5, planeSpeed);
            asteroid.userData.momentum.copy(planeMovement.normalize().multiplyScalar(impactStrength));
            
            // Add some randomness to the asteroid's movement
            asteroid.userData.momentum.add(new THREE.Vector3(
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.2
            ));
            
            asteroid.userData.isMoving = true;
            
            console.log("Asteroid position after collision:", asteroid.position);
            console.log("Asteroid momentum:", asteroid.userData.momentum);
          }
        }
      });
    
      // Update plane's previous position
      plane.userData.previousPosition.copy(planePos);
    } else {
      if (shouldLog) {
        console.warn("Plane not found in the scene");
      }
    }
    
    // Add this function to your update loop
    function updateAsteroids(deltaTime) {
      asteroids.forEach(asteroid => {
        if (asteroid.userData.isMoving) {
          const oldPosition = asteroid.position.clone();
          
          // Apply momentum to position
          asteroid.position.add(asteroid.userData.momentum.clone().multiplyScalar(deltaTime));
          
          // Gradually decrease momentum (slowing down over time)
          const dragFactor = 0.1;
          asteroid.userData.momentum.multiplyScalar(dragFactor);
          
          // Optional: Add a maximum speed limit
          const maxSpeed = 5;
          if (asteroid.userData.momentum.length() > maxSpeed) {
            asteroid.userData.momentum.normalize().multiplyScalar(maxSpeed);
          }
          
          // Optional: Stop updating if momentum becomes negligible
          if (asteroid.userData.momentum.length() < 0.01) {
            asteroid.userData.isMoving = false;
            asteroid.userData.momentum.set(0, 0, 0);
          }
          
          console.log("Asteroid updated - Old pos:", oldPosition, "New pos:", asteroid.position, "Momentum:", asteroid.userData.momentum);
        }
      });
    }

    projectiles.forEach(projectile => {
      const projPos = projectile.position;

      // Check collision with asteroids
      asteroids.forEach(asteroid => {
        if (asteroid.userData.isAsteroid) {
          const asteroidPos = new THREE.Vector3();
          asteroid.getWorldPosition(asteroidPos);
          const asteroidRadius = asteroid.userData.boundingRadius || 2;

          const distance = projPos.distanceTo(asteroidPos);
          if (distance < asteroidRadius + 0.4) { // 0.4 matches projectile radius
            console.log("Projectile hit asteroid");
            if (asteroid.userData.setHit) {
              asteroid.userData.setHit();
            }
            scene.remove(projectile);
            incrementScore();
            makeAsteroidFloat(asteroid);
          }
        }
      });

      // Check collision with LinkedIn logo
      linkedInLogos.forEach(logo => {
        const logoPos = new THREE.Vector3();
        logo.getWorldPosition(logoPos);
        const logoSize = 3;

        const distance = projPos.distanceTo(logoPos);
        if (distance < logoSize + 0.4) {
          console.log("Projectile hit LinkedIn logo");
          scene.remove(projectile);
          
          if (logo.userData.onClick) {
            console.log("LinkedIn logo hit. Triggering click handler.");
            logo.userData.onClick();
          } else {
            console.log("LinkedIn logo hit, but no click handler found.");
          }
        }
      });

      // Check collision with project screens
      const direction = projectile.getWorldDirection(new THREE.Vector3());
      raycaster.set(projPos, direction);
      const intersects = raycaster.intersectObjects(projectScreens, true);

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        console.log("Projectile hit object:", hitObject.name);

        let screenGroup = hitObject;
        while (screenGroup && !screenGroup.name.startsWith('project-screen-')) {
          screenGroup = screenGroup.parent;
        }

        if (screenGroup) {
          if (screenGroup.userData.onClick) {
            console.log("Project screen hit. Triggering click handler.");
            screenGroup.userData.onClick();
          } else {
            console.log("Project screen hit, but no click handler found.");
          }
        }

        scene.remove(projectile);
      }
    });
  });

  return null;
};

export default CollisionManager;