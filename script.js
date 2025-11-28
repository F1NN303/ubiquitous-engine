// 2v2 Tug-of-War mit einfachem tabellenbasierten Q-Learning.
// Alles in einer Datei, keine externen Abhängigkeiten – beim Öffnen der HTML-Datei sofort lauffähig.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Steuer-Elemente
const trainBtn = document.getElementById('trainBtn');
const demoBtn = document.getElementById('demoBtn');
const episodeInput = document.getElementById('episodeInput');
const statsBox = document.getElementById('stats');

// Physik- und Lernparameter
const ropeRange = 140; // Maximale Auslenkung des Seilmittlepunkts (Pixel)
const ropeWinThreshold = 120; // Sieg, wenn Seil so weit gezogen wird
const dt = 0.08; // Simulations-Zeit-Schritt
const friction = 0.92;
const actions = ['pull', 'hold', 'rest'];
const bins = 13; // Diskrete Zustände für den Seilmittelpunkt
const alpha = 0.25; // Lernrate
const gamma = 0.9; // Diskontierungsfaktor
let epsilon = 0.18; // Entdecker-Rate während des Trainings

// Q-Tabellen für beide Teams
const qTables = {
  left: Array.from({ length: bins }, () => Array(actions.length).fill(0)),
  right: Array.from({ length: bins }, () => Array(actions.length).fill(0)),
};

// Trainings-Statistiken
const stats = {
  episodes: 0,
  leftWins: 0,
  rightWins: 0,
  lastEpisodeSteps: 0,
};

// Visuals
const groundY = canvas.height * 0.7;
const ropeY = canvas.height * 0.45;
const charSpacing = 26;

// Utility: Clamp-Wert
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function discretize(pos) {
  const clamped = clamp(pos, -ropeRange, ropeRange);
  const ratio = (clamped + ropeRange) / (2 * ropeRange);
  return Math.min(bins - 1, Math.max(0, Math.floor(ratio * bins)));
}

function chooseAction(team, stateBin, greedy = false) {
  const q = qTables[team][stateBin];
  if (!greedy && Math.random() < epsilon) {
    return Math.floor(Math.random() * actions.length);
  }
  let best = 0;
  for (let i = 1; i < actions.length; i++) {
    if (q[i] > q[best]) best = i;
  }
  return best;
}

function maxQ(team, stateBin) {
  return Math.max(...qTables[team][stateBin]);
}

// Übersetzt Aktion in Kraftbeitrag (rechts positiv, links negativ)
function actionForce(actionIndex, team) {
  const base = [1.0, 0.25, -0.6][actionIndex];
  return team === 'left' ? -base : base;
}

// Eine Trainings-Episode simulieren (ohne Rendering), liefert Sieg-Team
function runEpisode() {
  let ropePos = 0;
  let ropeVel = 0;
  const maxSteps = 320;

  for (let step = 0; step < maxSteps; step++) {
    const state = discretize(ropePos);

    // Beide Teams wählen Aktion (für beide Figuren gleich, um Lernaufwand zu reduzieren)
    const leftAction = chooseAction('left', state);
    const rightAction = chooseAction('right', state);

    const prevPos = ropePos;

    // Kräfte addieren (zwei Figuren je Team -> doppelte Wirkung)
    const totalForce =
      2 * actionForce(leftAction, 'left') +
      2 * actionForce(rightAction, 'right');

    ropeVel += totalForce * dt;
    ropeVel *= friction;
    ropePos += ropeVel;

    // Rewards basierend auf Bewegungsrichtung des Seils
    const delta = ropePos - prevPos;
    let leftReward = -delta * 2; // Positives Delta bedeutet Vorteil für rechts
    let rightReward = delta * 2;

    let terminal = false;
    let winner = null;
    if (ropePos <= -ropeWinThreshold) {
      terminal = true;
      winner = 'left';
      leftReward += 8;
      rightReward -= 8;
    } else if (ropePos >= ropeWinThreshold) {
      terminal = true;
      winner = 'right';
      rightReward += 8;
      leftReward -= 8;
    }

    const nextState = discretize(ropePos);

    // Q-Learning-Update je Team
    const updateQ = (team, action, reward) => {
      const qVal = qTables[team][state][action];
      const target = reward + (terminal ? 0 : gamma * maxQ(team, nextState));
      qTables[team][state][action] = qVal + alpha * (target - qVal);
    };

    updateQ('left', leftAction, leftReward);
    updateQ('right', rightAction, rightReward);

    if (terminal) {
      stats.lastEpisodeSteps = step + 1;
      return winner;
    }
  }

  // Unentschieden wird als Verlust für beide behandelt, um zügiger zu lernen
  stats.lastEpisodeSteps = maxSteps;
  return 'draw';
}

