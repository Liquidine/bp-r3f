import { useState } from "react";
import { Text } from "@react-three/drei";

export default function Tile({ position, index, game, updateGrid, handleClick, handleMark }) {
    const [hovered, setHovered] = useState(false);
    const tile = game.grid[index];

    const handlePointerOver = (e) => {
        e.stopPropagation();
        if(tile.revealed || tile.marked) {return}
        setHovered(true);
    };

    const handlePointerOut = () => {
        setHovered(false);
    };

    const clickTile = (e) => {
        e.stopPropagation();
        handleClick(index)
    }

    const handleRightClick = (e) => {
        e.stopPropagation();

        handleMark(index);
    };

    const determineColour = () => {
        if (tile.revealed) {
            if (tile.mine) {
                return "red"; // Exploded mine
            } else {
                // Revealed, not a mine — color based on clue
                if (tile.clue === 0) return "lightgray";
                else if (tile.clue === 1) return "dodgerblue";
                else if (tile.clue === 2) return "green";
                else if (tile.clue === 3) return "orange";
                else if (tile.clue >= 4) return "darkred";
            }
        } else if (hovered && !tile.revealed && !tile.marked) {
            return "lightblue"
        } else {
            if (tile.marked) {
                return "gold";
            } else {
                return "purple";
            }
        }
    }

    return (
        <mesh
            position={position}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={clickTile}
            onContextMenu={handleRightClick}
        >
            <boxGeometry args={[1, 1, 1]} /> {/* Ensure each tile is 1x1 */}
            <meshStandardMaterial
                color={determineColour()}
            />
            {tile.revealed && !tile.mine && tile.clue > 0 && (
                <Text position={[0, 0.9, 0]}
                      fontSize={0.5}
                      color="black"
                      font="/Roboto-Regular.ttf" // Make sure you include this file in your `public/fonts` folder
                >
                    {tile.clue}
                </Text>
            )}
        </mesh>
    );
}
