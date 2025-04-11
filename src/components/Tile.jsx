import {useMemo, useState} from "react";
import { TextureLoader} from "three";
import {useLoader} from "@react-three/fiber";
import {Flag} from "./models/flag.jsx";

export default function Tile({ position, index, size, game, updateGrid, handleClick, handleMark }) {
    const [hovered, setHovered] = useState(false);
    const tile = game.grid[index];

    const flagRotation = useMemo(() => [0, Math.random() * Math.PI * 2, 0], []);

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

    const textures = useLoader(TextureLoader, [
        'mineTextures/mine.png',
        'mineTextures/tile0.png',
        'mineTextures/tile0-1.png',
        'mineTextures/tile1.png',
        'mineTextures/tile2.png',
        'mineTextures/tile3.png',
        'mineTextures/tile4.png',
        'mineTextures/tile5.png',
        'mineTextures/tile6.png',
        'mineTextures/tile7.png',
        'mineTextures/tile8.png'
    ])

    const getTexture = () => {
        if (tile.revealed) {
            if (tile.mine) {
                return textures[0];
            } else {
                // Revealed, not a mine — color based on clue
                return textures[tile.clue+2]
            }
        } else {
            return textures[1];
        }
    }

    const hoverEffect = () => {
        if(tile.marked) return "gold";

        if (hovered && !tile.revealed && !tile.marked) {
            return "lightblue"
        } else {
            return "white"
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
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial
                map={getTexture()} color={hoverEffect()}
            />

            {tile.marked && !tile.revealed && (
                <Flag position={[0, 0.7, 0]} scale={[0.1,0.1,0.1]} rotation={flagRotation}/>
            )}
        </mesh>
    );
}
