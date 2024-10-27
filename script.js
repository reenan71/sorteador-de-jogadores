let players = JSON.parse(localStorage.getItem('players')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updatePlayerList();
});

function addPlayer() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value;
    if (playerName) {
        players.push(playerName);
        playerNameInput.value = '';
        updatePlayerList();
        savePlayers();
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = player;

        // Cria o contêiner de botões
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'action-button';
        editButton.onclick = () => editPlayer(index);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'action-button';
        removeButton.onclick = () => removePlayer(index);

        // Adiciona os botões ao grupo e o grupo ao li
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(removeButton);
        li.appendChild(buttonGroup);

        playerList.appendChild(li);
    });
}

function editPlayer(index) {
    const newName = prompt('Edite o nome do jogador:', players[index]);
    if (newName) {
        players[index] = newName;
        updatePlayerList();
        savePlayers();
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    savePlayers();
}

function sortPlayers() {
    if (players.length < 2) {
        alert('Adicione pelo menos dois jogadores.');
        return;
    }
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const teams = [];
    while (shuffledPlayers.length) {
        teams.push(shuffledPlayers.splice(0, 4));
    }

    displayTeams(teams);
}

function displayTeams(teams) {
    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = '';
    teams.forEach((team, index) => {
        teamsDiv.innerHTML += `<h2>Time ${index + 1}</h2><ul>${team.map(player => `<li>${player}</li>`).join('')}</ul>`;
    });
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}
