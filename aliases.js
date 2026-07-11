// Alias de titres pour la saisie libre (mode Fiche) : versions FR / anglais /
// japonais (romaji) et abréviations courantes. On n'ajoute que des formes
// ACCEPTÉES en plus du titre affiché — ça n'enlève jamais rien.
// Séparé de data.js (généré depuis l'API) : ces alias sont éditoriaux, à la main.
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
  "bocchi-the-rock": ["Bocchi"]
};

// Rattache les alias à chaque opening (utilisé par le matching du mode Fiche)
if (typeof OPENINGS !== "undefined") {
  OPENINGS.forEach((o) => { o.aliases = ALIASES[o.id] || []; });
}
