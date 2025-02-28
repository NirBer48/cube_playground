import { CubePiece } from "./Cube.Interface";

class RubiksCube {
    pieces: CubePiece[];

    constructor() {
        this.pieces = [];
        this.initialize();
    }

    initialize() {
        this.pieces = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;

                    const colors = [
                        x === 1 ? 'red' : 'gray',     // Right
                        x === -1 ? 'orange' : 'gray', // Left
                        y === 1 ? 'white' : 'gray',   // Top
                        y === -1 ? 'yellow' : 'gray', // Bottom
                        z === 1 ? 'blue' : 'gray',    // Front
                        z === -1 ? 'green' : 'gray',  // Back
                    ];

                    this.pieces.push({ position: [x, y, z], colors });
                }
            }
        }
    }

    rotateSide(side: 'front' | 'back' | 'left' | 'right' | 'up' | 'down', direction: 'clockwise' | 'counterclockwise') {
        const sideMap: Record<'front' | 'back' | 'left' | 'right' | 'up' | 'down', { axis: string; layer: number }> = {
            front: { axis: 'z', layer: 1 },
            back: { axis: 'z', layer: -1 },
            left: { axis: 'x', layer: -1 },
            right: { axis: 'x', layer: 1 },
            up: { axis: 'y', layer: 1 },
            down: { axis: 'y', layer: -1 },
        };

        const { axis, layer } = sideMap[side];

        this.pieces = this.pieces.map((piece) => {
            if (piece.position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] === layer) {
                let [x, y, z] = piece.position;
                let colors = [...piece.colors];

                if (axis === 'x') {
                    [y, z] = direction === 'clockwise' ? [-z, y] : [z, -y];
                    colors = direction === 'clockwise'
                        ? [colors[0], colors[1], colors[5], colors[4], colors[2], colors[3]]
                        : [colors[0], colors[1], colors[4], colors[5], colors[3], colors[2]];
                }
                else if (axis === 'y') {
                    [x, z] = direction === 'clockwise' ? [z, -x] : [-z, x];
                    colors = direction === 'clockwise'
                        ? [colors[4], colors[5], colors[2], colors[3], colors[1], colors[0]]
                        : [colors[5], colors[4], colors[2], colors[3], colors[0], colors[1]];
                }
                else if (axis === 'z') {
                    [x, y] = direction === 'clockwise' ? [-y, x] : [y, -x];
                    colors = direction === 'clockwise'
                        ? [colors[3], colors[2], colors[0], colors[1], colors[4], colors[5]]
                        : [colors[2], colors[3], colors[1], colors[0], colors[4], colors[5]];
                }

                return { ...piece, position: [x, y, z], colors };
            }

            return piece;
        });
    }

    scramble() {
        const sides = ['front', 'back', 'left', 'right', 'up', 'down'] as const;
        
        for (let i = 0; i < 20; i++) {
            const side = sides[Math.floor(Math.random() * sides.length)] as typeof sides[number];
            const direction = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
            this.rotateSide(side, direction);
        }

        return this.pieces;
    }

    solve() {
        this.initialize();

        return this.pieces;
    }
}

export default RubiksCube;