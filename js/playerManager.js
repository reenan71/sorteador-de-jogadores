// playerManager.js
export const posicoesValidas = ['goleiro', 'zagueiro', 'meio', 'ataque', 'ala'];

let players = JSON.parse(localStorage.getItem('players')) || [];
let currentEditIndex = null;

export function getPlayers() {
  return players;
}

export function savePlayers() {
  localStorage.setItem('players', JSON.stringify(players));
}

export function addPlayer(nome, posicao) {
  if (!nome.trim()) throw new Error('Por favor, insira o nome do jogador.');
  if (!posicoesValidas.includes(posicao)) throw new Error('Posição inválida.');

  players.push({ nome: nome.trim(), posicao });
  savePlayers();
}

export function removePlayer(index) {
  players.splice(index, 1);
  savePlayers();
}

export function updatePlayer(index, nome, posicao) {
  if (!nome.trim()) throw new Error('Nome não pode ser vazio.');
  if (!posicoesValidas.includes(posicao)) throw new Error('Posição inválida.');

  players[index] = { nome: nome.trim(), posicao };
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

export function setCurrentEditIndex(index) {
  currentEditIndex = index;
}

export function getCurrentEditIndex() {
  return currentEditIndex;
}

export function clearPlayers() {
  players = [];
  savePlayers();
}
