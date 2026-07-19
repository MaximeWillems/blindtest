// Anime Blind Test — Worker Cloudflare + Durable Object.
//
// - Sert le site statique (binding ASSETS) et l'API temps réel.
// - Un salon multijoueur = un Durable Object `Room` (serveur-autoritaire).
// - Phase 1 : mode Fiche uniquement. La Room choisit les openings, chronomètre,
//   valide les fiches et tient les scores. Les clients ne reçoivent jamais la
//   réponse avant la révélation.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/ws") {
      const code = (url.searchParams.get("room") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      if (!code) return new Response("code de salon manquant", { status: 400 });
      const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
      return stub.fetch(request);
    }
    // Tout le reste = fichiers statiques
    return env.ASSETS.fetch(request);
  }
};

// ————————————————————————————— Durable Object : un salon —————————————————————————————

const REVEAL_MS = 6000;   // durée d'affichage de la révélation avant la manche suivante

export class Room {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.data = null; // banque d'openings (chargée à la demande, en mémoire)
    // L'état survit à l'hibernation via le storage ; on le recharge au réveil.
    this.state.blockConcurrencyWhile(async () => {
      this.meta = (await state.storage.get("meta")) ||
        { phase: "lobby", hostId: null, roundIndex: -1, roundEndsAt: 0, pending: null };
      this.settings = (await state.storage.get("settings")) ||
        { mode: "fiche", rounds: 10, difficulty: "toutes", includeEd: false, clipLen: "full", roundTime: 60 };
      this.deck = (await state.storage.get("deck")) || [];
      this.scores = (await state.storage.get("scores")) || {};
      this.answers = (await state.storage.get("answers")) || {};
    });
  }

  currentOpening() { return this.deck[this.meta.roundIndex]; }

  connectedPlayers() {
    return this.state.getWebSockets().map((ws) => {
      const a = ws.deserializeAttachment() || {};
      return { ws, id: a.id, name: a.name };
    }).filter((p) => p.id);
  }

  async ensureData() {
    if (this.data) return this.data;
    const res = await this.env.ASSETS.fetch(new Request("https://assets.local/data.js"));
    const txt = await res.text();
    const openings = JSON.parse(txt.slice(txt.indexOf("["), txt.lastIndexOf("]") + 1));
    openings.forEach((o) => { o.aliases = ALIASES[o.anime] || []; });
    this.data = openings;
    return openings;
  }

  // — connexion (hibernation) —
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("attendu : websocket", { status: 426 });
    const url = new URL(request.url);
    const name = (url.searchParams.get("name") || "Joueur").trim().slice(0, 16) || "Joueur";
    const id = crypto.randomUUID().slice(0, 8);
    const pair = new WebSocketPair();
    const server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ id, name });

    if (!this.meta.hostId) { this.meta.hostId = id; await this.state.storage.put("meta", this.meta); }
    if (this.scores[id] == null) { this.scores[id] = 0; await this.state.storage.put("scores", this.scores); }

    server.send(JSON.stringify({ t: "welcome", id, isHost: id === this.meta.hostId, phase: this.meta.phase, settings: this.settings }));
    if (this.meta.phase === "playing" && this.currentOpening()) server.send(JSON.stringify(this.roundMessage()));
    else if (this.meta.phase !== "lobby") server.send(JSON.stringify({ t: "scores", scores: this.scoreboard() }));
    this.broadcastPlayers();
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketMessage(ws, raw) {
    const id = (ws.deserializeAttachment() || {}).id;
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (!id) return;

    if (msg.t === "config" && id === this.meta.hostId && (this.meta.phase === "lobby" || this.meta.phase === "ended")) {
      this.settings = { ...this.settings, ...sanitizeSettings(msg.settings) };
      await this.state.storage.put("settings", this.settings);
      this.broadcast({ t: "settings", settings: this.settings });
    } else if (msg.t === "start" && id === this.meta.hostId && (this.meta.phase === "lobby" || this.meta.phase === "ended")) {
      await this.startGame();
    } else if (msg.t === "answer" && this.meta.phase === "playing" && !this.answers[id]) {
      this.answers[id] = msg.fields || {};
      await this.state.storage.put("answers", this.answers);
      this.broadcastPlayers();
      await this.maybeEndRound();
    }
  }

  async webSocketClose(ws) {
    const id = (ws.deserializeAttachment() || {}).id;
    if (id === this.meta.hostId) {
      const other = this.connectedPlayers().find((p) => p.id !== id);
      this.meta.hostId = other ? other.id : null;
      await this.state.storage.put("meta", this.meta);
      if (other) other.ws.send(JSON.stringify({ t: "host" }));
    }
    this.broadcastPlayers();
    await this.maybeEndRound();
  }

  async webSocketError(ws) { await this.webSocketClose(ws); }

  // — boucle de jeu —
  async startGame() {
    await this.ensureData();
    let pool = this.settings.includeEd ? this.data : this.data.filter((o) => o.type === "OP");
    if (this.settings.difficulty !== "toutes") pool = pool.filter((o) => o.difficulty === this.settings.difficulty);
    this.deck = shuffle(pool).slice(0, Math.min(this.settings.rounds, pool.length));
    for (const p of this.connectedPlayers()) this.scores[p.id] = 0;
    await this.state.storage.put("deck", this.deck);
    await this.state.storage.put("scores", this.scores);
    this.meta.roundIndex = -1;
    this.meta.phase = "playing";
    await this.nextRound();
  }

  roundMessage() {
    const c = this.currentOpening();
    return {
      t: "round", index: this.meta.roundIndex, total: this.deck.length,
      audio: c.audio, clipLen: this.settings.clipLen, roundTime: this.settings.roundTime, endsAt: this.meta.roundEndsAt
    };
  }

  async nextRound() {
    this.meta.roundIndex++;
    if (this.meta.roundIndex >= this.deck.length) return this.endGame();
    this.answers = {};
    this.meta.phase = "playing";
    this.meta.roundEndsAt = Date.now() + this.settings.roundTime * 1000;
    this.meta.pending = "endRound";
    await this.state.storage.put("answers", this.answers);
    await this.state.storage.put("meta", this.meta);
    await this.state.storage.setAlarm(this.meta.roundEndsAt);
    this.broadcast(this.roundMessage());
    this.broadcastPlayers();
  }

  async maybeEndRound() {
    if (this.meta.phase !== "playing") return;
    const players = this.connectedPlayers();
    if (players.length > 0 && players.every((p) => this.answers[p.id])) await this.endRound();
  }

  async endRound() {
    if (this.meta.phase !== "playing") return;
    const cur = this.currentOpening();
    const results = [];
    for (const p of this.connectedPlayers()) {
      const { gained, breakdown } = scoreFiche(this.answers[p.id], cur);
      this.scores[p.id] = (this.scores[p.id] || 0) + gained;
      results.push({ id: p.id, name: p.name, gained, breakdown, submitted: !!this.answers[p.id] });
    }
    await this.state.storage.put("scores", this.scores);
    this.meta.phase = "reveal";
    this.meta.pending = "nextRound";
    await this.state.storage.put("meta", this.meta);
    await this.state.storage.setAlarm(Date.now() + REVEAL_MS);
    this.broadcast({
      t: "reveal",
      answer: { title: cur.title, type: cur.type, seq: cur.seq, song: cur.song, artist: cur.artist, year: cur.year, cover: cur.cover },
      results, scores: this.scoreboard(), last: this.meta.roundIndex + 1 >= this.deck.length
    });
  }

  async endGame() {
    this.meta.phase = "ended";
    this.meta.pending = null;
    await this.state.storage.put("meta", this.meta);
    await this.state.storage.deleteAlarm();
    this.broadcast({ t: "end", scores: this.scoreboard() });
  }

  async alarm() {
    if (this.meta.pending === "endRound") await this.endRound();
    else if (this.meta.pending === "nextRound") await this.nextRound();
  }

  // — utilitaires —
  scoreboard() {
    return this.connectedPlayers()
      .map((p) => ({ id: p.id, name: p.name, score: this.scores[p.id] || 0 }))
      .sort((a, b) => b.score - a.score);
  }

  broadcastPlayers() {
    const players = this.connectedPlayers().map((p) => ({
      id: p.id, name: p.name, score: this.scores[p.id] || 0, submitted: !!this.answers[p.id], host: p.id === this.meta.hostId
    }));
    this.broadcast({ t: "players", players });
  }

  broadcast(obj) {
    const data = JSON.stringify(obj);
    for (const ws of this.state.getWebSockets()) { try { ws.send(data); } catch {} }
  }
}

