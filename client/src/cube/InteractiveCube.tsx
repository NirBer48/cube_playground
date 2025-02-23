import React, { useState } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCube from '../utils/Cube';
import { Raycaster, Vector2, Mesh } from 'three';
import Cubelet from './Cublet';
import { Button } from '@mui/material';
import './InteractiveCube.css';

interface CubePiece {
  position: [number, number, number];
  colors: string[];
}

const rubiksCube = new RubiksCube();

const solve = () => { 
  return rubiksCube.solve(); 
};

const scramble = () => { 
  return rubiksCube.scramble(); 
};

// Component to handle cube interaction
const CubeInteraction = ({ setPieces }: { setPieces: React.Dispatch<React.SetStateAction<CubePiece[]>> }) => {
  const { camera, scene } = useThree();
  const raycaster = new Raycaster();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);

  // Handle mouse down
  const handlePointerDown = (event: ThreeEvent<MouseEvent>) => {
    setIsMouseDown(true); // Track when mouse is down
    setMouseDownPosition({ x: event.clientX, y: event.clientY }); // Store the initial mouse position
    event.stopPropagation();
  };

  // Handle mouse up
  const handlePointerUp = (event: ThreeEvent<MouseEvent>) => {
    if (isMouseDown && mouseDownPosition) {
      event.stopPropagation();

      // Check if the mouse has moved significantly, indicating a drag
      const deltaX = Math.abs(event.clientX - mouseDownPosition.x);
      const deltaY = Math.abs(event.clientY - mouseDownPosition.y);

      // If the mouse has moved too much, consider it a drag and do nothing
      if (deltaX > 5 || deltaY > 5) {
        setIsMouseDown(false);
        return;
      }

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
        if (!cubelet) return;

        const { x, y, z } = cubelet.position;

        // Determine which side to rotate
        let side: 'front' | 'back' | 'left' | 'right' | 'up' | 'down' | null = null;

        console.log(x, y, z);

        if (y === 1) {
          side = 'up';
        } else if (y === -1) {
          side = 'down';
        } else if (z === 1) {
          side = 'front';
        } else if (z === -1) {
          side = 'back';
        } else if (x === 1) {
          side = 'right';
        } else if (x === -1) {
          side = 'left';
        }

        if (side) {
          console.log(`Rotating ${side} side`);
          rubiksCube.rotateSide(side, event.button === 2 ? 'counterclockwise' : 'clockwise');
          setPieces([...rubiksCube.pieces]); // Force re-render
        }
      }
    }
    setIsMouseDown(false); // Reset mouse down state
    setMouseDownPosition(null); // Clear the stored mouse position
  };

  return (
    <mesh onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
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
      <Canvas style={{ width: '100%', height: '90%' }} camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} />
        {pieces.map((piece, index) => (
          <Cubelet key={index} position={piece.position} colors={piece.colors} />
        ))}
        <CubeInteraction setPieces={setPieces} />
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
      </Canvas>
      <div id='options'>
        <Button variant="contained" color="warning" onClick={() => {setPieces(scramble())}}>Scramble</Button>
        <Button variant="contained" color="success" onClick={() => {setPieces(solve())}}>Solve</Button>
      </div>
    </div>
  );
};

export default InteractiveCube;
