/**
 * The address the API is hosted on
 * @type {string} https address
 */
const API_BASE = 'http://localhost:8080/mines';

/**
 * Used to initialise a new game
 * @param rows number of rows
 * @param columns number of columns
 * @param mines number of mines
 * @returns {Promise<any>} JSON format
 */
export async function startNewGame(rows, columns, mines) {
    const response = await fetch(`${API_BASE}/jsonnew?rows=${rows}&columns=${columns}&mines=${mines}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}

/**
 * Used to send interaction to be processed on the server.
 * @param row x position of tile
 * @param column y position of tile
 * @param marking true = marking, false = opening
 * @returns {Promise<any>}
 */
export async function processUserInput(row, column, marking) {
    const response = await fetch(`${API_BASE}/json?row=${row}&column=${column}&marking=${marking}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
