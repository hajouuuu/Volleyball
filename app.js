fetch('data.json')
  .then(response => response.json())
  .then(data => {
    buildTable(data);
    buildMatchdays(data);
  });

function buildTable(data) {
  const stats = {};

  data.teams.forEach(team => {
    stats[team] = { games: 0, points: 0 };
  });

  data.matches.forEach(match => {
    stats[match.teamA].games++;
    stats[match.teamB].games++;

    if (match.scoreA > match.scoreB) {
      stats[match.teamA].points += 2;
    } else {
      stats[match.teamB].points += 2;
    }
  });

  const sorted = Object.entries(stats)
    .sort((a, b) => b[1].points - a[1].points);

  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = '';

  sorted.forEach(([team, s], index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${team}</td>
        <td>${s.games}</td>
        <td>${s.points}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function buildMatchdays(data) {
  const container = document.getElementById('matchdays');
  const days = {};

  data.matches.forEach(match => {
    if (!days[match.matchday]) {
      days[match.matchday] = [];
    }
    days[match.matchday].push(match);
  });

  Object.keys(days).sort((a,b)=>a-b).forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.innerHTML = `<h3>Spieltag ${day}</h3>`;

    days[day].forEach(m => {
      dayDiv.innerHTML += `<p>${m.teamA} ${m.scoreA} : ${m.scoreB} ${m.teamB}</p>`;
    });

    container.appendChild(dayDiv);
  });
}
