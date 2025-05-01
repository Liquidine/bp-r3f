export class MinesweeperGame {
    /**
     * @param size size of the grid (size x size)
     * @param mines number of mines
     *
     * @code <br> This class also contains
     * <br>grid - grid of tiles
     * <br>status - game status string
     */
    constructor(size, mines) {
        if (mines >= size * size) {
            throw new Error("Mine count cannot be the same or higher than the field size");
        }
        this.size = size;
        this.mines = mines;
        this.grid = this.initializeGrid(size);
        this.status = "PLAYING";
        this.openTiles = 0;
        this.markedTiles = 0;
        this.placeMines(size, mines);
        this.calculateClues();
    }

    initializeGrid(size) {
        return Array.from({ length: size * size }, () => ({revealed: false, mine: false ,clue: 0, marked: false}));
    }

    /**
     * Generates a random placement of mines for the grid and assigns them to the tile.
     * @param size grid size
     * @param mineCount number
     */
    placeMines(size, mineCount) {
        const indices = new Set();
        while (indices.size < mineCount) {
            const index = Math.floor(Math.random() * (size * size));
            indices.add(index);
        }
        indices.forEach(index => (this.grid[index].mine = true));
    }

    /**
     * Calculates the neighbouring amount of mines for tile, for the whole grid.
     */
    calculateClues() {
        for (let index = 0; index < this.grid.length; index++) {
            const tile = this.grid[index];

            if (tile.mine) {
                tile.clue = 0;
                continue;
            }

            const x = index % this.size;
            const y = Math.floor(index / this.size);
            let clue = 0;

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;

                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                        const neighborIndex = ny * this.size + nx;

                        if (this.grid[neighborIndex].mine) {
                            clue++;
                        }
                    }
                }
            }

            tile.clue = clue;
        }
    }

    /**
     * Used for opening a tile. Can also activate @function floodReveal.
     * <br> Only updates tiles logically.
     * @param index the tile to reveal
     */
    revealTile(index) {
        const tile = this.grid[index];
        if (tile.revealed || this.status === 'GAME OVER' || tile.marked) return;

        if(tile.mine) {
            this.status = 'GAME OVER';
            this.revealAll()
        }

        tile.revealed = true;
        this.openTiles += 1;

        this.checkGameOver()

        if (tile.clue === 0) {
            this.floodReveal(index);
        }
    }

    /**
     * Used to mark a tile.
     * <br> Only updates the tile logically.
     * @param index the tile to be marked
     */
    markTile(index) {
        const tile = this.grid[index];
        if (tile.revealed || this.status === 'GAME OVER') return;

        if(!tile.marked) { this.markedTiles += 1}
        else { this.markedTiles -= 1 }
        tile.marked = !tile.marked;

        this.checkGameOver()
    }

    checkGameOver() {
        if(this.openTiles === (this.size * this.size)-this.mines && this.markedTiles === this.mines) {
            this.status = 'GAME OVER';
            this.revealAll();
        }
    }

    /**
     * Reveals empty tiles and their neighbours.
     * @param index the tile to reveal
     * <br> Only to be used in @function revealTile
     */
    floodReveal(index) {
        const x = index % this.size;
        const y = Math.floor(index / this.size);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                const neighborIndex = ny * this.size + nx;

                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    this.revealTile(neighborIndex);
                }
            }
        }
    }

    /**
     * Reveals all tiles.
     * <br> Only updates tiles logically.
     */
    revealAll() {
        for (let i = 0; i < (this.size * this.size); i++) {
            let tile = this.grid[i];
            tile.revealed = true;
        }
    }
}
