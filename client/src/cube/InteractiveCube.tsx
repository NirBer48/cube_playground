import React, { useState } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCube from '../utils/Cube';
import { Raycaster, Vector2, Mesh } from 'three';
import Cubelet from './Cublet';

interface CubePiece {
  position: [number, number, number];
  colors: string[];
}

const rubiksCube = new RubiksCube();

// Component to handle cube interaction
const CubeInteraction = ({
  setPieces,
}: {
  setPieces: React.Dispatch<React.SetStateAction<CubePiece[]>>;
}) => {
  const { camera, scene } = useThree();
  const raycaster = new Raycaster();

  // Handle click events
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    // Convert mouse position to normalized device coordinates (-1 to +1)
    const mouse = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    // Set the raycaster from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Find objects that were clicked
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const cubelet = intersects.find((intersect) => intersect.object.userData.isCubelet)?.object;

      // Ensure only cubelets are processed
      console.log(cubelet);
      if (!cubelet) return;

      const { x, y, z } = cubelet.position;

      // Determine which side to rotate
      let side: 'front' | 'back' | 'left' | 'right' | 'up' | 'down' | null = null;

      if (Math.abs(y - 1) < 0.2) {
        side = 'up';
      } else if (Math.abs(y + 1) < 0.2) {
        side = 'down';
      } else if (Math.abs(z - 1) < 0.2) {
        side = 'front';
      } else if (Math.abs(z + 1) < 0.2) {
        side = 'back';
      } else if (Math.abs(x - 1) < 0.2) {
        side = 'right';
      } else if (Math.abs(x + 1) < 0.2) {
        side = 'left';
      }

      if (side) {
        console.log(`Rotating ${side} side`);
        rubiksCube.rotateSide(side, event.button === 2 ? 'counterclockwise' : 'clockwise');
        setPieces([...rubiksCube.pieces]); // Force re-render
      }
    }
  };

  return (
    <mesh onPointerDown={handleClick}>
      <boxGeometry args={[10, 10, 10]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

// Main App component
const InteractiveCube = () => {
  const [pieces, setPieces] = useState<CubePiece[]>(rubiksCube.pieces);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [5, 5, 5], fov: 25 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} />
        {pieces.map((piece, index) => (
          <Cubelet key={index} position={piece.position} colors={piece.colors} />
        ))}
        <CubeInteraction setPieces={setPieces} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default InteractiveCube;
