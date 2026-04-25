import { useCallback, useEffect, useState } from 'react';
import { GAMES } from '../data/games.js';

const STORAGE_KEY = 'sound-safari:v1';

// Default per-game record — stars, sessions completed, best single-session
// score, and a rolling "recently seen round IDs" window used by the
// session picker so every replay serves fresh content.
function defaultGameRecord() {
  return { stars: 0, completed: 0, bestScore: 0, recent: [] };
}

const DEFAULT_STATE = {
  childName: 'Explorer',
  avatar: '🦁',
  stars: 0,
  lastCelebratedStarMilestone: 0,
  settings: {
    audioEnabled: true,
    sfxEnabled: true,
    // Soft ambient music synthesised in the browser via Web Audio.
    // Default off so kids land in a quiet UI; parents can flip it on
    // from the Voice/Audio section in the Parent Zone.
    bgmEnabled: false,
    difficulty: 'easy', // 'easy' | 'medium' | 'hard'
    level: 'growing', // 'little' | 'growing' | 'brave' | 'big' | 'all'
    // Web Speech voice for fallback only — when the cloud proxy is
    // unreachable or the speaker isn't in the voice config.
    voiceURI: null,
  },
  games: Object.fromEntries(GAMES.map((g) => [g.id, defaultGameRecord()])),
};

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
      games: mergeGames(parsed.games ?? {}),
    };
  } catch (err) {
    console.warn('Failed to read progress state', err);
    return DEFAULT_STATE;
  }
}

// Ensure every known game has a record — important because new games added
// in later versions shouldn't crash old saved state.
function mergeGames(saved) {
  const merged = {};
  for (const g of GAMES) {
    merged[g.id] = { ...defaultGameRecord(), ...(saved[g.id] ?? {}) };
  }
  return merged;
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

  const recordGameSession = useCallback(
    (gameId, { earnedStars, score, newRecent }) => {
      setState((prev) => {
        const game = prev.games[gameId] ?? defaultGameRecord();
        const nextGame = {
          stars: game.stars + earnedStars,
          completed: game.completed + 1,
          bestScore: Math.max(game.bestScore ?? 0, score ?? 0),
          recent: Array.isArray(newRecent) ? newRecent : game.recent ?? [],
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

  // Direct access to a game's "recently seen" list — used by session
  // pickers so they skip content the kid just saw.
  const getRecentFor = useCallback(
    (gameId) => state.games[gameId]?.recent ?? [],
    [state.games],
  );

  return {
    state,
    recordGameSession,
    updateSettings,
    setProfile,
    markCelebrated,
    resetProgress,
    getRecentFor,
  };
}
