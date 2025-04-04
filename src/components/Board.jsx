import { useState } from "react";
import Tile from "./Tile";
import { MinesweeperGame } from "./mineLogic.js";

export default function Board() {
    const [game] = useState(/*new MinesweeperGame(9, 10)*/null);
    const [, setTrigger] = useState(0);

    const updateGrid = () => setTrigger(prev => prev + 1); // Force re-render

    const tileSize = 1;  // Tile size
    const gap = 0.05;     // Space between tiles
    const spacing = tileSize + gap; // Combined tile size with gap

    return (
        <group position={[-(9 * spacing) / 2, 0, -(9 * spacing) / 2]}> {/* Center the grid */}
            {game.grid.map((_, index) => {
                const x = (index % 9) * spacing;
                const z = Math.floor(index / 9) * spacing;
                return <Tile key={index} position={[x, 0, z]} index={index} game={game} updateGrid={updateGrid} />;
            })}
        </group>
    );
}
