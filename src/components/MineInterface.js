export class MinesweeperInterface {
    constructor() {
        this.grid = [];
        this.status = '';
        this.markCount = 0;
    }

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