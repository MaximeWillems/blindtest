# Anime Blind Test — PIKIlab

Blind test d'openings d'animés. Fait partie du lab **pikilab.app**.
Sous-domaine prévu : `blindtest.pikilab.app`.

Devine l'animé à partir de l'extrait audio de son opening, révèle la réponse
(jaquette + chanson + année), marque des points. 100 % statique, aucun build.

## État actuel

Prototype jouable — mode solo en QCM :

- `index.html` — 3 écrans : accueil (manches + difficulté), jeu, fin
- `style.css` — dark mode auto, responsive mobile, branding PIKI
- `data.js` — **banque de 23 openings** générée depuis l'API AnimeThemes.moe
- `app.js` — logique : tirage, timer, QCM 4 choix, bonus rapidité, révélation
- `.claude/launch.json` — serveur local de test (`python -m http.server`)
- `wrangler.jsonc` / `.assetsignore` — déploiement Cloudflare Pages/Workers

Déroulé d'une manche : on écoute l'extrait (**jaquette masquée**, pas de spoiler),
on choisit parmi 4 titres avant la fin du timer, puis la **jaquette + les infos**
sont révélées. Répondre vite = plus de points.

## Source des données — AnimeThemes.moe

Choix retenu : l'API publique **[AnimeThemes.moe](https://api-docs.animethemes.moe/)**
(gratuite, sans clé). On l'interroge **une seule fois** pour pré-générer `data.js` ;
l'app **ne rappelle jamais l'API au runtime** — elle lit la liste locale et streame
l'audio directement depuis le CDN `a.animethemes.moe` via une balise `<audio>`.
Donc zéro backend, zéro souci CORS.

Format d'une entrée (`data.js`) :

```js
{ id, title, audio, cover, year, song, artist, difficulty }
```

- `title` : bonne réponse (nom de l'animé) — `difficulty` : `facile` | `moyen`
- `audio` : extrait `.ogg` (OP complet ~90 s, on n'en joue qu'un bout)
- `cover` : jaquette (affichée à la révélation seulement)

### Regénérer / enrichir la banque

`data.js` est produit par une requête à `api.animethemes.moe/anime` filtrée sur une
liste de slugs d'animés, avec `include=animethemes.animethemeentries.videos.audio`
(audio), `animethemes.song.artists` (titre/artiste) et `images` (jaquette). Pour
ajouter des titres : compléter la liste de slugs et relancer la génération.

### Limite connue — Safari iOS

Les extraits AnimeThemes sont en `.ogg`, lus par Chrome/Edge/Firefox/Android mais
**pas par Safari iOS**. Sur iPhone, le son ne se lancera pas (le QCM reste jouable).
Correctif prévu : transcoder les extraits en `.m4a`/`.mp3` et les auto-héberger
(Cloudflare R2), ou passer par un petit Worker.

## Idées d'extension

- Mode « soirée » local : plusieurs joueurs, chacun son score (comme Undercover).
- Saisie libre au lieu du QCM (avec tolérance aux fautes).
- Filtres plus fins : décennie, genre ; extraits vidéo à la révélation.
- Durée d'écoute variable selon la difficulté ; écran de partage du score.

## Déploiement

Comme le hub : repo GitHub → Cloudflare Pages/Workers (preset None, build vide,
output `/`), puis Custom domain `blindtest.pikilab.app`.
