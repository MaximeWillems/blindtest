// Anime Blind Test — logique de jeu.
//
// 3 modes solo sur la banque OPENINGS (voir data.js) :
//   - qcm    : QCM 4 propositions, bonus de rapidité
//   - fiche  : saisir un max d'infos (animé, opening, artiste, année), 1 pt / info
//   - flash  : QCM mais l'extrait ne joue qu'1 seconde
// Le mode « en ligne » (multijoueur) viendra avec un petit backend — voir README.
//
// Extension prévue : mode « soirée » local, alias de titres pour la saisie,
// filtres décennie/genre, salon en ligne.

const GUESS_TIME = 15;        // secondes pour répondre (qcm / flash)
const FICHE_TIME = 30;        // secondes pour remplir la fiche
const FLASH_MS = 1000;        // durée jouée en mode éclair
const CHOICES_PER_ROUND = 4;  // propositions au QCM

const state = {
  mode: "qcm",
  deck: [],        // openings tirés pour la partie
  index: 0,        // manche courante
  score: 0,
  totalRounds: 10,
  roundTime: GUESS_TIME,
  answered: false,
  timerId: null,
  flashClip: null,
  timeLeft: 0
};

const $ = (id) => document.getElementById(id);
const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  end: $("screen-end"),
  online: $("screen-online"),
  room: $("screen-room")
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

// Normalise pour comparer une saisie libre : minuscules, sans accents, sans
// articles ni ponctuation. "L'Attaque des Titans" -> "attaquetitans".
function norm(s) {
  const nfd = (s || "").toLowerCase().normalize("NFD");
  let out = "";
  for (const c of nfd) {
    const code = c.charCodeAt(0);
    if (code < 0x300 || code > 0x36f) out += c; // retire les accents (marques combinées)
  }
  return out
    .replace(/\b(the|le|la|les|l|un|une|des|of|no)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

function matchAnswer(guess, answer, opt) {
  const g = norm(guess);
  if (!g) return false;
  if (opt && opt.exact) return g === norm(answer);
  const candidates = [answer, ...((opt && opt.aliases) || [])].map(norm).filter(Boolean);
  return candidates.some((a) => a === g || g.includes(a) || (g.length >= 4 && a.includes(g)));
}

// Démarre une partie (partagé par le solo et le mode en ligne)
function beginGame(mode, rounds, difficulty) {
  state.mode = mode;
  const pool = difficulty === "toutes" ? OPENINGS : OPENINGS.filter((o) => o.difficulty === difficulty);
  state.totalRounds = Math.min(rounds, pool.length);
  state.deck = shuffle(pool).slice(0, state.totalRounds);
  state.index = 0;
  state.score = 0;
  show("game");
  loadRound();
}

function startGame() {
  beginGame(state.mode, Number($("rounds").value), $("difficulty").value);
}

function loadRound() {
  state.answered = false;
  stopFlashClip();
  const current = state.deck[state.index];
  const isFiche = state.mode === "fiche";

  $("progress").textContent = `Manche ${state.index + 1} / ${state.totalRounds}`;
  $("score").textContent = `Score : ${state.score}`;
  $("reveal").classList.add("hidden");
  $("reveal-fiche").classList.add("hidden");

  // Jaquette masquée pendant qu'on devine — révélée à la réponse
  const cover = $("cover");
  cover.style.backgroundImage = "";
  cover.textContent = "🎧";
  cover.classList.remove("cover--revealed");

  const audio = $("audio");
  audio.src = current.audio || "";
  audio.load();

  // Bascule QCM <-> Fiche
  $("choices").classList.toggle("hidden", isFiche);
  $("fiche").classList.toggle("hidden", !isFiche);

  if (isFiche) {
    ["f-anime", "f-song", "f-artist", "f-year"].forEach((id) => ($(id).value = ""));
  } else {
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
  }

  state.roundTime = isFiche ? FICHE_TIME : GUESS_TIME;
  resetTimer();
}

function resetTimer() {
  clearInterval(state.timerId);
  state.timeLeft = state.roundTime;
  $("timer-bar").style.width = "100%";
}

function startTimer() {
  clearInterval(state.timerId);
  const tick = 100;
  state.timerId = setInterval(() => {
    state.timeLeft -= tick / 1000;
    const pct = Math.max(0, (state.timeLeft / state.roundTime) * 100);
    $("timer-bar").style.width = pct + "%";
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      if (!state.answered) {
        if (state.mode === "fiche") validateFiche(null);
        else answer(null, null); // temps écoulé
      }
    }
  }, tick);
}

// Coupe l'écoute au bout de FLASH_MS de lecture *réelle* (mode éclair)
function stopFlashClip() {
  if (state.flashClip) {
    $("audio").removeEventListener("timeupdate", state.flashClip);
    state.flashClip = null;
  }
}

function playAudio() {
  const audio = $("audio");
  if (!audio.src) return;
  stopFlashClip();
  audio.currentTime = 0;
  audio.play().catch(() => { /* extrait indispo : on continue sans son */ });
  startTimer();
  if (state.mode === "flash") {
    const stopAt = FLASH_MS / 1000;
    state.flashClip = () => {
      if (audio.currentTime >= stopAt) { audio.pause(); stopFlashClip(); }
    };
    audio.addEventListener("timeupdate", state.flashClip);
  }
}

// Affiche la jaquette + le titre commun à tous les modes
function revealCommon(current) {
  const cover = $("cover");
  if (current.cover && current.cover.startsWith("http")) {
    cover.style.backgroundImage = `url("${current.cover}")`;
    cover.textContent = "";
    cover.classList.add("cover--revealed");
  }
  $("answer-title").textContent = current.title;
  const meta = [current.song, current.artist].filter(Boolean).join(" — ");
  $("answer-song").textContent = `${meta} · ${current.year}`;
  $("answer-song").style.display = state.mode === "fiche" ? "none" : "";
  $("score").textContent = `Score : ${state.score}`;
  $("reveal").classList.remove("hidden");
}

// Modes qcm / flash
function answer(choice, btn) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerId);
  stopFlashClip();
  $("audio").pause();

  const current = state.deck[state.index];
  const correct = choice && choice.id === current.id;
  let gained = 0;
  if (correct) {
    gained = Math.max(1, Math.round(state.timeLeft)); // bonus rapidité
    state.score += gained;
  }

  document.querySelectorAll(".choice").forEach((b) => {
    b.disabled = true;
    if (b.textContent === current.title) b.classList.add("correct");
    else if (btn && b === btn && !correct) b.classList.add("wrong");
  });

  $("reveal-fiche").classList.add("hidden");
  const result = $("reveal-result");
  if (correct) {
    result.textContent = `✅ Bien joué ! +${gained}`;
    result.className = "reveal-result good";
  } else {
    result.textContent = choice ? "❌ Raté" : "⏱️ Temps écoulé";
    result.className = "reveal-result bad";
  }

  revealCommon(current);
}

