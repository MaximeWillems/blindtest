# Anime Blind Test — PIKIlab

Blind test d'openings d'animés. Fait partie du lab **pikilab.app**.
Sous-domaine prévu : `blindtest.pikilab.app`.

Devine l'animé à partir de l'extrait audio de son opening, révèle la réponse
(jaquette + chanson + année), marque des points. 100 % statique, aucun build.

## État actuel

Prototype jouable — 3 modes solo (choisis sur l'accueil) :

- **Classique** — QCM 4 propositions, bonus de rapidité
- **Fiche complète** — saisir un max d'infos (animé, opening, artiste, année), 1 pt / info
- **Éclair** — deviner l'animé en **saisie libre** sur **1 seconde** d'extrait (démarrée dans le morceau, pas sur l'intro)
- **Chanson complète** — opening entier, **sans pause ni chrono** ; saisie libre du nom de l'animé, on révèle quand on est prêt (score forfaitaire)
- **En ligne** — écrans « salon » (créer / rejoindre) en place ; réseau à brancher (voir plus bas)

Fichiers :

- `index.html` — 3 écrans : accueil (mode + manches + difficulté), jeu, fin
- `style.css` — dark mode auto, responsive mobile, branding PIKI
- `data.js` — **banque de 53 openings** générée depuis l'API AnimeThemes.moe
- `aliases.js` — alias de titres (FR/anglais/japonais) pour la saisie du mode Fiche
- `app.js` — système de modes : tirage, timer, saisie/QCM, scoring, révélation
- `.claude/launch.json` — serveur local de test (`python -m http.server`)
- `wrangler.jsonc` / `.assetsignore` — déploiement Cloudflare Pages/Workers

Déroulé d'une manche : on écoute l'extrait (**jaquette masquée**, pas de spoiler),
on répond avant la fin du timer, puis la **jaquette + les infos** sont révélées.
Le bouton lecture fait aussi **pause** (fige le chrono), et une barre de volume est à côté.

> Mode Fiche — tolérance de la saisie : ignore casse / accents / articles,
> accepte les titres partiels, pardonne les petites fautes de frappe (distance
> d'édition Damerau, y compris l'inversion de 2 lettres), et reconnaît chaque
> animé en **FR / anglais / japonais** + abréviations (alias dans `aliases.js`,
> ex. « Attack on Titan » = « L'Attaque des Titans » = « Shingeki no Kyojin »).

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

## Mode en ligne — où on en est

L'**UI est en place** (`online.js` + écrans lobby/salon dans `index.html`) : créer un
salon avec un code, rejoindre avec un code, liste des joueurs, réglages hôte, lancer.
Pour l'instant c'est un **aperçu local** — bannière « réseau non branché ». Le
lancement réutilise le moteur de jeu solo, les scores ne sont pas encore synchronisés.

Le câblage réseau passe par l'objet **`Net`** (dans `online.js`), aujourd'hui stubbé
avec des `TODO`. Reste à choisir la techno (décision en attente) :

1. **Salon temps réel** — Cloudflare Worker + Durable Objects (vrai multijoueur live).
2. **Défi du jour** — mêmes openings pour tous chaque jour, partage de score (quasi-statique, gratuit).
3. **Salon P2P** — WebRTC, sans serveur à héberger (plus fragile).

## Idées d'extension

- Mode « soirée » local : plusieurs joueurs, chacun son score (comme Undercover).
- Saisie libre au lieu du QCM (avec tolérance aux fautes).
- Filtres plus fins : décennie, genre ; extraits vidéo à la révélation.
- Durée d'écoute variable selon la difficulté ; écran de partage du score.

## Déploiement

Comme le hub : repo GitHub → Cloudflare Pages/Workers (preset None, build vide,
output `/`), puis Custom domain `blindtest.pikilab.app`.
