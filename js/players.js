// players.js

export let players = JSON.parse(localStorage.getItem('players')) || [];
export let currentEditIndex = null;

const posicoesValidas = ['goleiro', 'zagueiro', 'meio', 'ataque', 'ala'];

export function isValidPosition(posicao) {
  return posicoesValidas.includes(posicao);
}

export function savePlayers() {
  localStorage.setItem('players', JSON.stringify(players));
}

export function addPlayer(nome, posicao) {
  if (!nome.trim()) throw new Error('Nome vazio');
  if (!isValidPosition(posicao)) throw new Error('Posição inválida');

  players.push({ nome: nome.trim(), posicao });
  savePlayers();
}

export function removePlayer(index) {
  players.splice(index, 1);
  savePlayers();
}

export function editPlayer(index, novoNome, novaPosicao) {
  if (!novoNome.trim()) throw new Error('Nome vazio');
  if (!isValidPosition(novaPosicao)) throw new Error('Posição inválida');

  players[index] = { nome: novoNome.trim(), posicao: novaPosicao };
  savePlayers();
}

export function abreviacaoPosicao(posicao) {
  switch (posicao) {
    case 'goleiro': return 'GOL';
    case 'zagueiro': return 'ZAG';
    case 'meio': return 'MEI';
    case 'ataque': return 'ATA';
    case 'ala': return 'ALA';
    default: return posicao.toUpperCase();
  }
}
