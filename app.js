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
function generateSchedule() {
  if (leagueData.matches.length > 0) {
    alert("Spielplan existiert bereits!");
    return;
  }

  const teams = [...leagueData.teams];
  shuffle(teams);

  let matchday = 1;

  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      leagueData.matches.push({
        matchday: matchday,
        teamA: teams[i],
        teamB: teams[i + 1],
        scoreA: null,
        scoreB: null
      });
    }
    matchday++;
  }

  updateView();
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
