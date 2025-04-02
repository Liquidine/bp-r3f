export class MinesweeperGame {
    constructor(size, mines) {
        if (mines >= size * size) {
            throw new Error("Mine count cannot be the same or higher than the field size");
        }
        this.size = size;
        this.mines = mines;
        this.grid = this.initializeGrid(size);
        this.placeMines(size, mines);
        this.calculateClues();
    }

    initializeGrid(size) {
        return Array.from({ length: size * size }, () => ({revealed: false, mine: false ,clue: 0, marked: false}));
    }

    placeMines(size, mineCount) {
        const indices = new Set();
        while (indices.size < mineCount) {
            const index = Math.floor(Math.random() * (size * size));
            indices.add(index);
        }
        indices.forEach(index => (this.grid[index].mine = true));
    }

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

    revealTile(index) {
        const tile = this.grid[index];
        if (tile.revealed || tile.mine) return;
        tile.revealed = true;

        if (tile.clue === 0) {
            this.floodReveal(index);
        }
    }

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
}
