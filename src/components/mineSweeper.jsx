import {useEffect, useRef, useState} from "react";
import Tile from "./Tile";
import {processUserInput, startNewGame} from "../logic/apiClient.js";
import {MineSweeperState} from "../logic/mineSweeperState.js";
import {useFrame} from "@react-three/fiber";
import {Box3} from "three";
import {MinesweeperGame} from "../logic/mineSweeperLogic.js";

export default function MineSweeper({offline = false,
                                  mineCount = 10,
                                  position = [0, 0, 0] ,
                                  leftControllerRef, rightControllerRef}) {
    const size = 9;
    const tileSize = 1.4;
    const gap = 0;
    const spacing = tileSize + gap;

    const tileRefs = useRef([]);
    const lastInteractedTile = useRef({
        left: null,
        right: null,
    });

    const [, setTrigger] = useState(0);
    /**
     * Forces a re-render of the board
     */
    const updateGrid = () => setTrigger(prev => prev + 1);

    const gameInterface = useRef(null);
    const [loading,setLoading] = useState(true);

    /**
     * Starts a new game with the server.
     * <br> Requires offline to be false.
     * @returns {Promise<*>}
     */
    const fetchNewGame = async () => {
        try {
            const response = await startNewGame(size, size, mineCount);
            gameInterface.current.updateGame(response);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Used to start the game.
     * <br> If offline is true, contacts the server, otherwise uses local logic.
     */
    useEffect(() => {
        const startGame = async () => {
            if(!offline) {
                gameInterface.current = new MineSweeperState();
                try {
                    const response = await fetchNewGame();
                    gameInterface.current.updateGame(response);
                } catch (error) {
                    console.error("Error starting the game:", error);
                    setLoading(false);
                }
            } else {
                gameInterface.current = new MinesweeperGame(size,mineCount);
                setLoading(false);
            }
        };

        startGame().then(() => { setLoading(false)});
    }, []);

    /**
     * Used to check if any tiles are colliding with VR controllers and adds left and right trigger functions to
     * the controller.
     * <br> Requires a reference to the VR controllers.
     */
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

    /**
     * Function used to handle opening a tile.
     * <br> Updates the grid logically first and then graphically.
     * @param index tile to open
     */
    const handleTileClick = async (index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        if(!offline) {
            const response = await processUserInput(row, col, false);
            gameInterface.current.updateGame(response);
        } else {
            gameInterface.current.revealTile(index)
        }

        if (gameInterface.current.grid[index].mine && gameInterface.current.grid[index].revealed ||
            isGameOver()) {
            revealAll();
        }

        updateGrid();
    };

    /**
     * Function used to handle marking a tile.
     * <br> Updates the grid logically first and then graphically.
     * @param index tile to open
     */
    const handleTileMark = async (index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        if(!offline) {
            const response = await processUserInput(row, col, true);
            gameInterface.current.updateGame(response);
        } else {
            gameInterface.current.markTile(index);
        }

        if(isGameOver()) revealAll();

        updateGrid();
    };

    const isGameOver = () => {
        let open = 0;
        let marked = 0;
        gameInterface.current.grid.forEach(tile => {
            if(tile.revealed) {open += 1}
            if(tile.marked) {marked += 1}
        });
        return open === (size * size) - mineCount && marked === mineCount;
    }

    const revealAll = () => {
        gameInterface.current.grid.forEach(tile => tile.revealed = true);
        updateGrid();
    };

    if (loading) return null;

    return (
        <group position={position}>
            <group position={[-(9 * spacing) / 2, 0, -(9 * spacing) / 2]}> {/* Center the grid */}
                {gameInterface.current.grid.map((tile, index) => {
                    const x = (index % 9) * spacing;
                    const z = Math.floor(index / 9) * spacing;
                    return (
                        <Tile
                            key={index}
                            ref={(ref) => (tileRefs.current[index] = ref)}
                            position={[x, 0, z]}
                            index={index}
                            size={tileSize}
                            game={gameInterface.current}
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
