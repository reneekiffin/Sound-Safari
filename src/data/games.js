// Canonical game metadata for the Safari Map.
//
// Each entry carries enough info to render a hub card and kick off a
// session:
//   - id           route key + progress key
//   - host         animal friend who introduces the game
//   - animal       which inline SVG character to render on the hub
//   - level        which age band this game belongs to.  The hub and the
//                  parent zone filter games by the kid's level.  A game
//                  can belong to multiple levels if it genuinely spans a
//                  range.
//
// Levels:
//   'little'    ages 3-5  — letter sounds, basic syllables
//   'growing'   ages 5-7  — blending, rhyme, opposites, syllables
//   'brave'     ages 7-9  — rhyme hard, similarities, sentences
//   'big'       ages 9+   — sentence hard tier, advanced similarities
//
// To add a new game:
//   1. Push a new entry here.
//   2. Create data/<your-game>.js with difficulty tiers.
//   3. Create components/games/<YourGame>.jsx and wire into App.jsx.

export const LEVELS = [
  { id: 'little', label: 'Little Explorer', age: '3–5', accent: '#e8bd4a' },
  { id: 'growing', label: 'Growing Reader', age: '5–7', accent: '#679148' },
  { id: 'brave', label: 'Brave Adventurer', age: '7–9', accent: '#e24a3c' },
  { id: 'big', label: 'Big Explorer', age: '9+', accent: '#2aa29a' },
];

export const GAMES = [
  {
    id: 'letter-sounds',
    title: 'Letter Sounds',
    subtitle: 'Hear it, tap it!',
    ageRange: '3–5',
    levels: ['little', 'growing'],
    host: {
      name: 'Leo the Lion',
      greeting: "Rrroar! I'm Leo. Let's learn letter sounds!",
    },
    animal: 'lion',
    locationLabel: 'Golden Grasslands',
    accent: '#e8bd4a',
    bg: 'linear-gradient(160deg, #fdf9ec 0%, #f0d486 100%)',
  },
  {
    id: 'syllables',
    title: 'Syllable Stomp',
    subtitle: 'Count the beats in the word!',
    ageRange: '5–8',
    levels: ['little', 'growing', 'brave'],
    host: {
      name: 'Ellie the Elephant',
      greeting: "Hello! I'm Ellie. Let's stomp some syllables!",
    },
    animal: 'elephant',
    locationLabel: 'Baobab Glade',
    accent: '#679148',
    bg: 'linear-gradient(160deg, #eff5ea 0%, #c9d9aa 100%)',
  },
  {
    id: 'sound-blending',
    title: 'Sound Blending',
    subtitle: 'Smoosh the sounds together!',
    ageRange: '5–7',
    levels: ['growing', 'brave'],
    host: {
      name: 'Momo the Monkey',
      greeting: "Ooh-ooh! I'm Momo. Can you blend these sounds?",
    },
    animal: 'monkey',
    locationLabel: 'Canopy Treetops',
    accent: '#86b06e',
    bg: 'linear-gradient(160deg, #f7eac0 0%, #b0cd9f 100%)',
  },
  {
    id: 'rhyme-time',
    title: 'Rhyme Time',
    subtitle: 'Find the word that sounds the same!',
    ageRange: '6–9',
    levels: ['growing', 'brave'],
    host: {
      name: 'Polly the Parrot',
      greeting: "Squawk! I'm Polly. Let's find some rhyming pairs!",
    },
    animal: 'parrot',
    locationLabel: 'Rainbow Jungle',
    accent: '#e24a3c',
    bg: 'linear-gradient(160deg, #ffe1dd 0%, #f2994a 100%)',
  },
  {
    id: 'opposites',
    title: 'Opposites',
    subtitle: 'Tap the word that means the other thing!',
    ageRange: '5–8',
    levels: ['growing', 'brave'],
    host: {
      name: 'Toby the Toucan',
      greeting: "I'm Toby. Let's flip some words around!",
    },
    animal: 'toucan',
    locationLabel: 'Mango Ridge',
    accent: '#f2994a',
    bg: 'linear-gradient(160deg, #fff2df 0%, #f2c46a 100%)',
  },
  {
    id: 'similarities',
    title: 'Same-Same',
    subtitle: 'Find the word that matches!',
    ageRange: '6–9',
    levels: ['growing', 'brave', 'big'],
    host: {
      name: 'Finn the Frog',
      greeting: "Ribbit! I'm Finn. Which words go together?",
    },
    animal: 'frog',
    locationLabel: 'Lily-Pad Pond',
    accent: '#2aa29a',
    bg: 'linear-gradient(160deg, #e3f4ef 0%, #86c0b6 100%)',
  },
  {
    id: 'sentences',
    title: 'Sentence Safari',
    subtitle: 'Build sentences and read together!',
    ageRange: '7–10',
    levels: ['brave', 'big'],
    host: {
      name: 'Gigi the Giraffe',
      greeting: "Hi, I'm Gigi! Let's put some words in order.",
    },
    animal: 'giraffe',
    locationLabel: 'Acacia Treetops',
    accent: '#c45a26',
    bg: 'linear-gradient(160deg, #fdf0d8 0%, #e0a36a 100%)',
  },
  {
    id: 'odd-one-out',
    title: 'Odd One Out',
    subtitle: 'Which one does not belong?',
    ageRange: '3–6',
    levels: ['little', 'growing'],
    host: {
      name: 'Zara the Zebra',
      greeting: "Hi, I'm Zara! Can you spot the different one?",
    },
    animal: 'zebra',
    locationLabel: 'Striped Savanna',
    accent: '#3a2a1a',
    bg: 'linear-gradient(160deg, #f4ecdc 0%, #d7c9a8 100%)',
  },
  {
    id: 'venn-diagrams',
    title: 'Venn Venn!',
    subtitle: 'Put things in the right circle!',
    ageRange: '6–10',
    levels: ['growing', 'brave', 'big'],
    host: {
      name: 'Ollie the Owl',
      greeting: "Whooo! I'm Ollie. Let's sort things into circles!",
    },
    animal: 'owl',
    locationLabel: 'Wisdom Grove',
    accent: '#2aa29a',
    bg: 'linear-gradient(160deg, #e3f0fb 0%, #9fc5de 100%)',
  },
];

export const getGame = (id) => GAMES.find((g) => g.id === id);

export function gamesForLevel(levelId) {
  if (!levelId || levelId === 'all') return GAMES;
  return GAMES.filter((g) => g.levels.includes(levelId));
}
