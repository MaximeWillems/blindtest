// Anime Blind Test — logique de jeu.
//
// 3 modes solo sur la banque OPENINGS (voir data.js) :
//   - qcm    : QCM 4 propositions, bonus de rapidité
//   - fiche  : saisir un max d'infos (animé, opening, artiste, année), 1 pt / info
//   - flash  : deviner l'animé (saisie libre) sur 1 seconde d'extrait seulement
//   - full   : chanson entière, sans pause ni chrono ; on répond puis « prêt » révèle
// Le mode « en ligne » (multijoueur) viendra avec un petit backend — voir README.
//
// Extension prévue : mode « soirée » local, alias de titres pour la saisie,
// filtres décennie/genre, salon en ligne.

const GUESS_TIME = 15;        // secondes pour répondre (qcm / flash)
const FICHE_TIME = 30;        // secondes pour remplir la fiche
const FLASH_MS = 1000;        // durée jouée en mode éclair
const FULL_SCORE = 10;        // points d'une bonne réponse en mode chanson complète
const CHOICES_PER_ROUND = 4;  // propositions au QCM

// Points par info devinée en mode Fiche complète
const FICHE_POINTS = { anime: 2, type: 1, seq: 1, song: 3, artist: 2, year: 1 };

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

// Distance d'édition (Damerau-OSA) : nombre de corrections pour passer d'une
// chaîne à l'autre — ajout, suppression, remplacement, ou inversion de deux
// lettres voisines (la faute de frappe la plus fréquente) comptée pour 1.
function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev2 = null;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = new Array(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        cur[j] = Math.min(cur[j], prev2[j - 2] + 1); // inversion de 2 lettres
      }
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

// Fautes tolérées selon la longueur de la réponse (0 pour les mots très courts)
function fuzzyTol(len) {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 11) return 2;
  return 3;
}

function isCloseEnough(g, a) {
  if (!a) return false;
  if (a === g) return true;
  // titre partiel (ex. « fullmetal alchemist » pour la version Brotherhood)
  if (g.length >= 4 && a.length >= 4 && (a.includes(g) || g.includes(a))) return true;
  // petites fautes d'orthographe
  return editDistance(g, a) <= fuzzyTol(a.length);
}

function matchAnswer(guess, answer, opt) {
  const g = norm(guess);
  if (!g) return false;
  if (opt && opt.exact) return g === norm(answer); // année : exact
  const candidates = [answer, ...((opt && opt.aliases) || [])].map(norm).filter(Boolean);
  return candidates.some((a) => isCloseEnough(g, a));
}

// Démarre une partie (partagé par le solo et le mode en ligne)
function beginGame(mode, rounds, difficulty, includeEd) {
  state.mode = mode;
  let pool = includeEd ? OPENINGS : OPENINGS.filter((o) => o.type === "OP");
  if (difficulty !== "toutes") pool = pool.filter((o) => o.difficulty === difficulty);
  state.totalRounds = Math.min(rounds, pool.length);
  state.deck = shuffle(pool).slice(0, state.totalRounds);
  state.index = 0;
  state.score = 0;
  show("game");
  loadRound();
}

function startGame() {
  beginGame(state.mode, Number($("rounds").value), $("difficulty").value, $("include-ed").checked);
}

