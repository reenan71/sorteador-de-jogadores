let players = JSON.parse(localStorage.getItem('players')) || [];
  let currentEditIndex = null;
  let teams = [];

  document.addEventListener('DOMContentLoaded', () => {
    updatePlayerList();
  });

  const posicoesValidas = ['goleiro', 'zagueiro', 'meio', 'ataque', 'ala'];

  function addPlayer() {
    const playerNameInput = document.getElementById('playerName');
    const playerPositionSelect = document.getElementById('playerPosition');
    const playerName = playerNameInput.value.trim();
    const playerPosition = playerPositionSelect.value;

    if (!playerName) {
      alert('Por favor, insira o nome do jogador.');
      return;
    }

    if (!posicoesValidas.includes(playerPosition)) {
      alert('Posição inválida.');
      return;
    }

    players.push({ nome: playerName, posicao: playerPosition });
    playerNameInput.value = '';
    updatePlayerList();
    savePlayers();
  }

  function updatePlayerList() {
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
      editButton.onclick = () => openEditModal(index);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remover';
      removeButton.className = 'action-button btn-danger';
      removeButton.onclick = () => {
        if (confirm(`Remover jogador "${player.nome}"?`)) {
          removePlayer(index);
        }
      };

      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(removeButton);
      li.appendChild(buttonGroup);

      playerList.appendChild(li);
    });
  }

  function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    savePlayers();
  }

  function abreviacaoPosicao(posicao) {
    switch (posicao) {
      case 'goleiro': return 'GOL';
      case 'zagueiro': return 'ZAG';
      case 'meio': return 'MEI';
      case 'ataque': return 'ATA';
      case 'ala': return 'ALA';
      default: return posicao.toUpperCase();
    }
  }

  function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
  }

  function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function sortPlayersGeneric(tamanhoTime = 7) {
    if (players.length < 2) {
      alert('Adicione pelo menos dois jogadores.');
      return;
    }

    const isBalanceado = typeof players[0] === 'object' && 'posicao' in players[0];

    const shuffled = [...players];
    embaralhar(shuffled);

    teams = [];

    if (isBalanceado) {
      teams = sortBalancedTeams(shuffled, tamanhoTime);
    } else {
      while (shuffled.length) {
        teams.push(shuffled.splice(0, tamanhoTime));
      }
    }

    displayTeams(teams);
  }

function sortBalancedTeams(jogadores, tamanhoTime = 6) {
  const grupos = {};
  jogadores.forEach(jogador => {
    if (!grupos[jogador.posicao]) grupos[jogador.posicao] = [];
    grupos[jogador.posicao].push(jogador);
  });

  Object.values(grupos).forEach(grupo => embaralhar(grupo));

  const qtdTimes = Math.ceil(jogadores.length / tamanhoTime);
  const times = Array.from({ length: qtdTimes }, () => []);

  const posicaoPorTime = times.map(() => ({}));

  const ordemPos = ['goleiro', 'zagueiro', 'ala', 'meio', 'ataque'];

  // Distribuir posição por posição, garantindo diversidade
  ordemPos.forEach(posicao => {
    const grupo = grupos[posicao] || [];
    let i = 0;

    grupo.forEach(jogador => {
      let tentativas = 0;
      while (tentativas < qtdTimes) {
        const timeIndex = i % qtdTimes;
        const time = times[timeIndex];
        const posCount = posicaoPorTime[timeIndex][posicao] || 0;

        if (posCount === 0 || grupo.length < qtdTimes) {
          time.push(jogador);
          posicaoPorTime[timeIndex][posicao] = posCount + 1;
          break;
        }

        i++;
        tentativas++;
      }
      i++;
    });
  });


  const todos = Object.values(grupos).flat();
  const usados = new Set(times.flat());
  const faltando = todos.filter(j => !usados.has(j));
  embaralhar(faltando);
  faltando.forEach(jogador => {
    const menor = times.reduce((a, b) => (a.length < b.length ? a : b));
    menor.push(jogador);
  });

  return times;
}

function displayTeams(teams) {
  const teamsDiv = document.getElementById('teams');
  teamsDiv.innerHTML = '';

  const ordem = ['goleiro', 'zagueiro', 'ala', 'meio', 'ataque'];
  const emoji = {
    goleiro: '🧤',
    zagueiro: '🛡️',
    ala: '🌀',
    meio: '🎯',
    ataque: '🔥'
  };

  teams.forEach((team, index) => {
    let teamHTML = `<h2>Time ${index + 1}</h2><ul>`;

    // Ordenar o time pela ordem definida
    const teamOrdenado = [...team].sort((a, b) => {
      const posA = ordem.indexOf(a.posicao);
      const posB = ordem.indexOf(b.posicao);
      return posA - posB;
    });

    teamOrdenado.forEach(p => {
      const posClass = `pos-${p.posicao}`; 
      const simbolo = emoji[p.posicao] || '⚽';
      teamHTML += `<li class="${posClass}">${simbolo} ${p.nome} (${abreviacaoPosicao(p.posicao)})</li>`;
    });

    teamHTML += '</ul>';
    teamsDiv.innerHTML += teamHTML;
  });
}




  // Modal edição
  function openEditModal(index) {
    currentEditIndex = index;
    const player = players[index];
    document.getElementById('editName').value = player.nome;
    document.getElementById('editPosition').value = player.posicao;
    document.getElementById('modalEdit').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('modalEdit').style.display = 'none';
  }

  function saveEdit() {
    const newName = document.getElementById('editName').value.trim();
    const newPos = document.getElementById('editPosition').value;

    if (!newName) {
      alert('Nome não pode ser vazio.');
      return;
    }
    if (!posicoesValidas.includes(newPos)) {
      alert('Posição inválida.');
      return;
    }

    players[currentEditIndex] = { nome: newName, posicao: newPos };
    savePlayers();
    updatePlayerList();
    closeModal();
  }

  function copiarTimesWhatsApp() {
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

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  toast.classList.remove('success', 'error');
  toast.classList.add(type, 'show');

  setTimeout(() => {
    toast.classList.remove('show', 'success', 'error');
  }, 3000);
}



