import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Tile from "./Tile";
import {processUserInput, startNewGame} from "./fetch_api.js";
import {MinesweeperInterface} from "./MineInterface.js";
import {useFrame} from "@react-three/fiber";
import {Box3} from "three";

export default function Board({ position = [0, 0, 0] ,leftControllerRef,rightControllerRef}) {
    const [gameData, setGameData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [, setTrigger] = useState(0);
    const size = 9;
    const mineCount= 10;

    const tileRefs = useRef([]);

    const tileSize = 1.2;
    const gap = 0;
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
                setLoading(false);
            }
        };

        startGame().then(() => { setLoading(false)});
    }, []);

    useFrame(() => {
        //TODO: Clean this up and add a delay for marking at least
        const leftController = leftControllerRef?.current;
        const rightController = rightControllerRef?.current;

        if (leftController?.isTriggerPressed()) {
            const controllerHitbox = leftController.getHitbox();
            if (!controllerHitbox) return;

            const controllerBox = new Box3().setFromObject(controllerHitbox);

            for (let i = 0; i < tileRefs.current.length; i++) {
                const tile = tileRefs.current[i];
                if (!tile) continue;

                const tileBox = new Box3().setFromObject(tile);

                if (controllerBox.intersectsBox(tileBox)) {
                    console.log("Intersection detected")
                    handleTileMark(i);
                    break;
                }
            }
        } else if(rightController?.isTriggerPressed()) {
            const controllerHitbox = rightController.getHitbox();
            if (!controllerHitbox) return;

            const controllerBox = new Box3().setFromObject(controllerHitbox);

            for (let i = 0; i < tileRefs.current.length; i++) {
                const tile = tileRefs.current[i];
                if (!tile) continue;

                const tileBox = new Box3().setFromObject(tile);

                if (controllerBox.intersectsBox(tileBox)) {
                    console.log("Intersection detected")
                    handleTileClick(i);
                    break;
                }
            }
        }

    });

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

    if (loading) return null;

    if (error) {
        return (
            <group>
                <mesh position={[0, 1, 0]}>
                    <textGeometry args={[error, { size: 0.3, height: 0.05 }]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </group>
        );
    }

    if (!gameData) return null;

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
        <group position={position}>
            <group position={[-(9 * spacing) / 2, 0, -(9 * spacing) / 2]}> {/* Center the grid */}
                {gameData.grid.map((tile, index) => {
                    const x = (index % 9) * spacing;
                    const z = Math.floor(index / 9) * spacing;
                    return (
                        <Tile
                            key={index}
                            ref={(ref) => (tileRefs.current[index] = ref)}
                            position={[x, 0, z]}
                            index={index}
                            size={tileSize}
                            game={gameData}
                            updateGrid={updateGrid}
                            handleClick={handleTileClick}
                            handleMark={handleTileMark}
                        />
                    );
                })}
            </group>
        </group>
    );
};
