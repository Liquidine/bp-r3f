import {forwardRef, useMemo, useState} from "react";
import { TextureLoader} from "three";
import {useLoader} from "@react-three/fiber";
import {Flag} from "./models/flag.jsx";

const Tile = forwardRef(({ position, index, size, game, updateGrid, handleClick, handleMark }, ref) => {
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

    const textures = useLoader(TextureLoader, [
        'textures/mine.png',
        'textures/tile0.png',
        'textures/tile0-1.png',
        'textures/tile1.png',
        'textures/tile2.png',
        'textures/tile3.png',
        'textures/tile4.png',
        'textures/tile5.png',
        'textures/tile6.png',
        'textures/tile7.png',
        'textures/tile8.png'
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
            receiveShadow
            position={[position[0], (tile.revealed && tile.clue === 0 && !tile.mine) ? position[1] - 0.25 : position[1], position[2]]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={clickTile}
            onContextMenu={handleRightClick}
            ref={ref}
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
});

export default Tile;
