// Mode en ligne — client. Se connecte au Durable Object (voir worker/index.js)
// par WebSocket. Le serveur fait autorité : il choisit les openings, chronomètre,
// valide et compte les points. Le client affiche et envoie les réponses.
//
// Réutilise du solo : $ (app.js), show(), et l'élément <audio> partagé.

const mp = {
  ws: null, id: null, isHost: false, code: null, me: "PIKI",
  clipLen: Infinity, submitted: false, tickId: null, clip: null, leaving: false
};

const FICHE_LABELS = { anime: "Animé", type: "Opening / Ending", seq: "Numéro", song: "Musique", artist: "Artiste", year: "Année" };
const FICHE_ORDER = ["anime", "type", "seq", "song", "artist", "year"];

function genRoomCode() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans I/O/0/1 ambigus
  let c = "";
  for (let i = 0; i < 4; i++) c += A[Math.floor(Math.random() * A.length)];
  return c;
}

// ————————————————————————————— réseau —————————————————————————————
function netConnect(code, name) {
  mp.code = code; mp.me = name; mp.leaving = false;
  const proto = location.protocol === "https:" ? "wss" : "ws";
  mp.ws = new WebSocket(`${proto}://${location.host}/ws?room=${encodeURIComponent(code)}&name=${encodeURIComponent(name)}`);
  mp.ws.onmessage = (e) => { try { handleServer(JSON.parse(e.data)); } catch {} };
  mp.ws.onclose = () => { if (!mp.leaving) { alert("Connexion au salon perdue."); leaveOnline(); } };
  mp.ws.onerror = () => {};
}

function netSend(obj) { if (mp.ws && mp.ws.readyState === 1) mp.ws.send(JSON.stringify(obj)); }

function leaveOnline() {
  mp.leaving = true;
  clearInterval(mp.tickId);
  stopMpClip();
  if (mp.ws) { try { mp.ws.close(); } catch {} mp.ws = null; }
  $("audio").pause();
  show("home");
}

// ————————————————————————————— messages serveur —————————————————————————————
function handleServer(m) {
  switch (m.t) {
    case "welcome":
      mp.id = m.id; mp.isHost = m.isHost;
      enterRoom();
      break;
    case "host":
      mp.isHost = true;
      renderRoomControls();
      break;
    case "players":
      renderPlayers(m.players);
      updateWaitingStatus(m.players);
      break;
    case "round":
      startMpRound(m);
      break;
    case "reveal":
      showMpReveal(m);
      break;
    case "end":
      showMpEnd(m);
      break;
  }
}

// ————————————————————————————— lobby / salle —————————————————————————————
function openOnline() {
  $("on-pseudo").value = mp.me || "PIKI";
  $("on-code").value = "";
  show("online");
}

function createRoom() {
  const pseudo = ($("on-pseudo").value || "PIKI").trim() || "PIKI";
  netConnect(genRoomCode(), pseudo);
}

function joinRoom() {
  const code = ($("on-code").value || "").trim().toUpperCase();
  if (code.length < 4) { $("on-code").focus(); return; }
  const pseudo = ($("on-pseudo").value || "PIKI").trim() || "PIKI";
  netConnect(code, pseudo);
}

function enterRoom() {
  $("room-code").textContent = mp.code;
  renderRoomControls();
  show("room");
}

function renderRoomControls() {
  $("host-controls").style.display = mp.isHost ? "" : "none";
  $("room-wait").style.display = mp.isHost ? "none" : "";
}

function renderPlayers(players) {
  const ul = $("players");
  if (!ul) return;
  ul.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.className = "player" + (p.id === mp.id ? " player--me" : "");
    li.textContent = p.name + (p.host ? " · hôte" : "") + (p.id === mp.id ? " (toi)" : "");
    ul.appendChild(li);
  });
}

function hostSettings() {
  return {
    mode: "fiche",
    rounds: Number($("on-rounds").value),
    difficulty: $("on-diff").value,
    includeEd: $("on-ed").checked,
    clipLen: $("on-len").value,
    roundTime: Number($("on-time").value)
  };
}

function launchGame() {
  netSend({ t: "config", settings: hostSettings() });
  netSend({ t: "start" });
}

// ————————————————————————————— manche —————————————————————————————
function startMpRound(m) {
  clearInterval(mp.tickId);
  stopMpClip();
  mp.submitted = false;
  mp.clipLen = m.clipLen === "full" ? Infinity : Number(m.clipLen);

  $("mp-progress").textContent = `Manche ${m.index + 1} / ${m.total}`;
  $("mp-reveal").classList.add("hidden");
  $("mp-scores").classList.add("hidden");
  $("mp-status").classList.add("hidden");

  const cover = $("mp-cover");
  cover.style.backgroundImage = ""; cover.textContent = "🎧"; cover.classList.remove("cover--revealed");

  ["mp-anime", "mp-type", "mp-num", "mp-song", "mp-artist", "mp-year"].forEach((id) => ($(id).value = ""));
  const form = $("mp-fiche");
  form.classList.remove("hidden");
  [...form.elements].forEach((el) => (el.disabled = false));

  $("mp-play").disabled = false;
  $("mp-play").textContent = "▶︎ Écouter";
  const audio = $("audio");
  audio.src = m.audio || "";
  audio.load();

  // Compte à rebours visuel (le serveur fait autorité sur la fin réelle)
  let remaining = m.roundTime;
  $("mp-timer").textContent = `${remaining} s`;
  mp.tickId = setInterval(() => {
    remaining -= 1;
    $("mp-timer").textContent = `${Math.max(0, remaining)} s`;
    if (remaining <= 0) { clearInterval(mp.tickId); $("audio").pause(); $("mp-play").disabled = true; }
  }, 1000);

  show("mpGame");
}

