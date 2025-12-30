let leagueData;

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    leagueData = data;
    updateView();
  });

function updateView() {
  buildTable(leagueData);
  buildMatchdays(leagueData);
}

/* =========================
   SPIELPLAN GENERATOR
========================= */
function buildMatchdays(data) {
  const container = document.getElementById('matchdays');
  container.innerHTML = '';

  const days = {};

  data.matches.forEach(m => {
    if (!days[m.matchday]) days[m.matchday] = [];
    days[m.matchday].push(m);
  });

  Object.keys(days).sort((a,b)=>a-b).forEach(day => {
    const div = document.createElement('section');
    div.innerHTML = `<h3>Spieltag ${day}</h3>`;

    days[day].forEach(m => {
      div.innerHTML += `
        <p>
          <strong>${m.teamA}</strong>
          ${m.scoreA ?? '-'} : ${m.scoreB ?? '-'}
          <strong>${m.teamB}</strong>
        </p>`;
    });

    container.appendChild(div);
  });
}

/* =========================
   TABELLE
========================= */
function buildTable(data) {
  const stats = {};

  data.teams.forEach(team => {
    stats[team] = {
      games: 0,
      points: 0,
      setsWon: 0
    };
  });

  data.matches.forEach(m => {
    if (m.scoreA === null || m.scoreB === null) return;

    stats[m.teamA].games++;
    stats[m.teamB].games++;

    stats[m.teamA].setsWon += m.scoreA;
    stats[m.teamB].setsWon += m.scoreB;

    if (m.scoreA > m.scoreB) {
      stats[m.teamA].points += 2;
    } else {
      stats[m.teamB].points += 2;
    }
  });

  const sorted = Object.entries(stats)
    .sort((a, b) => {
      if (b[1].points !== a[1].points) {
        return b[1].points - a[1].points;
      }
      return b[1].setsWon - a[1].setsWon;
    });

  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = '';

  sorted.forEach(([team, s], i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${team}</td>
        <td>${s.games}</td>
        <td>${s.points}</td>
        <td>${s.setsWon}</td>
      </tr>`;
  });
}

/* =========================
   SPIELTAGE
========================= */
function buildMatchdays(data) {
  const container = document.getElementById('matchdays');
  container.innerHTML = '';

  data.matches.forEach(m => {
    container.innerHTML += `
      <p>
        Spieltag ${m.matchday}:
        ${m.teamA} ${m.scoreA ?? '-'} : ${m.scoreB ?? '-'} ${m.teamB}
      </p>`;
  });
}

/* =========================
   HELPER
========================= */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
