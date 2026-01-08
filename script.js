document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'smartbottle_state';

  let state = loadState();

  const drunkEl = document.getElementById('drunk');
  const leftEl = document.getElementById('left');
  const goalEl = document.getElementById('goal');
  const goalShow = document.getElementById('goalShow');
  const batteryEl = document.getElementById('battery');
  const waterEl = document.getElementById('waterLevel');

  function defaultState() {
    return {
      drunk: 0,
      goal: 1000,
      battery: 100,
      water: 60
    };
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function render() {
    drunkEl.textContent = state.drunk + ' ml';
    goalShow.textContent = state.goal + ' ml';
    leftEl.textContent = Math.max(0, state.goal - state.drunk) + ' ml';
    batteryEl.textContent = state.battery + '%';
    waterEl.style.height = state.water + '%';
  }

  function updateBattery() {
    const ratio = state.drunk / state.goal;
    state.battery = Math.max(0, Math.round(100 - ratio * 100));
  }

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
      document.getElementById(page).classList.add('active');
    });
  });

  document.getElementById('drink250').addEventListener('click', () => {
    state.drunk += 250;
    state.water -= 10;
    updateBattery();
    saveState();
    render();
  });

  document.getElementById('drink500').addEventListener('click', () => {
    state.drunk += 500;
    state.water -= 20;
    updateBattery();
    saveState();
    render();
  });

  document.getElementById('reset').addEventListener('click', () => {
    state = defaultState();
    saveState();
    render();
  });

  goalEl.addEventListener('change', () => {
    state.goal = parseInt(goalEl.value) || 1000;
    updateBattery();
    saveState();
    render();
  });

  render();
});
