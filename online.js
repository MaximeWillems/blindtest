// Mode en ligne — AMORCE UI uniquement. Aucun réseau n'est branché pour l'instant.
//
// Le jour où on choisit la techno (Cloudflare Worker + Durable Objects, salon P2P
// WebRTC, ou défi du jour partagé), il suffira d'implémenter l'objet `Net` :
// l'UI l'appelle déjà aux bons endroits (créer / rejoindre / lancer).
//
// Réutilise le moteur de jeu de app.js : beginGame(), show(), state, $.

const Net = {
  role: null,   // "host" | "guest"
  code: null,
  me: "PIKI",
  players: [],  // rempli par le réseau plus tard ; ici : juste le joueur local

  createRoom(pseudo) {
    this.role = "host";
    this.me = pseudo;
    this.code = genRoomCode();
    this.players = [{ name: pseudo, host: true, me: true }];
    // TODO réseau : ouvrir le salon côté serveur, publier this.code, écouter les arrivées
    return this.code;
  },

  joinRoom(code, pseudo) {
    this.role = "guest";
    this.me = pseudo;
    this.code = code;
    this.players = [{ name: pseudo, host: false, me: true }];
    // TODO réseau : rejoindre le salon `code`, recevoir la liste des joueurs + l'état
  }

  // TODO réseau : onPlayersChanged(cb), startGame(settings), sendAnswer(...), onState(cb)
};

function genRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans I/O/0/1 ambigus
  let code = "";
  for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

function openOnline() {
  $("on-pseudo").value = Net.me || "PIKI";
  $("on-code").value = "";
  show("online");
}

function renderPlayers() {
  const ul = $("players");
  ul.innerHTML = "";
  Net.players.forEach((p) => {
    const li = document.createElement("li");
    li.className = "player" + (p.me ? " player--me" : "");
    li.textContent = p.name + (p.host ? " · hôte" : "") + (p.me ? " (toi)" : "");
    ul.appendChild(li);
  });
}

function enterRoom() {
  $("room-code").textContent = Net.code;
  const isHost = Net.role === "host";
  $("host-controls").style.display = isHost ? "" : "none";
  $("room-wait").style.display = isHost ? "none" : "";
  renderPlayers();
  show("room");
}

function createRoom() {
  Net.createRoom(($("on-pseudo").value || "PIKI").trim());
  enterRoom();
}

function joinRoom() {
  const code = ($("on-code").value || "").trim().toUpperCase();
  if (code.length < 4) { $("on-code").focus(); return; }
  Net.joinRoom(code, ($("on-pseudo").value || "PIKI").trim());
  enterRoom();
}

function launchOnline() {
  // Aperçu : on lance le moteur local avec les réglages du salon.
  // Plus tard : Net.startGame(settings) synchronisera tous les joueurs.
  beginGame($("on-mode").value, Number($("on-rounds").value), "toutes", false);
}

// Câblage
$("btn-create").onclick = createRoom;
$("btn-join").onclick = joinRoom;
$("btn-launch").onclick = launchOnline;
$("btn-copy").onclick = () => {
  if (navigator.clipboard) navigator.clipboard.writeText(Net.code || "").catch(() => {});
};
document.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => show(b.dataset.back)));
