// main.js

import { updatePlayerList, handleAddPlayer, handleSortTeams, copiarTimesWhatsApp, openEditModal, closeModal, saveEdit } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  updatePlayerList();

  document.getElementById('btnAddPlayer').addEventListener('click', handleAddPlayer);
  document.getElementById('btnSortTeams').addEventListener('click', handleSortTeams);
  document.getElementById('btnCopyWhatsApp').addEventListener('click', copiarTimesWhatsApp);
  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
  document.getElementById('btnSaveEdit').addEventListener('click', saveEdit);
});

// Expor openEditModal para ser usado no UI (botão Edit) dentro do ui.js
window.openEditModal = openEditModal;
