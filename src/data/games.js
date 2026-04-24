// Canonical game metadata for the Safari Map.
// Add new entries here to surface new game locations on the hub.
export const GAMES = [
  {
    id: 'letter-sounds',
    title: 'Letter Sounds',
    subtitle: 'Hear it, tap it!',
    ageRange: '3-5',
    host: {
      name: 'Leo the Lion',
      color: 'savanna',
      greeting: "Rrroar! I'm Leo. Let's learn letter sounds!",
    },
    locationLabel: 'Golden Grasslands',
    accent: '#e8bd4a',
    bg: 'linear-gradient(160deg, #fdf9ec 0%, #f0d486 100%)',
    unlockedByDefault: true,
  },
  {
    id: 'sound-blending',
    title: 'Sound Blending',
    subtitle: 'Smoosh the sounds together!',
    ageRange: '5-7',
    host: {
      name: 'Momo the Monkey',
      color: 'sage',
      greeting: "Ooh-ooh! I'm Momo. Can you blend these sounds?",
    },
    locationLabel: 'Canopy Treetops',
    accent: '#679148',
    bg: 'linear-gradient(160deg, #eff5ea 0%, #b0cd9f 100%)',
    unlockedByDefault: true,
  },
  {
    id: 'rhyme-time',
    title: 'Rhyme Time',
    subtitle: 'Find the word that sounds the same!',
    ageRange: '7-9',
    host: {
      name: 'Polly the Parrot',
      color: 'parrot',
      greeting: "Squawk! I'm Polly. Let's find some rhyming pairs!",
    },
    locationLabel: 'Rainbow Jungle',
    accent: '#e24a3c',
    bg: 'linear-gradient(160deg, #ffe1dd 0%, #f2994a 100%)',
    unlockedByDefault: true,
  },
];

export const getGame = (id) => GAMES.find((g) => g.id === id);
