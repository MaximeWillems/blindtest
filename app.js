// Anime Blind Test — logique de jeu (squelette).
//
// Mode solo en QCM sur la banque OPENINGS (voir data.js). Une manche = un extrait
// à écouter + 4 propositions. Bonne réponse rapide = plus de points.
//
// Points d'extension prévus : mode multijoueur local (plusieurs scores), saisie
// libre au lieu du QCM, filtres (populaires/obscurs, décennie), difficulté.

const GUESS_TIME = 15;        // secondes pour répondre
const CHOICES_PER_ROUND = 4;  // nombre de propositions au QCM

const state = {
  deck: [],        // openings tirés pour la partie
  index: 0,        // manche courante
  score: 0,
  totalRounds: 5,
  answered: false,
  timerId: null,
  timeLeft: 0
};

const $ = (id) => document.getElementById(id);
const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  end: $("screen-end")
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  const diff = $("difficulty").value;
  const pool = diff === "toutes" ? OPENINGS : OPENINGS.filter((o) => o.difficulty === diff);
  state.totalRounds = Math.min(Number($("rounds").value), pool.length);
  state.deck = shuffle(pool).slice(0, state.totalRounds);
  state.index = 0;
  state.score = 0;
  show("game");
  loadRound();
}

function loadRound() {
  state.answered = false;
  const current = state.deck[state.index];

  $("progress").textContent = `Manche ${state.index + 1} / ${state.totalRounds}`;
  $("score").textContent = `Score : ${state.score}`;
  $("reveal").classList.add("hidden");

  // Jaquette masquée pendant qu'on devine — révélée à la réponse
  const cover = $("cover");
  cover.style.backgroundImage = "";
  cover.textContent = "🎧";
  cover.classList.remove("cover--revealed");

  // Audio
  const audio = $("audio");
  audio.src = current.audio || "";
  audio.load();

  // QCM : bonne réponse + distracteurs
  const wrong = shuffle(OPENINGS.filter((o) => o.id !== current.id))
    .slice(0, CHOICES_PER_ROUND - 1);
  const choices = shuffle([current, ...wrong]);

  const box = $("choices");
  box.innerHTML = "";
  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.title;
    btn.onclick = () => answer(choice, btn);
    box.appendChild(btn);
  });

  resetTimer();
}

function resetTimer() {
  clearInterval(state.timerId);
  state.timeLeft = GUESS_TIME;
  $("timer-bar").style.width = "100%";
}

function startTimer() {
  clearInterval(state.timerId);
  const tick = 100;
  state.timerId = setInterval(() => {
    state.timeLeft -= tick / 1000;
    const pct = Math.max(0, (state.timeLeft / GUESS_TIME) * 100);
    $("timer-bar").style.width = pct + "%";
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      if (!state.answered) answer(null, null); // temps écoulé
    }
  }, tick);
}

function playAudio() {
  const audio = $("audio");
  if (!audio.src) return;
  audio.currentTime = 0;
  audio.play().catch(() => { /* extrait indispo : on joue quand même sans son */ });
  startTimer();
}

function answer(choice, btn) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerId);
  $("audio").pause();

  const current = state.deck[state.index];
  const correct = choice && choice.id === current.id;
  let gained = 0;
  if (correct) {
    gained = Math.max(1, Math.round(state.timeLeft)); // bonus rapidité
    state.score += gained;
  }

  // Colorer les propositions
  document.querySelectorAll(".choice").forEach((b) => {
    b.disabled = true;
    if (b.textContent === current.title) b.classList.add("correct");
    else if (btn && b === btn && !correct) b.classList.add("wrong");
  });

  // Révélation : jaquette + infos
  const cover = $("cover");
  if (current.cover && current.cover.startsWith("http")) {
    cover.style.backgroundImage = `url("${current.cover}")`;
    cover.textContent = "";
    cover.classList.add("cover--revealed");
  }

  const result = $("reveal-result");
  if (correct) {
    result.textContent = `✅ Bien joué ! +${gained}`;
    result.className = "reveal-result good";
  } else {
    result.textContent = choice ? "❌ Raté" : "⏱️ Temps écoulé";
    result.className = "reveal-result bad";
  }

  $("answer-title").textContent = current.title;
  const meta = [current.song, current.artist].filter(Boolean).join(" — ");
  $("answer-song").textContent = `${meta} · ${current.year}`;
  $("score").textContent = `Score : ${state.score}`;
  $("reveal").classList.remove("hidden");
}

function nextRound() {
  state.index++;
  if (state.index >= state.totalRounds) {
    $("final-score").textContent = state.score;
    show("end");
  } else {
    loadRound();
  }
}

// Événements
$("btn-start").onclick = startGame;
$("btn-play").onclick = playAudio;
$("btn-next").onclick = nextRound;
$("btn-replay").onclick = () => show("home");

show("home");