// ————————————————————————————— Validation (miroir du client) —————————————————————————————

const FICHE_POINTS = { anime: 2, type: 1, seq: 1, song: 3, artist: 2, year: 1 };

function scoreFiche(a, cur) {
  a = a || {};
  const checks = [
    ["anime", FICHE_POINTS.anime, matchAnswer(a.anime, cur.title, { aliases: cur.aliases })],
    ["type", FICHE_POINTS.type, (a.type || "") === cur.type],
    ["seq", FICHE_POINTS.seq, Number(a.num) === cur.seq],
    ["song", FICHE_POINTS.song, matchAnswer(a.song, cur.song, {})]
  ];
  if (cur.artist) checks.push(["artist", FICHE_POINTS.artist, matchAnswer(a.artist, cur.artist, {})]);
  checks.push(["year", FICHE_POINTS.year, matchAnswer(a.year, String(cur.year), { exact: true })]);

  let gained = 0;
  const breakdown = {};
  for (const [k, pts, ok] of checks) { if (ok) gained += pts; breakdown[k] = { ok, pts }; }
  return { gained, breakdown };
}

function norm(s) {
  const nfd = (s || "").toLowerCase().normalize("NFD");
  let out = "";
  for (const c of nfd) {
    const code = c.charCodeAt(0);
    if (code < 0x300 || code > 0x36f) out += c;
  }
  return out.replace(/\b(the|le|la|les|l|un|une|des|of|no)\b/g, " ").replace(/[^a-z0-9]+/g, "");
}

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
        cur[j] = Math.min(cur[j], prev2[j - 2] + 1);
      }
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

