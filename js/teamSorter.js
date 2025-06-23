// teamSorter.js
import { abreviacaoPosicao } from './playerManager.js';

export function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function sortBalancedTeams(jogadores, tamanhoTime = 6) {
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

export function sortPlayersGeneric(players, tamanhoTime = 7) {
  if (players.length < 2) throw new Error('Adicione pelo menos dois jogadores.');

  const shuffled = [...players];
  embaralhar(shuffled);

  let teams = [];

  // assume players are objects with posicao
  if (players.length > 0 && typeof players[0] === 'object' && 'posicao' in players[0]) {
    teams = sortBalancedTeams(shuffled, tamanhoTime);
  } else {
    while (shuffled.length) {
      teams.push(shuffled.splice(0, tamanhoTime));
    }
  }
  return teams;
}

export function formatTeamsToHTML(teams) {
  const teamsDiv = document.createElement('div');
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
    const teamOrdenado = [...team].sort((a, b) => ordem.indexOf(a.posicao) - ordem.indexOf(b.posicao));

    teamOrdenado.forEach(p => {
      const simbolo = emoji[p.posicao] || '⚽';
      teamHTML += `<li class="pos-${p.posicao}">${simbolo} ${p.nome} (${abreviacaoPosicao(p.posicao)})</li>`;
    });
    teamHTML += '</ul>';

    const container = document.createElement('div');
    container.innerHTML = teamHTML;
    teamsDiv.appendChild(container);
  });
  return teamsDiv;
}

export function formatTeamsToWhatsAppText(teams) {
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

  return texto;
}
