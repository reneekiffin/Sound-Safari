import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import SafariMap from './components/hub/SafariMap.jsx';
import TopBar from './components/shared/TopBar.jsx';
import Celebration from './components/shared/Celebration.jsx';
import ParentGate from './components/parent/ParentGate.jsx';
import ParentZone from './components/parent/ParentZone.jsx';
import LetterSounds from './components/games/LetterSounds.jsx';
import SoundBlending from './components/games/SoundBlending.jsx';
import RhymeTime from './components/games/RhymeTime.jsx';
import Syllables from './components/games/Syllables.jsx';
import Opposites from './components/games/Opposites.jsx';
import Similarities from './components/games/Similarities.jsx';
import Sentences from './components/games/Sentences.jsx';
import OddOneOut from './components/games/OddOneOut.jsx';
import VennDiagrams from './components/games/VennDiagrams.jsx';
import WordBuilders from './components/games/WordBuilders.jsx';
import Homophones from './components/games/Homophones.jsx';
import Spanish from './components/games/Spanish.jsx';
import { useProgress } from './hooks/useProgress.js';
import { useSpeech } from './hooks/useSpeech.js';
import { useAudio } from './hooks/useAudio.js';
import { useBackgroundMusic } from './hooks/useBackgroundMusic.js';
import { getGame } from './data/games.js';

const VIEW_HUB = 'hub';
const VIEW_GAME = 'game';

const GAME_COMPONENTS = {
  'letter-sounds': LetterSounds,
  syllables: Syllables,
  'sound-blending': SoundBlending,
  'rhyme-time': RhymeTime,
  opposites: Opposites,
  similarities: Similarities,
  sentences: Sentences,
  'odd-one-out': OddOneOut,
  'venn-diagrams': VennDiagrams,
  'word-builders': WordBuilders,
  homophones: Homophones,
  spanish: Spanish,
};

function nextMilestone(stars) {
  return Math.floor(stars / 5) * 5;
}

