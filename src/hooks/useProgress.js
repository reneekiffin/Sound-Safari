import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sound-safari:v1';

// The single, serialisable source of truth for the app's user state.
// Kept flat on purpose so it's easy to migrate later.
const DEFAULT_STATE = {
  childName: 'Explorer',
  avatar: '🦁',
  stars: 0,
  lastCelebratedStarMilestone: 0, // track when we last fired a "every 5 stars" celebration
  settings: {
    audioEnabled: true,
    sfxEnabled: true,
    difficulty: 'easy', // 'easy' | 'medium' | 'hard'
  },
  games: {
    'letter-sounds': { stars: 0, completed: 0, bestScore: 0 },
    'sound-blending': { stars: 0, completed: 0, bestScore: 0 },
    'rhyme-time': { stars: 0, completed: 0, bestScore: 0 },
  },
};

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Shallow-merge in case newer versions added fields.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
      games: { ...DEFAULT_STATE.games, ...(parsed.games ?? {}) },
    };
  } catch (err) {
    console.warn('Failed to read progress state', err);
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save progress state', err);
  }
}

export function useProgress() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Record a finished game session.  `earnedStars` is usually 1 per round
  // they got correct, capped at a sensible ceiling per game.  Total stars
  // accumulate across all games for the global celebration counter.
  const recordGameSession = useCallback(
    (gameId, { earnedStars, score }) => {
      setState((prev) => {
        const game = prev.games[gameId] ?? { stars: 0, completed: 0, bestScore: 0 };
        const nextGame = {
          stars: game.stars + earnedStars,
          completed: game.completed + 1,
          bestScore: Math.max(game.bestScore ?? 0, score ?? 0),
        };
        return {
          ...prev,
          stars: prev.stars + earnedStars,
          games: { ...prev.games, [gameId]: nextGame },
        };
      });
    },
    [],
  );

  const updateSettings = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const setProfile = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const markCelebrated = useCallback((milestone) => {
    setState((prev) => ({ ...prev, lastCelebratedStarMilestone: milestone }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    state,
    recordGameSession,
    updateSettings,
    setProfile,
    markCelebrated,
    resetProgress,
  };
}