function fuzzyTol(len) {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 11) return 2;
  return 3;
}

function isCloseEnough(g, a) {
  if (!a) return false;
  if (a === g) return true;
  if (g.length >= 4 && a.length >= 4 && (a.includes(g) || g.includes(a))) return true;
  return editDistance(g, a) <= fuzzyTol(a.length);
}

function matchAnswer(guess, answer, opt) {
  const g = norm(guess);
  if (!g) return false;
  if (opt && opt.exact) return g === norm(answer);
  const candidates = [answer, ...((opt && opt.aliases) || [])].map(norm).filter(Boolean);
  return candidates.some((a) => isCloseEnough(g, a));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sanitizeSettings(s) {
  s = s || {};
  const out = {};
  const rounds = Number(s.rounds);
  if (rounds >= 1 && rounds <= 20) out.rounds = Math.floor(rounds);
  if (["toutes", "facile", "moyen"].includes(s.difficulty)) out.difficulty = s.difficulty;
  if (typeof s.includeEd === "boolean") out.includeEd = s.includeEd;
  if (s.clipLen === "full" || [1, 5, 10, 20].includes(Number(s.clipLen))) {
    out.clipLen = s.clipLen === "full" ? "full" : Number(s.clipLen);
  }
  const rt = Number(s.roundTime);
  if (rt >= 15 && rt <= 180) out.roundTime = Math.floor(rt);
  return out;
}

// Alias de titres (miroir de aliases.js) pour la validation serveur du mode Fiche.
const ALIASES = {
  "shingeki-no-kyojin": ["Attack on Titan", "Shingeki no Kyojin", "AoT", "SnK"],
  "fullmetal-alchemist-brotherhood": ["Fullmetal Alchemist", "FMAB", "FMA Brotherhood", "Hagane no Renkinjutsushi"],
  "kimetsu-no-yaiba": ["Kimetsu no Yaiba"],
  "boku-no-hero-academia": ["Boku no Hero Academia", "MHA", "BNHA"],
  "jujutsu-kaisen": ["JJK"],
  "neon-genesis-evangelion": ["Evangelion", "NGE"],
  "sword-art-online": ["SAO"],
  "one-punch-man": ["OPM"],
  "spy-x-family": ["Spy Family"],
  "mob-psycho-100": ["Mob Psycho"],
  "dragon-ball-z": ["DBZ"],
  "hunter-x-hunter-2011": ["HxH", "Hunter Hunter"],
  "haikyuu": ["Haikyuu", "Les As du Volley"],
  "naruto-shippuuden": ["Naruto Shippuuden"],
  "code-geass-hangyaku-no-lelouch": ["Code Geass", "Hangyaku no Lelouch", "Lelouch of the Rebellion"],
  "tengen-toppa-gurren-lagann": ["Gurren Lagann", "TTGL"],
  "kono-subarashii-sekai-ni-shukufuku-wo": ["Konosuba", "Kono Subarashii Sekai ni Shukufuku wo"],
  "rezero-kara-hajimeru-isekai-seikatsu": ["Re Zero", "Rezero", "Re Zero kara Hajimeru Isekai Seikatsu"],
  "kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen": ["Kaguya-sama", "Kaguya sama Love is War", "Kaguya"],
  "yakusoku-no-neverland": ["The Promised Neverland", "Yakusoku no Neverland", "TPN"],
  "shigatsu-wa-kimi-no-uso": ["Your Lie in April", "Shigatsu wa Kimi no Uso"],
  "enen-no-shouboutai": ["Fire Force", "Enen no Shouboutai"],
  "boku-dake-ga-inai-machi": ["Erased", "Boku dake ga Inai Machi"],
  "no-game-no-life": ["NGNL"],
  "dr-stone": ["Doctor Stone"],
  "k-on": ["Keion", "K On"],
  "bocchi-the-rock": ["Bocchi"],
  "sousou-no-frieren": ["Sousou no Frieren", "Frieren Beyond Journey's End"],
  "ore-dake-level-up-na-ken": ["Solo Leveling", "Ore dake Level Up na Ken"],
  "nanatsu-no-taizai": ["Seven Deadly Sins", "Nanatsu no Taizai"],
  "jojo-no-kimyou-na-bouken": ["JoJo", "JoJo no Kimyou na Bouken", "Bizarre Adventure"],
  "kusuriya-no-hitorigoto": ["The Apothecary Diaries", "Kusuriya no Hitorigoto"],
  "tensei-shitara-slime-datta-ken": ["Slime", "That Time I Got Reincarnated as a Slime", "Tensei Shitara Slime Datta Ken"],
  "tate-no-yuusha-no-nariagari": ["Shield Hero", "The Rising of the Shield Hero", "Tate no Yuusha"],
  "kiseijuu-sei-no-kakuritsu": ["Parasyte", "Kiseijuu"],
  "ousama-ranking": ["Ranking of Kings", "Ousama Ranking"],
  "fumetsu-no-anata-e": ["To Your Eternity", "Fumetsu no Anata e"],
  "gotoubun-no-hanayome": ["The Quintessential Quintuplets", "Gotoubun no Hanayome"],
  "kanojo-okarishimasu": ["Rent a Girlfriend", "Kanojo Okarishimasu"],
  "mushoku-tensei-isekai-ittara-honki-dasu": ["Mushoku Tensei", "Jobless Reincarnation"],
  "bishoujo-senshi-sailor-moon": ["Sailor Moon", "Bishoujo Senshi Sailor Moon"],
  "kuroshitsuji": ["Black Butler", "Kuroshitsuji"],
  "ao-no-exorcist": ["Blue Exorcist", "Ao no Exorcist"],
  "mahouka-koukou-no-rettousei": ["The Irregular at Magic High School", "Mahouka"],
  "mirai-nikki": ["Future Diary", "Mirai Nikki"],
  "ouran-koukou-host-club": ["Ouran High School Host Club", "Ouran"],
  "hataraku-saibou": ["Cells at Work", "Hataraku Saibou"],
  "jigokuraku": ["Hell's Paradise", "Jigokuraku"],
  "boruto-naruto-next-generations": ["Boruto"],
  "fullmetal-alchemist": ["Hagane no Renkinjutsushi", "FMA 2003"]
};
