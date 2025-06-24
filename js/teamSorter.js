// teamSorter.js
import { abreviacaoPosicao } from './playerManager.js';

export function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function sortBalancedTeams(jogadores) {
  const grupos = {
    goleiro: [],
    zagueiro: [],
    ala: [],
    meio: [],
    ataque: []
  };

  jogadores.forEach(j => {
    if (grupos[j.posicao]) grupos[j.posicao].push(j);
  });

  Object.values(grupos).forEach(embaralhar);

  const qtdTimes = Math.min(
    grupos.goleiro.length,
    grupos.zagueiro.length,
    Math.floor(grupos.ala.length / 2),
    Math.floor(grupos.meio.length / 2),
    grupos.ataque.length
  );

  if (qtdTimes === 0) {
    throw new Error('Não há jogadores suficientes para formar ao menos um time completo.');
  }

  const times = Array.from({ length: qtdTimes }, () => ({ titulares: [], reservas: [] }));

  for (let i = 0; i < qtdTimes; i++) {
    times[i].titulares.push(grupos.goleiro.pop());
    times[i].titulares.push(grupos.zagueiro.pop());
    times[i].titulares.push(grupos.ala.pop());
    times[i].titulares.push(grupos.ala.pop());
    times[i].titulares.push(grupos.meio.pop());
    times[i].titulares.push(grupos.meio.pop());
    times[i].titulares.push(grupos.ataque.pop());
  }

  // Reservas organizados por posição
  const reservasPorPosicao = {
    zagueiro: grupos.zagueiro,
    ala: grupos.ala,
    meio: grupos.meio,
    ataque: grupos.ataque
  };

  const podeFormarTimeExtra =
    reservasPorPosicao.zagueiro.length >= 1 &&
    reservasPorPosicao.ala.length >= 2 &&
    reservasPorPosicao.meio.length >= 2 &&
    reservasPorPosicao.ataque.length >= 1;

  if (podeFormarTimeExtra) {
    const timeExtra = { titulares: [], reservas: [] };
    timeExtra.titulares.push(reservasPorPosicao.zagueiro.pop());
    timeExtra.titulares.push(reservasPorPosicao.ala.pop());
    timeExtra.titulares.push(reservasPorPosicao.ala.pop());
    timeExtra.titulares.push(reservasPorPosicao.meio.pop());
    timeExtra.titulares.push(reservasPorPosicao.meio.pop());
    timeExtra.titulares.push(reservasPorPosicao.ataque.pop());
    times.push(timeExtra);
  }

  const restantes = Object.values(reservasPorPosicao).flat();
  embaralhar(restantes);

  let i = 0;
  restantes.forEach(jogador => {
    times[i % qtdTimes].reservas.push(jogador);
    i++;
  });

  return times;
}

export function sortPlayersGeneric(players) {
  if (players.length < 2) throw new Error('Adicione pelo menos dois jogadores.');
  return sortBalancedTeams([...players]);
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
    const titularesOrdenados = [...team.titulares].sort((a, b) => ordem.indexOf(a.posicao) - ordem.indexOf(b.posicao));

    titularesOrdenados.forEach(p => {
      const simbolo = emoji[p.posicao] || '⚽';
      teamHTML += `<li class="pos-${p.posicao}">${simbolo} ${p.nome} (${abreviacaoPosicao(p.posicao)})</li>`;
    });

    teamHTML += '</ul>';

    if (team.reservas.length > 0) {
      teamHTML += `<strong>🔄 Reservas:</strong><ul>`;
      team.reservas.forEach(p => {
        const simbolo = emoji[p.posicao] || '⚽';
        teamHTML += `<li class="pos-${p.posicao}">${simbolo} ${p.nome} (${abreviacaoPosicao(p.posicao)})</li>`;
      });
      teamHTML += '</ul>';
    }

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

  let texto = '📋 *Times Sorteados*';

  teams.forEach((team, index) => {
    texto += `🏆 *Time ${index + 1}:*`;

    const titularesOrdenados = [...team.titulares].sort((a, b) => ordem.indexOf(a.posicao) - ordem.indexOf(b.posicao));
    titularesOrdenados.forEach(player => {
      const simbolo = emoji[player.posicao] || '⚽';
      texto += `${simbolo} ${player.nome} (${abreviacaoPosicao(player.posicao)})`;
    });

    if (team.reservas.length > 0) {
      texto += `🔄 *Reservas:*`;
      team.reservas.forEach(player => {
        const simbolo = emoji[player.posicao] || '⚽';
        texto += `${simbolo} ${player.nome} (${abreviacaoPosicao(player.posicao)})`;
      });
    }

    texto += '\n';
  });

  return texto;
}
