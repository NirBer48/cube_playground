import { useRef, useEffect } from "react";
import { Mesh } from "three";

interface CubePiece {
    position: [number, number, number];
    colors: string[];
}

const Cubelet = ({ position, colors }: CubePiece) => {
    const meshRef = useRef<Mesh>(null);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.userData.isCubelet = true; // Explicitly set userData
        }
    }, []);

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            {colors.map((color, index) => (
                <meshStandardMaterial key={index} attach={`material-${index}`} color={color} />
            ))}
        </mesh>
    );
};

export default Cubelet;