// ui.js

import { players, currentEditIndex, abreviacaoPosicao, addPlayer, removePlayer, editPlayer, savePlayers } from './players.js';
import { sortPlayersGeneric, displayTeams, teams } from './teams.js';

export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  toast.classList.remove('success', 'error');
  toast.classList.add(type, 'show');

  setTimeout(() => {
    toast.classList.remove('show', 'success', 'error');
  }, 3000);
}

export function updatePlayerList() {
  const playerList = document.getElementById('playerList');
  playerList.innerHTML = '';

  players.forEach((player, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `${player.nome} (${abreviacaoPosicao(player.posicao)})`;
    span.className = `pos-${player.posicao}`;
    li.appendChild(span);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'action-button btn-edit';
    editButton.addEventListener('click', () => openEditModal(index));

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'action-button btn-danger';
    removeButton.addEventListener('click', () => {
      if (confirm(`Remover jogador "${player.nome}"?`)) {
        removePlayer(index);
        updatePlayerList();
        displayTeams(teams, document.getElementById('teams'));
      }
    });

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(removeButton);
    li.appendChild(buttonGroup);

    playerList.appendChild(li);
  });
}

export function openEditModal(index) {
  currentEditIndex = index;
  const player = players[index];
  document.getElementById('editName').value = player.nome;
  document.getElementById('editPosition').value = player.posicao;
  document.getElementById('modalEdit').style.display = 'flex';
}

export function closeModal() {
  document.getElementById('modalEdit').style.display = 'none';
}

export function saveEdit() {
  const newName = document.getElementById('editName').value.trim();
  const newPos = document.getElementById('editPosition').value;

  try {
    editPlayer(currentEditIndex, newName, newPos);
    updatePlayerList();
    closeModal();
    displayTeams(teams, document.getElementById('teams'));
  } catch (e) {
    alert(e.message);
  }
}

export function handleAddPlayer() {
  const playerNameInput = document.getElementById('playerName');
  const playerPositionSelect = document.getElementById('playerPosition');

  try {
    addPlayer(playerNameInput.value, playerPositionSelect.value);
    playerNameInput.value = '';
    updatePlayerList();
  } catch (e) {
    alert(e.message);
  }
}

export function handleSortTeams() {
  const tamanhoTime = Number(document.getElementById('teamSize').value);
  try {
    const newTeams = sortPlayersGeneric(tamanhoTime);
    displayTeams(newTeams, document.getElementById('teams'));
  } catch (e) {
    alert(e.message);
  }
}

export function copiarTimesWhatsApp() {
  if (!teams || teams.length === 0) {
    alert('Nenhum time sorteado para copiar.');
    return;
  }

  const ordem = ['goleiro', 'zagueiro', 'ala', 'meio', 'ataque'];
  const emoji = {
    goleiro: '🧤',
    zagueiro: '🛡️',
    ala: '🌀',
    meio: '🎯',
    ataque: '🔥'
  };

  let texto = '📋 *Times Sorteados*\n\n';

  teams.forEach((team, index) => {
    texto += `🏆 *Time ${index + 1}:*\n`;

    const teamOrdenado = [...team].sort((a, b) => ordem.indexOf(a.posicao) - ordem.indexOf(b.posicao));

    teamOrdenado.forEach(player => {
      const simbolo = emoji[player.posicao] || '⚽';
      texto += `${simbolo} ${player.nome} (${abreviacaoPosicao(player.posicao)})\n`;
    });

    texto += '\n';
  });

  navigator.clipboard.writeText(texto).then(() => {
    showToast('Times copiados para o WhatsApp! 📋');
  }).catch(err => {
    showToast('Erro ao copiar para a área de transferência ❌', 'error');
  });
}