function stopMpClip() {
  if (mp.clip) { $("audio").removeEventListener("timeupdate", mp.clip); mp.clip = null; }
}

function mpPlay() {
  const audio = $("audio");
  if (!audio.src || $("mp-play").disabled) return;
  stopMpClip();
  const L = mp.clipLen;
  const dur = audio.duration || 0;
  let start = 0;
  if (L <= 3 && dur > 8) { start = Math.min(30, Math.max(6, dur * 0.22)); start = Math.min(start, Math.max(0, dur - L - 1)); }
  try { audio.currentTime = start; } catch (e) { /* pas encore seekable */ }
  audio.play().catch(() => {});
  if (L !== Infinity) {
    const stopAt = start + L;
    mp.clip = () => { if (audio.currentTime >= stopAt) { audio.pause(); stopMpClip(); } };
    audio.addEventListener("timeupdate", mp.clip);
  }
  $("mp-play").disabled = true;
  $("mp-play").textContent = "🔇 Écoute utilisée";
}

function submitMpFiche(e) {
  if (e) e.preventDefault();
  if (mp.submitted) return;
  mp.submitted = true;
  netSend({ t: "answer", fields: {
    anime: $("mp-anime").value, type: $("mp-type").value, num: $("mp-num").value,
    song: $("mp-song").value, artist: $("mp-artist").value, year: $("mp-year").value
  }});
  [...$("mp-fiche").elements].forEach((el) => (el.disabled = true));
  $("mp-status").textContent = "En attente des autres joueurs…";
  $("mp-status").classList.remove("hidden");
}

function updateWaitingStatus(players) {
  if (!screens.mpGame || screens.mpGame.classList.contains("hidden")) return;
  if (!mp.submitted) return;
  const done = players.filter((p) => p.submitted).length;
  $("mp-status").textContent = `En attente des autres joueurs… (${done}/${players.length})`;
}

// ————————————————————————————— révélation / fin —————————————————————————————
function showMpReveal(m) {
  clearInterval(mp.tickId);
  stopMpClip();
  $("audio").pause();
  $("mp-fiche").classList.add("hidden");
  $("mp-status").classList.add("hidden");

  const a = m.answer;
  const cover = $("mp-cover");
  if (a.cover && a.cover.startsWith("http")) {
    cover.style.backgroundImage = `url("${a.cover}")`; cover.textContent = ""; cover.classList.add("cover--revealed");
  }
  $("mp-answer-title").textContent = a.title;
  const kind = `${a.type === "ED" ? "Ending" : "Opening"} ${a.seq}`;
  const meta = [a.song, a.artist].filter(Boolean).join(" — ");
  $("mp-answer-song").textContent = `${kind} · ${meta} · ${a.year}`;

  // Mon détail (barème par info)
  const mine = m.results.find((r) => r.id === mp.id);
  const box = $("mp-reveal-fiche");
  box.innerHTML = "";
  let max = 0;
  if (mine) {
    FICHE_ORDER.forEach((k) => {
      const b = mine.breakdown[k];
      if (!b) return;
      max += b.pts;
      const row = document.createElement("div");
      row.className = `fiche-row ${b.ok ? "good" : "bad"}`;
      const tag = document.createElement("span");
      tag.textContent = `${b.ok ? "✅" : "❌"} ${FICHE_LABELS[k]} · ${b.pts} pt${b.pts > 1 ? "s" : ""}`;
      row.appendChild(tag);
      box.appendChild(row);
    });
  }
  const res = $("mp-reveal-result");
  const gained = mine ? mine.gained : 0;
  res.textContent = `${gained} / ${max} pts`;
  res.className = `reveal-result ${gained > 0 ? "good" : "bad"}`;

  $("mp-reveal").classList.remove("hidden");
  renderScoreboard(m.scores, "mp-scores");
  $("mp-scores").classList.remove("hidden");
}

function showMpEnd(m) {
  clearInterval(mp.tickId);
  renderScoreboard(m.scores, "mp-podium");
  $("mp-again").classList.toggle("hidden", !mp.isHost);
  $("mp-again-wait").classList.toggle("hidden", mp.isHost);
  show("mpEnd");
}

function renderScoreboard(scores, containerId) {
  const box = $(containerId);
  box.innerHTML = "";
  scores.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "score-row" + (s.id === mp.id ? " me" : "");
    const rank = document.createElement("span"); rank.className = "rank"; rank.textContent = `${i + 1}.`;
    const who = document.createElement("span"); who.className = "who"; who.textContent = s.name + (s.id === mp.id ? " (toi)" : "");
    const pts = document.createElement("span"); pts.className = "pts"; pts.textContent = `${s.score} pts`;
    row.append(rank, who, pts);
    box.appendChild(row);
  });
}

// ————————————————————————————— câblage —————————————————————————————
$("btn-create").onclick = createRoom;
$("btn-join").onclick = joinRoom;
$("btn-launch").onclick = launchGame;
$("mp-play").onclick = mpPlay;
$("mp-fiche").onsubmit = submitMpFiche;
$("mp-again").onclick = () => netSend({ t: "start" });
$("btn-copy").onclick = () => { if (navigator.clipboard) navigator.clipboard.writeText(mp.code || "").catch(() => {}); };
document.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => {
  if (b.dataset.back === "online") leaveOnline(), show("online");
  else leaveOnline();
}));