// Training mehrerer Episoden, leicht asynchron, um UI nicht zu blockieren
async function trainEpisodes(count) {
  trainBtn.disabled = true;
  demoBtn.disabled = true;
  epsilon = Math.max(0.05, epsilon * 0.98); // Epsilon langsam senken

  for (let i = 0; i < count; i++) {
    const winner = runEpisode();
    stats.episodes += 1;
    if (winner === 'left') stats.leftWins += 1;
    else if (winner === 'right') stats.rightWins += 1;

    // UI gelegentlich aktualisieren
    if (i % 20 === 0) {
      renderStats();
      await new Promise((res) => setTimeout(res));
    }
  }

  renderStats();
  trainBtn.disabled = false;
  demoBtn.disabled = false;
}

// Demo-Match mit aktuellen Q-Werten (greedy)
let demoRunning = false;
function playDemo() {
  if (demoRunning) return;
  demoRunning = true;
  trainBtn.disabled = true;
  demoBtn.disabled = true;

  let ropePos = 0;
  let ropeVel = 0;

  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene(ropePos);

    const state = discretize(ropePos);
    const leftAction = chooseAction('left', state, true);
    const rightAction = chooseAction('right', state, true);

    const totalForce =
      2 * actionForce(leftAction, 'left') +
      2 * actionForce(rightAction, 'right');

    ropeVel += totalForce * dt;
    ropeVel *= friction;
    ropePos += ropeVel;

    if (ropePos <= -ropeWinThreshold || ropePos >= ropeWinThreshold) {
      drawScene(ropePos);
      demoRunning = false;
      trainBtn.disabled = false;
      demoBtn.disabled = false;
      return;
    }

    requestAnimationFrame(step);
  };

  step();
}

// Canvas-Rendering
function drawScene(ropePos) {
  ctx.fillStyle = '#0b1224';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Boden
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  // Seil
  const centerX = canvas.width / 2 + ropePos;
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#d1d5db';
  ctx.beginPath();
  ctx.moveTo(80, ropeY);
  ctx.lineTo(canvas.width - 80, ropeY);
  ctx.stroke();

  // Markierung Seilmittlepunkt
  ctx.fillStyle = ropePos > 0 ? '#3b82f6' : ropePos < 0 ? '#f97316' : '#e5e7eb';
  ctx.fillRect(centerX - 6, ropeY - 10, 12, 20);

  // Startmarker
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(canvas.width / 2 - 2, ropeY - 12, 4, 24);

  // Figuren (2 links, 2 rechts)
  drawTeam(centerX, 'left');
  drawTeam(centerX, 'right');
}

function drawTeam(centerX, team) {
  const color = team === 'left' ? '#f97316' : '#3b82f6';
  const direction = team === 'left' ? -1 : 1;
  for (let i = 0; i < 2; i++) {
    const x = centerX + direction * (60 + i * charSpacing);
    const y = groundY - 40 - i * 6;
    ctx.fillStyle = color;
    ctx.fillRect(x - 12, y - 28, 24, 28);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 12, y - 8, 24, 16);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(x - 10, y - 24, 8, 8);
    ctx.fillRect(x + 2, y - 24, 8, 8);
  }
}

// Stats-Text aktualisieren
function renderStats() {
  statsBox.innerHTML = `
    Episoden: ${stats.episodes}<br />
    Epsilon: ${epsilon.toFixed(3)}<br />
    Linke Siege: ${stats.leftWins} | Rechte Siege: ${stats.rightWins}<br />
    Letzte Episode: ${stats.lastEpisodeSteps} Schritte
  `;
}

// Event Listener
trainBtn.addEventListener('click', () => {
  const episodes = parseInt(episodeInput.value, 10) || 100;
  trainEpisodes(Math.max(10, episodes));
});

demoBtn.addEventListener('click', playDemo);

// Initialer Render
renderStats();
drawScene(0);
