export class MineSweeperState {
    /**
     * @code <br> This class contains
     * <br>grid - grid of tiles
     * <br>status - game status string
     * <br>markCount - number of tiles marked
     */
    constructor() {
        this.grid = [];
        this.status = '';
        this.markCount = 0;
    }

    /**
     * This function translates the JSON from the server and saves the data in the class.
     * @param response raw JSON from server
     */
    updateGame(response) {
        const { tiles, gameStatus } = response;

        // Parse tiles into a flat array of objects
        this.grid = tiles.flat().map((tile, index) => ({
            index,
            revealed: tile.revealed,
            mine: tile.mine,
            clue: tile.clue,
            marked: tile.marked
        }));

        this.status = gameStatus;
    }
}