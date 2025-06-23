// main.js
import {
  posicoesValidas,
  addPlayer,
  getPlayers,
  removePlayer,
  updatePlayer,
  abreviacaoPosicao,
  setCurrentEditIndex,
  getCurrentEditIndex,
} from './playerManager.js';

import {
  sortPlayersGeneric,
  formatTeamsToHTML,
  formatTeamsToWhatsAppText,
} from './teamSorter.js';

let teams = [];

const playerNameInput = document.getElementById('playerName');
const playerPositionSelect = document.getElementById('playerPosition');
const playerList = document.getElementById('playerList');
const teamsDiv = document.getElementById('teams');
const toast = document.getElementById('toast');
const teamSizeInput = document.getElementById('teamSize');

const btnAddPlayer = document.getElementById('btnAddPlayer');
const btnSortTeams = document.getElementById('btnSortTeams');
const btnCopyWhatsApp = document.getElementById('btnCopyWhatsApp');

document.addEventListener('DOMContentLoaded', () => {
  updatePlayerList();

  btnAddPlayer.addEventListener('click', () => {
    try {
      addPlayer(playerNameInput.value, playerPositionSelect.value);
      playerNameInput.value = '';
      updatePlayerList();
      showToast('Jogador adicionado com sucesso!');
    } catch (e) {
      alert(e.message);
    }
  });

  btnSortTeams.addEventListener('click', () => {
    try {
      const tamanho = Number(teamSizeInput.value);
      const players = getPlayers();
      teams = sortPlayersGeneric(players, tamanho);
      displayTeams(teams);
    } catch (e) {
      alert(e.message);
    }
  });

  btnCopyWhatsApp.addEventListener('click', () => {
    if (!teams || teams.length === 0) {
      showToast('Nenhum time sorteado para copiar.');
      return;
    }

    const texto = formatTeamsToWhatsAppText(teams);

    navigator.clipboard.writeText(texto).then(() => {
      showToast('Times copiados para o WhatsApp! 📋');
    }).catch(() => {
      showToast('Erro ao copiar para a área de transferência ❌', 'error');
    });
  });
});

function updatePlayerList() {
  playerList.innerHTML = '';

  getPlayers().forEach((player, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${player.nome} (${abreviacaoPosicao(player.posicao)})`;
    span.className = `pos-${player.posicao}`;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'action-button btn-edit';
    editButton.onclick = () => openEditModal(index);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'action-button btn-danger';
    removeButton.onclick = () => {
      if (confirm(`Remover jogador "${player.nome}"?`)) {
        removePlayer(index);
        updatePlayerList();
        showToast('Jogador removido.');
      }
    };

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(removeButton);

    li.appendChild(span);
    li.appendChild(buttonGroup);

    playerList.appendChild(li);
  });
}

function openEditModal(index) {
  setCurrentEditIndex(index);
  const player = getPlayers()[index];
  const modal = createModal();
  modal.querySelector('#editName').value = player.nome;
  modal.querySelector('#editPosition').value = player.posicao;
  document.body.appendChild(modal);
  modal.style.display = 'flex';

  modal.querySelector('#btnCancel').addEventListener('click', () => {
    modal.remove();
  });

  modal.querySelector('#btnSave').addEventListener('click', () => {
    const newName = modal.querySelector('#editName').value;
    const newPos = modal.querySelector('#editPosition').value;

    try {
      updatePlayer(index, newName, newPos);
      updatePlayerList();
      showToast('Jogador editado com sucesso!');
      modal.remove();
    } catch (e) {
      alert(e.message);
    }
  });
}

function createModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  modalOverlay.innerHTML = `
    <div class="modal">
      <h3>Editar Jogador</h3>
      <label for="editName">Nome:</label>
      <input type="text" id="editName" />
      <label for="editPosition">Posição:</label>
      <select id="editPosition">
        <option value="goleiro">Goleiro</option>
        <option value="zagueiro">Zagueiro</option>
        <option value="ala">Ala</option>
        <option value="meio">Meio</option>
        <option value="ataque">Ataque</option>
      </select>
      <div class="modal-buttons">
        <button id="btnCancel" class="btn-danger action-button">Cancelar</button>
        <button id="btnSave" class="btn-add action-button">Salvar</button>
      </div>
    </div>
  `;
  return modalOverlay;
}

function displayTeams(teams) {
  teamsDiv.innerHTML = '';
  const container = formatTeamsToHTML(teams);
  teamsDiv.appendChild(container);
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}
