export function loadPlayers() {
  try {
    const raw = localStorage.getItem('players');
    return JSON.parse(raw) || [];
  } catch (e) {
    alert('Erro ao carregar jogadores.');
    return [];
  }
}

export function savePlayers(players) {
  localStorage.setItem('players', JSON.stringify(players));
}