export default function App() {
  const {
    state,
    recordGameSession,
    updateSettings,
    setProfile,
    markCelebrated,
    resetProgress,
    getRecentFor,
  } = useProgress();

  // A single monotonically-increasing session key.  It's part of the game
  // component's React key, so bumping it on "Play Again" forces a fresh
  // mount — no more blank screens.
  const [sessionKey, setSessionKey] = useState(1);
  const [view, setView] = useState({ name: VIEW_HUB });
  const [gateOpen, setGateOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [endScreen, setEndScreen] = useState(null);
  const [milestone, setMilestone] = useState(null);

  // Speech always routes: clip → /api/tts (Edge TTS) → Web Speech.
  // No keys to configure, no provider choice in the UI.
  const { speak, voices, cancel: cancelSpeech } = useSpeech({
    enabled: state.settings.audioEnabled,
    preferredVoiceURI: state.settings.voiceURI,
  });
  const { play } = useAudio({ enabled: state.settings.sfxEnabled });
  useBackgroundMusic({ enabled: state.settings.bgmEnabled });

  useEffect(() => {
    const m = nextMilestone(state.stars);
    if (m > 0 && m > state.lastCelebratedStarMilestone && !endScreen) {
      setMilestone(m);
      play('celebrate');
      // Leo is the hype voice — milestone celebrations layer his voice
      // over whatever game the kid was just in.
      speak(`Wow, ${m} stars! You are a phonics explorer!`, { speaker: 'lion' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stars]);

  const handleSelectGame = useCallback(
    (gameId) => {
      play('tap');
      // Cut any in-progress speech (e.g. the on-hover greeting that's
      // still playing).  Without this, the greeting and the game's
      // first prompt overlap and the kid hears garbled audio.
      cancelSpeech();
      setSessionKey((k) => k + 1); // fresh mount every time a game is entered
      setView({ name: VIEW_GAME, gameId });
    },
    [play, cancelSpeech],
  );

  const handleHoverGame = useCallback(
    (game) => {
      if (state.settings.audioEnabled) {
        // Route the greeting through the host's ElevenLabs voice rather
        // than browser TTS — `game.animal` is the speaker key the
        // voice-config map uses ('lion', 'elephant', etc.).
        speak(game.host.greeting, { speaker: game.animal });
      }
    },
    [speak, state.settings.audioEnabled],
  );

  const handleExitGame = useCallback(() => {
    setView({ name: VIEW_HUB });
  }, []);

  const handleFinishGame = useCallback(
    ({ earnedStars, score, total, newRecent }) => {
      const gameId = view.gameId;
      recordGameSession(gameId, { earnedStars, score, newRecent });
      setEndScreen({ gameId, score, total, earnedStars });
    },
    [recordGameSession, view.gameId],
  );

  // Speak the end-of-game score in the host's own voice once the end
  // screen appears.  The game component unmounts the moment finish()
  // runs (its `done` flag flips and the JSX returns null), which kills
  // any in-flight speech kicked off from inside the game.  Doing it
  // here keeps the speaker correct and the audio playable.
  useEffect(() => {
    if (!endScreen) return;
    const g = getGame(endScreen.gameId);
    const speaker = g?.animal;
    if (!speaker) return;
    speak(
      `You got ${endScreen.score} out of ${endScreen.total}!`,
      { speaker },
    );
  }, [endScreen, speak]);

  // Fix for the "Play Again" blank screen:
  //   Just bumping the sessionKey wasn't enough — AnimatePresence
  //   (mode="wait") was holding the new mount behind the old game's
  //   exit animation while the old game still rendered null (done=true),
  //   leaving a blank frame that didn't recover for some users.  We
  //   now bounce through the hub for one tick: the game tree fully
  //   unmounts, then mounts fresh on the next tick with a new key.
  const handleReplay = () => {
    const nextGameId = endScreen?.gameId;
    setEndScreen(null);
    if (nextGameId) {
      setView({ name: VIEW_HUB });
      setTimeout(() => {
        setSessionKey((k) => k + 1);
        setView({ name: VIEW_GAME, gameId: nextGameId });
      }, 0);
    }
  };

  const handleBackToMap = () => {
    setEndScreen(null);
    setView({ name: VIEW_HUB });
  };

  const dismissMilestone = () => {
    markCelebrated(milestone);
    setMilestone(null);
  };

  const makeGameProps = (gameId) => ({
    profile: { childName: state.childName, avatar: state.avatar },
    totalStars: state.stars,
    difficulty: state.settings.difficulty,
    recent: getRecentFor(gameId),
    onExit: handleExitGame,
    onFinish: handleFinishGame,
    onOpenSettings: () => setGateOpen(true),
    audioEnabled: state.settings.audioEnabled,
    sfxEnabled: state.settings.sfxEnabled,
    voiceURI: state.settings.voiceURI,
  });

  const ActiveGame = view.name === VIEW_GAME ? GAME_COMPONENTS[view.gameId] : null;

  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col">
      <AnimatePresence mode="wait">
        {view.name === VIEW_HUB && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col"
          >
            <TopBar
              profile={{ childName: state.childName, avatar: state.avatar }}
              stars={state.stars}
              onOpenSettings={() => setGateOpen(true)}
            />
            <SafariMap
              progress={state}
              level={state.settings.level}
              onChangeLevel={(level) => updateSettings({ level })}
              onSelectGame={handleSelectGame}
              onHoverGame={handleHoverGame}
            />
          </motion.div>
        )}

        {view.name === VIEW_GAME && ActiveGame && (
          <motion.div
            // The sessionKey in the key is the crucial bit for "Play Again"
            // — when the key changes React remounts the whole tree cleanly.
            key={`${view.gameId}-${sessionKey}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex flex-1 flex-col"
          >
            <ActiveGame {...makeGameProps(view.gameId)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Celebration
        show={!!endScreen}
        emoji={endScreen ? endGameEmoji(endScreen.gameId) : '🎉'}
        title={endScreen ? `You earned ${endScreen.earnedStars} ⭐` : ''}
        subtitle={
          endScreen
            ? `You got ${endScreen.score} out of ${endScreen.total} right!`
            : ''
        }
        onContinue={handleBackToMap}
        onReplay={handleReplay}
        continueLabel="Back to the map"
        replayLabel="Play again"
      />

      <Celebration
        show={!!milestone && !endScreen}
        emoji="🌟"
        title={`${milestone} stars!`}
        subtitle="The whole jungle is cheering for you."
        onContinue={dismissMilestone}
        continueLabel="Keep exploring"
      />

      <ParentGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onPass={() => {
          setGateOpen(false);
          setZoneOpen(true);
        }}
      />
      <ParentZone
        open={zoneOpen}
        onClose={() => setZoneOpen(false)}
        state={state}
        voices={voices}
        onUpdateSettings={updateSettings}
        onSetProfile={setProfile}
        onReset={resetProgress}
      />
    </div>
  );
}

function endGameEmoji(gameId) {
  const game = getGame(gameId);
  const map = {
    lion: '🦁',
    monkey: '🐒',
    parrot: '🦜',
    elephant: '🐘',
    toucan: '🐦',
    frog: '🐸',
    giraffe: '🦒',
    zebra: '🦓',
    owl: '🦉',
    panda: '🐼',
    squirrel: '🐿️',
    sloth: '🦥',
  };
  return map[game?.animal] ?? '🎉';
}
