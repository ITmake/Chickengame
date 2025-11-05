let state = {
    totals: [0, 0],
    rounds: [0, 0],
    active: 0,
    finished: false
  };

  document.addEventListener('DOMContentLoaded', () => {
  const targetInput = document.getElementById('target');
  const highscoreList = document.getElementById('highscore-list');

  function init() {
    document.getElementById('roll-0').addEventListener('click', () => kasta(0));
    document.getElementById('roll-1').addEventListener('click', () => kasta(1));
    document.getElementById('hold-0').addEventListener('click', () => stanna(0));
    document.getElementById('hold-1').addEventListener('click', () => stanna(1));
    document.getElementById('new-game').addEventListener('click', resetGame);

    resetGame();
    loadHighscores();
  }

  init();
});

 function kasta(playerIdx) {
    if (state.finished || state.active !== playerIdx) return;

    const kast = Math.floor(Math.random() * 6) + 1;

    if (kast === 1) {
      state.rounds[playerIdx] = 0;
      växlaSpelare();
    } else {
      state.rounds[playerIdx] += kast;
    }

    render();
  }

function stanna(playerIdx) {
    if (state.finished || state.active !== playerIdx) return;

    state.totals[playerIdx] += state.rounds[playerIdx];
    state.rounds[playerIdx] = 0;

    const målpoäng = parseInt(targetInput.value) || 100;
    if (state.totals[playerIdx] >= målpoäng) {
      state.finished = true;
      announceWinner(playerIdx, `🎉 ${getPlayerName(playerIdx)} har vunnit!`);
    } else {
      växlaSpelare();
    }

    render();
  }

  function växlaSpelare() {
    state.active = 1 - state.active;
  }

  function resetGame() {
    state = {
      totals: [0, 0],
      rounds: [0, 0],
      active: 0,
      finished: false
    };
    render();
  }

  function render() {
    for (let i = 0; i < 2; i++) {
      document.getElementById(`total-${i}`).textContent = state.totals[i];
      document.getElementById(`round-${i}`).textContent = state.rounds[i];
      const el = document.getElementById(`player-${i}`);
      el.classList.toggle('active', state.active === i && !state.finished);
      el.classList.toggle('winner', state.finished && state.totals[i] >= (parseInt(targetInput.value) || 100));
    }
  }

  function getPlayerName(i) {
    return `Spelare ${i + 1}`;
  }

  function announceWinner(playerIdx, message) {
    render();
    const name = prompt(`${message}\nAnge vinnarnamn:`, getPlayerName(playerIdx)) || getPlayerName(playerIdx);
    saveHighscore(name).then(() => {
      loadHighscores();
    });
  }