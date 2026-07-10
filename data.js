// Banque d'openings — générée depuis l'API AnimeThemes.moe (extraits OP1).
// URL audio (.ogg) et jaquettes vérifiées (HTTP 206, hotlink OK).
// L'app ne rappelle PAS l'API au runtime : elle lit cette liste + streame l'audio
// depuis le CDN a.animethemes.moe. Pour enrichir : relancer la requête API et
// régénérer ce fichier (voir README).
//
// Champs : id, title (réponse), audio, cover (jaquette), year, song, artist, difficulty
//   .ogg lu par Chrome/Edge/Firefox/Android — PAS Safari iOS (à transcoder plus tard).
const OPENINGS = [
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
        "id":  "tokyo-ghoul",
        "title":  "Tokyo Ghoul",
        "audio":  "https://a.animethemes.moe/TokyoGhoul-OP1.ogg",
        "cover":  "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/lXVlVtsCoYd2kmM4QsbXWqd63eJu2rX6OXZkia0k.jpg",
        "year":  2014,
        "song":  "unravel",
        "artist":  "TK from Ling tosite sigure",
        "difficulty":  "facile"
    }
];