// Mode fiche : 1 point par info correcte
function validateFiche(e) {
  if (e) e.preventDefault();
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerId);
  $("audio").pause();

  const current = state.deck[state.index];
  const fields = [
    { label: "Animé", val: $("f-anime").value, answer: current.title, aliases: current.aliases },
    { label: "Opening", val: $("f-song").value, answer: current.song },
    { label: "Artiste", val: $("f-artist").value, answer: current.artist },
    { label: "Année", val: $("f-year").value, answer: String(current.year), exact: true }
  ].filter((f) => f.answer); // on ignore une info absente (ex : artiste inconnu)

  let gained = 0;
  const box = $("reveal-fiche");
  box.innerHTML = "";
  fields.forEach((f) => {
    const ok = matchAnswer(f.val, f.answer, f);
    if (ok) gained++;
    const row = document.createElement("div");
    row.className = `fiche-row ${ok ? "good" : "bad"}`;
    const tag = document.createElement("span");
    tag.textContent = `${ok ? "✅" : "❌"} ${f.label}`;
    const val = document.createElement("em");
    val.textContent = f.answer;
    row.append(tag, val);
    box.appendChild(row);
  });
  state.score += gained;
  box.classList.remove("hidden");

  const result = $("reveal-result");
  result.textContent = `${gained} / ${fields.length} infos · +${gained}`;
  result.className = `reveal-result ${gained > 0 ? "good" : "bad"}`;

  revealCommon(current);
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

// Sélection du mode sur l'accueil (la carte « En ligne » ouvre le lobby)
document.querySelectorAll(".mode-card").forEach((card) => {
  card.onclick = () => {
    if (card.dataset.mode === "online") { openOnline(); return; }
    document.querySelectorAll(".mode-card").forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");
    state.mode = card.dataset.mode;
  };
});

// Volume (réglage mémorisé entre les parties)
const VOL_KEY = "blindtest.volume";
function volIcon(v) { return v === 0 ? "🔇" : v < 34 ? "🔈" : v < 67 ? "🔉" : "🔊"; }
function setVolume(v) {
  v = Math.max(0, Math.min(100, v));
  $("volume").value = v;
  $("audio").volume = v / 100;
  $("vol-icon").textContent = volIcon(v);
  try { localStorage.setItem(VOL_KEY, String(v)); } catch (e) { /* stockage indispo */ }
}
const storedVol = (() => { try { return localStorage.getItem(VOL_KEY); } catch (e) { return null; } })();
setVolume(storedVol === null ? 80 : Number(storedVol));

$("volume").oninput = () => setVolume(Number($("volume").value));
$("vol-icon").onclick = () => {
  const v = Number($("volume").value);
  if (v > 0) { $("vol-icon").dataset.prev = v; setVolume(0); }
  else { setVolume(Number($("vol-icon").dataset.prev) || 80); }
};

// Événements
$("btn-start").onclick = startGame;
$("btn-play").onclick = playAudio;
$("btn-next").onclick = nextRound;
$("btn-replay").onclick = () => show("home");
$("fiche").onsubmit = validateFiche;

show("home");
