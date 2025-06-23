// teams.js

import { players, abreviacaoPosicao } from './players.js';

export let teams = [];

function embaralhar(array) {
  for (let i = array.length -1; i > 0; i--) {
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

export function sortPlayersGeneric(tamanhoTime = 7) {
  if (players.length < 2) {
    throw new Error('Adicione pelo menos dois jogadores.');
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

  return teams;
}

export function displayTeams(teams, containerElement) {
  containerElement.innerHTML = '';

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
    containerElement.innerHTML += teamHTML;
  });
}
