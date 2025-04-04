import { useState } from "react";
import { Text } from "@react-three/drei";

export default function Tile({ position, index, game, updateGrid }) {
    const [hovered, setHovered] = useState(false);
    const tile = game.grid[index];

    const handleClick = (e) => {
        e.stopPropagation();
        game.revealTile(index);
        updateGrid(); // Force a re-render
    };

    const handlePointerOver = (e) => {
        e.stopPropagation(); // prevent hover from affecting other tiles
        setHovered(true);
    };

    const handlePointerOut = () => {
        setHovered(false);
    };

    return (
        <mesh
            position={position}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            <boxGeometry args={[1, 1, 1]} /> {/* Ensure each tile is 1x1 */}
            <meshStandardMaterial
                color={tile.revealed ? (tile.mine ? "red" : "gray") : hovered ? "lightblue" : "green"}
            />
            {tile.revealed && !tile.mine && tile.clue > 0 && (
                <Text position={[0, 0.9, 0]} fontSize={0.5} color="black">
                    {tile.clue}
                </Text>
            )}
        </mesh>
    );
}
