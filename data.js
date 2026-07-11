// Banque d'openings — générée depuis l'API AnimeThemes.moe (extraits OP1).
// URL audio (.ogg) et jaquettes vérifiées. L'app ne rappelle PAS l'API au runtime.
// Alias de titres (FR/anglais/japonais) pour le mode Fiche : voir aliases.js.
// Pour enrichir : ajouter des slugs à la requête et régénérer (voir README).
//   .ogg lu par Chrome/Edge/Firefox/Android — PAS Safari iOS (à transcoder plus tard).
const OPENINGS = [
    {
        "id":  "angel-beats",
        "title":  "Angel Beats!",
        "audio":  "https://a.animethemes.moe/AngelBeats-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/87jrHcYYj2dhrR5ToxgXhOFif0F54jq9BPfKleeF.png",
        "year":  2010,
        "song":  "My Soul, Your Beats!",
        "artist":  "Lia",
        "difficulty":  "moyen"
    },
    {
        "id":  "bleach",
        "title":  "Bleach",
        "audio":  "https://a.animethemes.moe/Bleach-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZDNvEtoikjQ2NkyCzPmB3xQQvPrQnYbAUiLgmxh8.png",
        "year":  2004,
        "song":  "*~Asterisk",
        "artist":  "Orange Range",
        "difficulty":  "facile"
    },
    {
        "id":  "blue-lock",
        "title":  "Blue Lock",
        "audio":  "https://a.animethemes.moe/BlueLock-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/d0NXitZGNpjhAqCxuuv9L5CqqFmhWzYFjiGtbrFo.png",
        "year":  2022,
        "song":  "Chaos ga Kiwamaru",
        "artist":  "UNISON SQUARE GARDEN",
        "difficulty":  "facile"
    },
    {
        "id":  "bocchi-the-rock",
        "title":  "Bocchi the Rock!",
        "audio":  "https://a.animethemes.moe/BocchiTheRock-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/YpJswECL8eyNiPJIMyBDbzencxzgy1JlgwgLU7xH.png",
        "year":  2022,
        "song":  "Seishun Complex",
        "artist":  "Kessoku Band",
        "difficulty":  "moyen"
    },
    {
        "id":  "chainsaw-man",
        "title":  "Chainsaw Man",
        "audio":  "https://a.animethemes.moe/ChainsawMan-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/I56a7g5t4kDpD2lIh8GeavpQbT7GxTXbcbjOSoDb.png",
        "year":  2022,
        "song":  "KICK BACK",
        "artist":  "Kenshi Yonezu",
        "difficulty":  "facile"
    },
    {
        "id":  "clannad",
        "title":  "Clannad",
        "audio":  "https://a.animethemes.moe/Clannad-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/oMt4DlUns5cbdpY6jWlT68o6NYdFQODxM1FblIoj.png",
        "year":  2007,
        "song":  "Megumeru ~cuckool mix 2007~",
        "artist":  "eufonius",
        "difficulty":  "moyen"
    },
    {
        "id":  "code-geass-hangyaku-no-lelouch",
        "title":  "Code Geass",
        "audio":  "https://a.animethemes.moe/CodeGeass-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/MGOwHWrW2K44gRVm50qInmfPj3h15XssXf1OCXHz.jpg",
        "year":  2006,
        "song":  "COLORS",
        "artist":  "FLOW",
        "difficulty":  "moyen"
    },
    {
        "id":  "cowboy-bebop",
        "title":  "Cowboy Bebop",
        "audio":  "https://a.animethemes.moe/CowboyBebop-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/SfXyZUYbg7jNilXUhnQWoQl5oF2nFufNtHJrCap4.png",
        "year":  1998,
        "song":  "Tank!",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "death-note",
        "title":  "Death Note",
        "audio":  "https://a.animethemes.moe/DeathNote-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/WrRVLWaCX8gDha9yjdEJLH2zpynxHKowG2gEXVaK.png",
        "year":  2006,
        "song":  "THE WORLD",
        "artist":  "Nightmare",
        "difficulty":  "facile"
    },
    {
        "id":  "kimetsu-no-yaiba",
        "title":  "Demon Slayer",
        "audio":  "https://a.animethemes.moe/KimetsuNoYaiba-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/2CTJVQ8P7jNnKzrQ6D0yoAidqeUXbnNE9q6UU6x9.jpg",
        "year":  2019,
        "song":  "Gurenge",
        "artist":  "LiSA",
        "difficulty":  "facile"
    },
    {
        "id":  "dr-stone",
        "title":  "Dr. Stone",
        "audio":  "https://a.animethemes.moe/DrStone-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/eogV8EZFVQMzsVYY10cnAEEP0i4GoUumj9ebiHCb.jpg",
        "year":  2019,
        "song":  "Good Morning World!",
        "artist":  "BURNOUT SYNDROMES",
        "difficulty":  "facile"
    },
    {
        "id":  "dragon-ball",
        "title":  "Dragon Ball",
        "audio":  "https://a.animethemes.moe/DragonBall-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/zj3n5YkMPBwTKuz4XVnrcrPE3k8ipZxpBJ4hAvUO.png",
        "year":  1986,
        "song":  "Makafushigi Adventure",
        "artist":  "",
        "difficulty":  "facile"
    },
    {
        "id":  "dragon-ball-z",
        "title":  "Dragon Ball Z",
        "audio":  "https://a.animethemes.moe/DragonBallZ-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mPaZWpIpdL683kNGU2KVQOqwSBvYn9MMn68pRK3Q.png",
        "year":  1989,
        "song":  "Cha-La Head-Cha-La",
        "artist":  "Hironobu Kageyama",
        "difficulty":  "facile"
    },
    {
        "id":  "boku-dake-ga-inai-machi",
        "title":  "Erased",
        "audio":  "https://a.animethemes.moe/BokuDakeGaInaiMachi-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qiHWDekjW2vRG23gigem3wqYweH7KU163gFbpnaV.jpg",
        "year":  2016,
        "song":  "Re:Re:",
        "artist":  "Asian Kung-Fu Generation",
        "difficulty":  "moyen"
    },
    {
        "id":  "fairy-tail",
        "title":  "Fairy Tail",
        "audio":  "https://a.animethemes.moe/FairyTail-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/3puVVrO22Td4dq1SFNCR1KbT6LWoaQxgUdaByDDG.png",
        "year":  2009,
        "song":  "Snow Fairy",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "fatezero",
        "title":  "Fate/Zero",
        "audio":  "https://a.animethemes.moe/FateZero-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ey5VnEXFMRS2veM8OstyuGnzSU22zlQyax6w0M44.png",
        "year":  2011,
        "song":  "oath sign",
        "artist":  "LiSA",
        "difficulty":  "moyen"
    },
    {
        "id":  "enen-no-shouboutai",
        "title":  "Fire Force",
        "audio":  "https://a.animethemes.moe/EnenNoShouboutai-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qQcEpzCFH64eRF39UEkNAWH0TOaDVcRyMPUmdRBX.jpg",
        "year":  2019,
        "song":  "Inferno",
        "artist":  "Mrs. GREEN APPLE",
        "difficulty":  "moyen"
    },
    {
        "id":  "fullmetal-alchemist-brotherhood",
        "title":  "Fullmetal Alchemist: Brotherhood",
        "audio":  "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
        "year":  2009,
        "song":  "again",
        "artist":  "Yui",
        "difficulty":  "moyen"
    },
    {
        "id":  "gintama",
        "title":  "Gintama",
        "audio":  "https://a.animethemes.moe/Gintama-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/3tY3OcsdO8ooGlMonGMZyZiIE2YMPErteAZ0c4hg.png",
        "year":  2006,
        "song":  "Pray",
        "artist":  "Tommy heavenly⁶",
        "difficulty":  "moyen"
    },
    {
        "id":  "tengen-toppa-gurren-lagann",
        "title":  "Gurren Lagann",
        "audio":  "https://a.animethemes.moe/TengenToppaGurrenLagann-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/zpM65yQigQTdbG1PIIWPPuMB4QBWUEPn9LobfVex.png",
        "year":  2007,
        "song":  "Sorairo Days",
        "artist":  "Shouko Nakagawa",
        "difficulty":  "moyen"
    },
    {
        "id":  "haikyuu",
        "title":  "Haikyu!!",
        "audio":  "https://a.animethemes.moe/Haikyuu-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/XcpppDG8n9WuWdCn6VBIT9zfVFNN2H6FSpE6c7Ls.png",
        "year":  2014,
        "song":  "Imagination",
        "artist":  "SPYAIR",
        "difficulty":  "moyen"
    },
    {
        "id":  "hunter-x-hunter-2011",
        "title":  "Hunter x Hunter",
        "audio":  "https://a.animethemes.moe/HunterHunter2011-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/dSjOXdxaSFxvgAwj2tF7nHvtAeoxAakXGJmr0Qy3.png",
        "year":  2011,
        "song":  "departure!",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "inuyasha",
        "title":  "Inuyasha",
        "audio":  "https://a.animethemes.moe/InuYasha-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/yBbBBW7B1hB1y4xU9txKsXtbEylj90STpYqPfqTT.png",
        "year":  2000,
        "song":  "Change the World",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "jujutsu-kaisen",
        "title":  "Jujutsu Kaisen",
        "audio":  "https://a.animethemes.moe/JujutsuKaisen-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ggrh8wGLhZcYLtZskZD4h41Xh7Wxt735rdzygtRw.jpg",
        "year":  2020,
        "song":  "Kaikai Kitan",
        "artist":  "Eve",
        "difficulty":  "facile"
    },
    {
        "id":  "kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen",
        "title":  "Kaguya-sama",
        "audio":  "https://a.animethemes.moe/KaguyaSamaWaKokurasetai-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IS2dVXrMZcjekzLwa1aR6eHafiZ3FY6SxA0BG28r.png",
        "year":  2019,
        "song":  "Love Dramatic feat. Rikka Ihara",
        "artist":  "Masayuki Suzuki",
        "difficulty":  "moyen"
    },
    {
        "id":  "k-on",
        "title":  "K-On!",
        "audio":  "https://a.animethemes.moe/KOn-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Ysrql602quYqqsFYOt3RT8Kt05Cu5QBybXIZ7Eo1.png",
        "year":  2009,
        "song":  "Cagayake! GIRLS",
        "artist":  "Aki Toyosaki, Youko Hikasa, Minako Kotobuki, Satomi Satou",
        "difficulty":  "moyen"
    },
    {
        "id":  "kono-subarashii-sekai-ni-shukufuku-wo",
        "title":  "Konosuba",
        "audio":  "https://a.animethemes.moe/Konosuba-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/WxQTetHRhCmxjoMLIkCwHcB7AHdH6EYAfuVE6qTU.png",
        "year":  2016,
        "song":  "fantastic dreamer",
        "artist":  "Machico",
        "difficulty":  "facile"
    },
    {
        "id":  "shingeki-no-kyojin",
        "title":  "L\u0027Attaque des Titans",
        "audio":  "https://a.animethemes.moe/ShingekiNoKyojin-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mLoIEyGITkJPGCBxvjTpDyDYRM8rDb4ZuFGCKEaH.png",
        "year":  2013,
        "song":  "Guren no Yumiya",
        "artist":  "Linked Horizon",
        "difficulty":  "facile"
    },
    {
        "id":  "made-in-abyss",
        "title":  "Made in Abyss",
        "audio":  "https://a.animethemes.moe/MadeInAbyss-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/tcUieRlZDpPew3c9t7qGEUiTFKNIFMKaKig8FgW8.jpg",
        "year":  2017,
        "song":  "Underground River",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "mob-psycho-100",
        "title":  "Mob Psycho 100",
        "audio":  "https://a.animethemes.moe/MobPsycho100-OP1-BD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/nY8fvsWBmeHWE0RFEJjjmrBHga024vFvA9O1padY.jpg",
        "year":  2016,
        "song":  "99",
        "artist":  "MOB CHOIR",
        "difficulty":  "moyen"
    },
    {
        "id":  "boku-no-hero-academia",
        "title":  "My Hero Academia",
        "audio":  "https://a.animethemes.moe/BokuNoHeroAcademia-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ddPmvU8eKAtzdm0Pxw93fXzjrtfeS7NarOMiTety.jpg",
        "year":  2016,
        "song":  "The Day",
        "artist":  "Porno Graffitti",
        "difficulty":  "facile"
    },
    {
        "id":  "naruto",
        "title":  "Naruto",
        "audio":  "https://a.animethemes.moe/Naruto-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
        "year":  2002,
        "song":  "R★O★C★K★S",
        "artist":  "",
        "difficulty":  "facile"
    },
    {
        "id":  "naruto-shippuuden",
        "title":  "Naruto Shippuden",
        "audio":  "https://a.animethemes.moe/NarutoShippuuden-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
        "year":  2007,
        "song":  "Hero\u0027s Come Back",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "neon-genesis-evangelion",
        "title":  "Neon Genesis Evangelion",
        "audio":  "https://a.animethemes.moe/NeonGenesisEvangelion-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/n9L9LIzW1n1hYNvR8IMuvnU6ZpJC4xKkzuvGi8Md.jpg",
        "year":  1995,
        "song":  "Zankoku na Tenshi no Thesis",
        "artist":  "Youko Takahashi",
        "difficulty":  "moyen"
    },
    {
        "id":  "nichijou",
        "title":  "Nichijou",
        "audio":  "https://a.animethemes.moe/Nichijou-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Bpq9Cwv9u3QfIIslkb6J2qXdB4ChAS8il6xKYHot.png",
        "year":  2011,
        "song":  "Hyadain no Kakakata☆Kataomoi - C",
        "artist":  "Hyadain",
        "difficulty":  "moyen"
    },
    {
        "id":  "no-game-no-life",
        "title":  "No Game No Life",
        "audio":  "https://a.animethemes.moe/NoGameNoLife-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/AN6drqBahLNTdWVrtMPjvsQ1x5TLq5JQ4xpfCShQ.jpg",
        "year":  2014,
        "song":  "This game",
        "artist":  "Konomi Suzuki",
        "difficulty":  "moyen"
    },
    {
        "id":  "noragami",
        "title":  "Noragami",
        "audio":  "https://a.animethemes.moe/Noragami-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/dijg7rt8OPBcmVLFaoAOtHaUv9p9JRXdmKuhcpmx.jpg",
        "year":  2014,
        "song":  "Goya no Machiawase",
        "artist":  "Hello Sleepwalkers",
        "difficulty":  "moyen"
    },
    {
        "id":  "one-piece",
        "title":  "One Piece",
        "audio":  "https://a.animethemes.moe/OnePiece-OP1-NCDVD480.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
        "year":  1999,
        "song":  "We Are!",
        "artist":  "Hiroshi Kitadani",
        "difficulty":  "facile"
    },
    {
        "id":  "one-punch-man",
        "title":  "One Punch Man",
        "audio":  "https://a.animethemes.moe/OnePunchMan-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZF8O9bo6HzfHdjT3wBPBLwHQgezVMYJtnl5k1NEO.png",
        "year":  2015,
        "song":  "THE HERO !! ~Okoreru Kobushi ni Hi wo Tsukero~",
        "artist":  "JAM Project",
        "difficulty":  "facile"
    },
    {
        "id":  "overlord",
        "title":  "Overlord",
        "audio":  "https://a.animethemes.moe/Overlord-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/fbPWhD9ewuWOwk4VfyoprTtKXUFbXhLzMFiBDlEB.jpg",
        "year":  2015,
        "song":  "Clattanoia",
        "artist":  "OxT",
        "difficulty":  "moyen"
    },
    {
        "id":  "rezero-kara-hajimeru-isekai-seikatsu",
        "title":  "Re:Zero",
        "audio":  "https://a.animethemes.moe/ReZero-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/bnwog76jnd3YG8RZFb6m3FEJkfKRXOJBJxB2LlYO.png",
        "year":  2016,
        "song":  "Redo",
        "artist":  "Konomi Suzuki",
        "difficulty":  "facile"
    },
    {
        "id":  "samurai-champloo",
        "title":  "Samurai Champloo",
        "audio":  "https://a.animethemes.moe/SamuraiChamploo-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/a4khw351hTizpWJKZCEUFlNpCdBdgZODIXDG2vXB.png",
        "year":  2004,
        "song":  "Battlecry",
        "artist":  "Shing02",
        "difficulty":  "moyen"
    },
    {
        "id":  "soul-eater",
        "title":  "Soul Eater",
        "audio":  "https://a.animethemes.moe/SoulEater-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gvLyGAA92WC6RsDCQZbUkGuzsjgKK4T6BX63H2Zx.png",
        "year":  2008,
        "song":  "Resonance",
        "artist":  "T.M.Revolution",
        "difficulty":  "moyen"
    },
    {
        "id":  "spy-x-family",
        "title":  "Spy x Family",
        "audio":  "https://a.animethemes.moe/SpyXFamily-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/s481umbdgWIWwMDPwzPgu1EZEvxKq4Zy2coxs255.png",
        "year":  2022,
        "song":  "Mixed Nuts",
        "artist":  "Official HIGE DANdism",
        "difficulty":  "facile"
    },
    {
        "id":  "steinsgate",
        "title":  "Steins;Gate",
        "audio":  "https://a.animethemes.moe/SteinsGate-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/F2y3VFbZpLc1q06wndCkRa02jmU8qQnhtNOAnDv0.jpg",
        "year":  2011,
        "song":  "Hacking to the Gate",
        "artist":  "Kanako Itou",
        "difficulty":  "moyen"
    },
    {
        "id":  "sword-art-online",
        "title":  "Sword Art Online",
        "audio":  "https://a.animethemes.moe/SwordArtOnline-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IYdmoTRiGhAdf7rVnBdz0Fb3O2YbblCtvSMxeRu1.jpg",
        "year":  2012,
        "song":  "crossing field",
        "artist":  "LiSA",
        "difficulty":  "facile"
    },
    {
        "id":  "yakusoku-no-neverland",
        "title":  "The Promised Neverland",
        "audio":  "https://a.animethemes.moe/YakusokuNoNeverland-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/8ndHIFcB9DHarQGtNgattT1fiiLza87ewxr3vSPm.jpg",
        "year":  2019,
        "song":  "Touch Off",
        "artist":  "UVERworld",
        "difficulty":  "moyen"
    },
    {
        "id":  "tokyo-ghoul",
        "title":  "Tokyo Ghoul",
        "audio":  "https://a.animethemes.moe/TokyoGhoul-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/lXVlVtsCoYd2kmM4QsbXWqd63eJu2rX6OXZkia0k.jpg",
        "year":  2014,
        "song":  "unravel",
        "artist":  "TK from Ling tosite sigure",
        "difficulty":  "facile"
    },
    {
        "id":  "toradora",
        "title":  "Toradora!",
        "audio":  "https://a.animethemes.moe/Toradora-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/01oxfXszVEMWQCoonOFGMbzp2gDshl72c5ZcrdLj.jpg",
        "year":  2008,
        "song":  "Pre-Parade",
        "artist":  "Eri Kitamura, Rie Kugimiya, Yui Horie",
        "difficulty":  "moyen"
    },
    {
        "id":  "trigun",
        "title":  "Trigun",
        "audio":  "https://a.animethemes.moe/Trigun-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qP1lL8pOMn7XJT2Tmi32g6IgrMlJ7rr4RYMO59hK.png",
        "year":  1998,
        "song":  "H.T.",
        "artist":  "",
        "difficulty":  "moyen"
    },
    {
        "id":  "vinland-saga",
        "title":  "Vinland Saga",
        "audio":  "https://a.animethemes.moe/VinlandSaga-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/oo9llPii2BWD2J2yaPmk1ceBEmfMIxz04zg9Qv8A.jpg",
        "year":  2019,
        "song":  "MUKANJYO",
        "artist":  "Survive Said The Prophet",
        "difficulty":  "moyen"
    },
    {
        "id":  "violet-evergarden",
        "title":  "Violet Evergarden",
        "audio":  "https://a.animethemes.moe/VioletEvergarden-OP1-NCBD1080.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/i2QOWRsy1E3fq4oHPzWHwMRwW77DBG55ocgB2r0x.png",
        "year":  2018,
        "song":  "Sincerely",
        "artist":  "TRUE",
        "difficulty":  "moyen"
    },
    {
        "id":  "shigatsu-wa-kimi-no-uso",
        "title":  "Your Lie in April",
        "audio":  "https://a.animethemes.moe/KimiUso-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IACYfE1FmR1HtjMfiKNWiSB0uwMChbaN4mxNL29i.png",
        "year":  2014,
        "song":  "Hikaru nara",
        "artist":  "Goose House",
        "difficulty":  "moyen"
    }
];