function loadRound() {
  state.answered = false;
  stopFlashClip();
  const current = state.deck[state.index];
  const usesForm = ["fiche", "flash", "full"].includes(state.mode);  // saisie libre
  const onlyAnime = state.mode === "flash" || state.mode === "full"; // un seul champ

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
  setPlayBtn("idle");
  $("timer-wrap").classList.toggle("hidden", state.mode === "full"); // full : pas de chrono
  $("btn-validate").textContent = state.mode === "full" ? "Prêt — révéler" : "Valider";

  // Bascule QCM <-> saisie libre
  $("choices").classList.toggle("hidden", usesForm);
  $("fiche").classList.toggle("hidden", !usesForm);

  if (usesForm) {
    ["f-anime", "f-type", "f-num", "f-song", "f-artist", "f-year"].forEach((id) => ($(id).value = ""));
    // En éclair / chanson complète, on ne demande que l'animé
    ["f-type", "f-num", "f-song", "f-artist", "f-year"].forEach((id) =>
      $(id).closest(".fiche-field").classList.toggle("hidden", onlyAnime));
  } else {
    // Distracteurs à titres distincts (un animé peut avoir un OP et un ED)
    const usedTitles = new Set([current.title]);
    const wrong = [];
    for (const o of shuffle(OPENINGS)) {
      if (usedTitles.has(o.title)) continue;
      usedTitles.add(o.title);
      wrong.push(o);
      if (wrong.length === CHOICES_PER_ROUND - 1) break;
    }
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

  state.roundTime = state.mode === "fiche" ? FICHE_TIME : GUESS_TIME;
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
        else if (state.mode === "flash") validateAnime(null);
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

function setPlayBtn(phase) {
  const btn = $("btn-play");
  if (state.mode === "flash") {
    btn.textContent = phase === "idle" ? "▶︎ Écouter (1 s)" : "🔁 Réécouter (1 s)";
    return;
  }
  btn.textContent = phase === "playing" ? "⏸ Pause" : phase === "paused" ? "▶︎ Reprendre" : "▶︎ Écouter";
}

// Joue l'extrait éclair : ~1 s de son en démarrant plus loin dans le morceau
// (l'intro est souvent silencieuse), coupé après 1 s de lecture *réelle*.
function playFlashClip() {
  const audio = $("audio");
  stopFlashClip();
  const dur = audio.duration || 0;
  let start = 0;
  if (dur > 8) start = Math.min(30, Math.max(6, dur * 0.22));
  start = Math.min(start, Math.max(0, dur - 1.5));
  try { audio.currentTime = start; } catch (e) { /* pas encore seekable */ }
  audio.play().catch(() => { /* extrait indispo : on continue sans son */ });
  const stopAt = start + FLASH_MS / 1000;
  state.flashClip = () => {
    if (audio.currentTime >= stopAt) { audio.pause(); stopFlashClip(); }
  };
  audio.addEventListener("timeupdate", state.flashClip);
}

// Bouton lecture : en éclair, (ré)écoute le 1 s ; sinon lecture/pause (gèle le chrono)
function onPlayButton() {
  const audio = $("audio");
  if (!audio.src || state.answered) return;

  if (state.mode === "full") {          // chanson entière : pas de pause, pas de chrono
    audio.currentTime = 0;
    audio.play().catch(() => { /* extrait indispo : on continue sans son */ });
    return;
  }

  if (state.mode === "flash") {
    const fresh = state.timeLeft === state.roundTime;
    playFlashClip();
    if (fresh) startTimer();
    setPlayBtn("replay");
    return;
  }

  if (audio.paused) {
    if (state.timeLeft === state.roundTime) audio.currentTime = 0; // 1ère écoute
    audio.play().catch(() => { /* extrait indispo : on continue sans son */ });
    startTimer();
    setPlayBtn("playing");
  } else {
    audio.pause();
    clearInterval(state.timerId);
    setPlayBtn("paused");
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
  const kind = `${current.type === "ED" ? "Ending" : "Opening"} ${current.seq}`;
  const meta = [current.song, current.artist].filter(Boolean).join(" — ");
  $("answer-song").textContent = `${kind} · ${meta} · ${current.year}`;
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
  setPlayBtn("idle");

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
  setPlayBtn("idle");

  const current = state.deck[state.index];
  const kindLabel = current.type === "ED" ? "Ending" : "Opening";

  // Une info par ligne, chacune vaut un nombre de points (voir FICHE_POINTS)
  const checks = [
    { label: "Animé", pts: FICHE_POINTS.anime, ok: matchAnswer($("f-anime").value, current.title, { aliases: current.aliases }), display: current.title },
    { label: "Opening / Ending", pts: FICHE_POINTS.type, ok: $("f-type").value === current.type, display: kindLabel },
    { label: "Numéro", pts: FICHE_POINTS.seq, ok: Number($("f-num").value) === current.seq, display: `${current.type}${current.seq}` },
    { label: "Musique", pts: FICHE_POINTS.song, ok: matchAnswer($("f-song").value, current.song, {}), display: current.song }
  ];
  if (current.artist) {
    checks.push({ label: "Artiste", pts: FICHE_POINTS.artist, ok: matchAnswer($("f-artist").value, current.artist, {}), display: current.artist });
  }
  checks.push({ label: "Année", pts: FICHE_POINTS.year, ok: matchAnswer($("f-year").value, String(current.year), { exact: true }), display: String(current.year) });

  let gained = 0;
  let correctCount = 0;
  const box = $("reveal-fiche");
  box.innerHTML = "";
  checks.forEach((c) => {
    if (c.ok) { gained += c.pts; correctCount++; }
    const row = document.createElement("div");
    row.className = `fiche-row ${c.ok ? "good" : "bad"}`;
    const tag = document.createElement("span");
    tag.textContent = `${c.ok ? "✅" : "❌"} ${c.label} · ${c.pts} pt${c.pts > 1 ? "s" : ""}`;
    const val = document.createElement("em");
    val.textContent = c.display;
    row.append(tag, val);
    box.appendChild(row);
  });
  state.score += gained;
  box.classList.remove("hidden");

  const result = $("reveal-result");
  result.textContent = `${correctCount} / ${checks.length} infos · +${gained} pts`;
  result.className = `reveal-result ${gained > 0 ? "good" : "bad"}`;

  revealCommon(current);
}

// Modes éclair / chanson complète : deviner l'animé en saisie libre
// (bonus de rapidité en éclair, points forfaitaires en chanson complète)
function validateAnime(e) {
  if (e) e.preventDefault();
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerId);
  stopFlashClip();
  $("audio").pause();
  setPlayBtn("idle");

  const current = state.deck[state.index];
  const ok = matchAnswer($("f-anime").value, current.title, { aliases: current.aliases });
  let gained = 0;
  if (ok) {
    gained = state.mode === "flash" ? Math.max(1, Math.round(state.timeLeft)) : FULL_SCORE;
    state.score += gained;
  }

  $("reveal-fiche").classList.add("hidden");
  const result = $("reveal-result");
  if (ok) { result.textContent = `✅ Bien joué ! +${gained}`; result.className = "reveal-result good"; }
  else { result.textContent = "❌ Raté"; result.className = "reveal-result bad"; }

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
$("btn-play").onclick = onPlayButton;
$("btn-next").onclick = nextRound;
$("btn-replay").onclick = () => show("home");
$("fiche").onsubmit = (e) => (state.mode === "fiche" ? validateFiche(e) : validateAnime(e));

show("home");
