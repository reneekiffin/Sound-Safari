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
import { useProgress } from './hooks/useProgress.js';
import { useSpeech } from './hooks/useSpeech.js';
import { useAudio } from './hooks/useAudio.js';
import { getGame } from './data/games.js';

const VIEW_HUB = 'hub';
const VIEW_GAME = 'game';

// Every 5 stars earned (5, 10, 15, ...) we fire a big celebration screen.
function nextMilestone(stars) {
  return Math.floor(stars / 5) * 5;
}

export default function App() {
  const { state, recordGameSession, updateSettings, setProfile, markCelebrated, resetProgress } = useProgress();
  const [view, setView] = useState({ name: VIEW_HUB });
  const [gateOpen, setGateOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [endScreen, setEndScreen] = useState(null); // { gameId, score, total, earnedStars }
  const [milestone, setMilestone] = useState(null);

  const { speak } = useSpeech({ enabled: state.settings.audioEnabled });
  const { play } = useAudio({ enabled: state.settings.sfxEnabled });

  // Fire a "every 5 stars" celebration whenever crossing a new milestone.
  useEffect(() => {
    const m = nextMilestone(state.stars);
    if (m > 0 && m > state.lastCelebratedStarMilestone && !endScreen) {
      setMilestone(m);
      play('celebrate');
      speak(`Wow, ${m} stars! You are a phonics explorer!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stars]);

  const handleSelectGame = useCallback((gameId) => {
    play('tap');
    setView({ name: VIEW_GAME, gameId });
  }, [play]);

  const handleHoverGame = useCallback((game) => {
    if (state.settings.audioEnabled) {
      speak(game.host.greeting);
    }
  }, [speak, state.settings.audioEnabled]);

  const handleExitGame = useCallback(() => {
    setView({ name: VIEW_HUB });
  }, []);

  const handleFinishGame = useCallback(
    ({ earnedStars, score, total }) => {
      const gameId = view.gameId;
      recordGameSession(gameId, { earnedStars, score });
      setEndScreen({ gameId, score, total, earnedStars });
    },
    [recordGameSession, view.gameId],
  );

  const closeEndScreen = (playAgain = false) => {
    const nextGameId = endScreen?.gameId;
    setEndScreen(null);
    if (playAgain && nextGameId) {
      // Re-mount the game with a new session by bouncing through hub briefly.
      setView({ name: VIEW_HUB });
      setTimeout(() => setView({ name: VIEW_GAME, gameId: nextGameId }), 50);
    } else {
      setView({ name: VIEW_HUB });
    }
  };

  const dismissMilestone = () => {
    markCelebrated(milestone);
    setMilestone(null);
  };

  // Common props every game component wants.
  const gameProps = {
    profile: { childName: state.childName, avatar: state.avatar },
    totalStars: state.stars,
    difficulty: state.settings.difficulty,
    onExit: handleExitGame,
    onFinish: handleFinishGame,
    onOpenSettings: () => setGateOpen(true),
    audioEnabled: state.settings.audioEnabled,
    sfxEnabled: state.settings.sfxEnabled,
  };

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
              onSelectGame={handleSelectGame}
              onHoverGame={handleHoverGame}
            />
          </motion.div>
        )}

        {view.name === VIEW_GAME && view.gameId === 'letter-sounds' && (
          <motion.div
            key="letter-sounds"
            initial={{ opacity: 0, rotate: -2, y: 16 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex flex-1 flex-col"
          >
            <LetterSounds {...gameProps} />
          </motion.div>
        )}

        {view.name === VIEW_GAME && view.gameId === 'sound-blending' && (
          <motion.div
            key="sound-blending"
            initial={{ opacity: 0, rotate: 2, y: 16 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex flex-1 flex-col"
          >
            <SoundBlending {...gameProps} />
          </motion.div>
        )}

        {view.name === VIEW_GAME && view.gameId === 'rhyme-time' && (
          <motion.div
            key="rhyme-time"
            initial={{ opacity: 0, rotate: -1, y: 16 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex flex-1 flex-col"
          >
            <RhymeTime {...gameProps} />
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
        onContinue={() => closeEndScreen(false)}
        onReplay={() => closeEndScreen(true)}
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
        onUpdateSettings={updateSettings}
        onSetProfile={setProfile}
        onReset={resetProgress}
      />
    </div>
  );
}

function endGameEmoji(gameId) {
  const game = getGame(gameId);
  switch (game?.host.name) {
    case 'Leo the Lion':
      return '🦁';
    case 'Momo the Monkey':
      return '🐒';
    case 'Polly the Parrot':
      return '🦜';
    default:
      return '🎉';
  }
}
