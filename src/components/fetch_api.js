const API_BASE = 'http://localhost:8080/mines';

export async function startNewGame(rows, columns, mines) {
    const response = await fetch(`${API_BASE}/jsonnew?rows=${rows}&columns=${columns}&mines=${mines}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}

export async function processUserInput(row, column, marking) {
    const response = await fetch(`${API_BASE}/json?row=${row}&column=${column}&marking=${marking}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}