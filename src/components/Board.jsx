import {useEffect, useState} from "react";
import Tile from "./Tile";
import {processUserInput, startNewGame} from "./fetch_api.js";
import {MinesweeperInterface} from "./MineInterface.js";

export default function Board() {
    const [gameData, setGameData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [, setTrigger] = useState(0);
    const size = 9;
    const mineCount= 10;

    const tileSize = 1;
    const gap = 0.05;
    const spacing = tileSize + gap;

    const updateGrid = () => setTrigger(prev => prev + 1); // Force re-render

    const fetchNewGame = async () => {
        try {
            const response = await startNewGame(size, size, mineCount);
            gameInterface.updateGame(response);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const gameInterface = new MinesweeperInterface();

    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await fetchNewGame();
                gameInterface.updateGame(response);
                setGameData(gameInterface);
            } catch (error) {
                console.error("Error starting the game:", error);
            }
        };

        startGame().then(() => { setLoading(false)});
    }, []);

    const handleTileClick = async (index) => {
        if (!gameData) return;

        const row = Math.floor(index / 9);
        const col = index % 9;

        const response = await processUserInput(row, col, false);
        gameInterface.updateGame(response);
        setGameData(gameInterface);

        if (gameInterface.grid[index].mine && gameInterface.grid[index].revealed) {
            console.log("Mine hit! Revealing all")
            revealAll();
        }

        updateGrid();
    };

    const handleTileMark = async (index) => {
        if (!gameData) return;

        const row = Math.floor(index / 9);
        const col = index % 9;

        const response = await processUserInput(row, col, true);
        gameInterface.updateGame(response);
        setGameData(gameInterface);

        updateGrid();
    };

    if (loading) {
        return
    }

    const revealAll = () => {
        if (!gameData) return;

        const newGrid = gameData.grid.map(tile => ({
            ...tile,
            revealed: true
        }));

        const newGameData = new MinesweeperInterface();
        newGameData.grid = newGrid;
        newGameData.status = gameData.status;
        newGameData.markCount = gameData.markCount;

        setGameData(newGameData);

        updateGrid();
    };


    return (
        <group position={[-(9 * spacing) / 2, 0, -(9 * spacing) / 2]}> {/* Center the grid */}
            {gameData.grid.map((tile, index) => {
                const x = (index % 9) * spacing;
                const z = Math.floor(index / 9) * spacing;
                return (
                    <Tile
                        key={index}
                        position={[x, 0, z]}
                        index={index}
                        game={gameData}
                        updateGrid={updateGrid}
                        handleClick={handleTileClick}
                        handleMark={handleTileMark}
                    />
                );
            })}
        </group>
    );
}
