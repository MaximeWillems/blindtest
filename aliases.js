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

// Rattache les alias à chaque opening/ending (clé = anime, pas l'id unique)
if (typeof OPENINGS !== "undefined") {
  OPENINGS.forEach((o) => { o.aliases = ALIASES[o.anime] || []; });
}
