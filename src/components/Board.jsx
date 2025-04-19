import {useEffect, useRef, useState} from "react";
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
    const lastInteractedTile = useRef({
        left: null,
        right: null,
    });

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
        const interactionState = {
            left: {
                ref: leftControllerRef.current,
                lastTile: lastInteractedTile.current.left,
                interacting: false,
                trigger: 'isTriggerPressed',
                handler: handleTileMark
            },
            right: {
                ref: rightControllerRef.current,
                lastTile: lastInteractedTile.current.right,
                interacting: false,
                trigger: 'isTriggerPressed',
                handler: handleTileClick
            }
        };

        Object.entries(interactionState).forEach(([side, { ref, lastTile, trigger, handler }]) => {
            if (!ref || typeof ref[trigger] !== 'function') return;

            const isPressed = ref[trigger]();
            const hitbox = ref.getHitbox();
            if (!hitbox) return;

            const controllerBox = new Box3().setFromObject(hitbox);
            let interactionOccurred = false;

            for (let i = 0; i < tileRefs.current.length; i++) {
                const tile = tileRefs.current[i];
                if (!tile) continue;

                const tileBox = new Box3().setFromObject(tile);

                if (controllerBox.intersectsBox(tileBox)) {
                    interactionOccurred = true;

                    if (lastInteractedTile.current[side] === null && isPressed) {
                        handler(i); // Interact once
                        lastInteractedTile.current[side] = i;
                    }

                    break;
                }
            }

            // If no interaction this frame (i.e., controller cleared tiles), reset the debounce
            if (!interactionOccurred) {
                lastInteractedTile.current[side] = null;
            }
        });
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
