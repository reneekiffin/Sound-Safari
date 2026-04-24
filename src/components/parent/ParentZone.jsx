import { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';
import ProgressBar from '../shared/ProgressBar.jsx';
import { GAMES, LEVELS } from '../../data/games.js';

const DIFFICULTIES = [
  { id: 'easy', label: 'Gentle' },
  { id: 'medium', label: 'Growing' },
  { id: 'hard', label: 'Brave' },
];

const AVATARS = ['🦁', '🐒', '🦜', '🐘', '🦒', '🐸', '🦥', '🐅', '🦊', '🐰'];

export default function ParentZone({
  open,
  onClose,
  state,
  voices,
  onUpdateSettings,
  onSetProfile,
  onReset,
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Modal open={open} onClose={onClose} label="Parent zone">
      <div className="storybook-card max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Parent zone
            </p>
            <h2 className="font-display text-3xl text-terracotta-600">
              {state.childName}'s Safari
            </h2>
          </div>
          <Button variant="ghost" size="md" onClick={onClose} ariaLabel="Close parent zone">
            Done
          </Button>
        </div>

        {/* Profile */}
        <section className="mt-5">
          <h3 className="font-heading text-lg font-extrabold text-terracotta-600">Profile</h3>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <label className="flex flex-col">
              <span className="font-body text-sm font-bold text-terracotta-500">Name</span>
              <input
                type="text"
                value={state.childName}
                onChange={(e) => onSetProfile({ childName: e.target.value || 'Explorer' })}
                className="focus-ring mt-1 w-52 rounded-xl border-4 border-terracotta-200 bg-white px-3 py-2 font-heading text-lg text-terracotta-600"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => onSetProfile({ avatar: a })}
                  aria-label={`Choose avatar ${a}`}
                  className={[
                    'focus-ring h-12 w-12 rounded-full border-4 text-2xl',
                    state.avatar === a
                      ? 'border-sage-400 bg-sage-100'
                      : 'border-terracotta-200 bg-white',
                  ].join(' ')}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Level (age band) */}
        <section className="mt-6">
          <h3 className="font-heading text-lg font-extrabold text-terracotta-600">Level</h3>
          <p className="font-body text-sm text-terracotta-600/80">
            Pick an age band to surface the right games on the safari map.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LEVELS.map((l) => {
              const active = state.settings.level === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => onUpdateSettings({ level: l.id })}
                  className={[
                    'focus-ring flex items-center justify-between rounded-2xl border-4 px-4 py-3 text-left transition-colors',
                    active
                      ? 'border-terracotta-500 bg-terracotta-400 text-white'
                      : 'border-terracotta-200 bg-white text-terracotta-600',
                  ].join(' ')}
                >
                  <span className="font-heading text-base font-extrabold">{l.label}</span>
                  <span className={['font-body text-sm font-bold', active ? 'text-white/90' : 'text-terracotta-500'].join(' ')}>
                    ages {l.age}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => onUpdateSettings({ level: 'all' })}
              className={[
                'focus-ring flex items-center justify-between rounded-2xl border-4 px-4 py-3 text-left sm:col-span-2',
                state.settings.level === 'all'
                  ? 'border-terracotta-500 bg-terracotta-400 text-white'
                  : 'border-terracotta-200 bg-white text-terracotta-600',
              ].join(' ')}
            >
              <span className="font-heading text-base font-extrabold">Show all games</span>
              <span className="font-body text-sm font-bold">everything open</span>
            </button>
          </div>
        </section>

        {/* Progress */}
        <section className="mt-6">
          <h3 className="font-heading text-lg font-extrabold text-terracotta-600">Progress</h3>
          <div className="mt-2 space-y-3">
            {GAMES.map((game) => {
              const p = state.games[game.id] ?? { stars: 0, completed: 0 };
              return (
                <div key={game.id} className="rounded-2xl bg-white/70 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-heading text-base font-extrabold text-terracotta-600">
                      {game.title}
                    </span>
                    <span className="font-body text-sm text-terracotta-600/80">
                      ⭐ {p.stars} · Played {p.completed}×
                    </span>
                  </div>
                  <ProgressBar
                    current={Math.min(p.stars, 30)}
                    total={30}
                    color={game.accent}
                    label={game.title}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Settings */}
        <section className="mt-6">
          <h3 className="font-heading text-lg font-extrabold text-terracotta-600">Settings</h3>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Toggle
              label="Voices & instructions"
              value={state.settings.audioEnabled}
              onChange={(v) => onUpdateSettings({ audioEnabled: v })}
            />
            <Toggle
              label="Sound effects"
              value={state.settings.sfxEnabled}
              onChange={(v) => onUpdateSettings({ sfxEnabled: v })}
            />
          </div>

          <div className="mt-4">
            <p className="font-body text-sm font-bold text-terracotta-500">Difficulty</p>
            <div className="mt-2 flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onUpdateSettings({ difficulty: d.id })}
                  className={[
                    'focus-ring flex-1 rounded-2xl border-4 px-3 py-2 font-heading text-base font-extrabold transition-colors',
                    state.settings.difficulty === d.id
                      ? 'border-jungle-400 bg-jungle-400 text-white'
                      : 'border-terracotta-200 bg-white text-terracotta-600',
                  ].join(' ')}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <VoiceSection
            state={state}
            voices={voices}
            onUpdateSettings={onUpdateSettings}
          />
        </section>

        {/* Danger zone */}
        <section className="mt-6 rounded-2xl bg-parrot-400/10 p-3">
          <h3 className="font-heading text-lg font-extrabold text-parrot-500">Reset progress</h3>
          <p className="mt-1 font-body text-sm text-terracotta-600/80">
            This will clear all stars and start fresh. It can't be undone.
          </p>
          {!confirmReset ? (
            <div className="mt-2">
              <Button variant="parrot" size="md" onClick={() => setConfirmReset(true)}>
                Reset…
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                variant="parrot"
                size="md"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
              >
                Yes, reset everything
              </Button>
              <Button variant="ghost" size="md" onClick={() => setConfirmReset(false)}>
                Keep my progress
              </Button>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

// Voice & TTS settings.
//
// Three modes:
//   1. Server (default)  — calls our /api/tts proxy which holds the
//      ElevenLabs key server-side.  Nothing for parents to configure.
//   2. ElevenLabs BYOK   — paste your own ElevenLabs key, browser
//      talks to ElevenLabs directly.  Useful if someone wants to
//      run the app on their own quota.
//   3. Browser voice     — Web Speech only.  Free but robotic.
//
// The per-mascot voice mapping for ElevenLabs lives in
// src/config/voices.js and is applied the same way regardless of
// whether the request goes through the proxy or BYOK.
function VoiceSection({ state, voices, onUpdateSettings }) {
  const provider = state.settings.ttsProvider ?? 'server';
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="mt-4 rounded-2xl bg-white/70 p-3">
      <p className="font-heading text-base font-extrabold text-terracotta-600">
        Voice
      </p>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <ProviderTab
          label="Server voice ★"
          sub="natural, nothing to set up"
          active={provider === 'server'}
          onClick={() => onUpdateSettings({ ttsProvider: 'server' })}
          tone="jungle"
        />
        <ProviderTab
          label="My own key"
          sub="ElevenLabs BYOK"
          active={provider === 'elevenlabs'}
          onClick={() => onUpdateSettings({ ttsProvider: 'elevenlabs' })}
          tone="parrot"
        />
        <ProviderTab
          label="Browser voice"
          sub="free, varies by device"
          active={provider === 'browser'}
          onClick={() => onUpdateSettings({ ttsProvider: 'browser' })}
          tone="terracotta"
        />
      </div>

      {provider === 'server' && (
        <div className="mt-3 rounded-xl bg-jungle-400/10 p-3 font-body text-xs text-terracotta-600/90">
          <strong className="font-extrabold text-jungle-500">
            Using server voices.
          </strong>{' '}
          The six character voices (Ellie, Leo, Zara, Skippy, Penny, Sofia)
          play through our secure server.  Other mascots use your browser's
          built-in voice.
        </div>
      )}

      {provider === 'browser' && (
        <label className="mt-3 flex flex-col gap-1">
          <span className="font-body text-sm font-bold text-terracotta-500">
            Browser voice
          </span>
          <select
            value={state.settings.voiceURI ?? ''}
            onChange={(e) =>
              onUpdateSettings({ voiceURI: e.target.value || null })
            }
            className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-3 py-2 font-heading text-base font-extrabold text-terracotta-600"
          >
            <option value="">Auto (best available)</option>
            {(voices ?? []).map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
          <span className="font-body text-xs text-terracotta-500/80">
            Tip: iPad → "Samantha (Enhanced)". Chrome → any "Natural" voice.
          </span>
        </label>
      )}

      {provider === 'elevenlabs' && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-body text-sm font-bold text-terracotta-500">
              Your ElevenLabs API key
            </span>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={state.settings.ttsElevenLabsKey ?? ''}
                onChange={(e) =>
                  onUpdateSettings({ ttsElevenLabsKey: e.target.value })
                }
                placeholder="eleven_..."
                className="focus-ring flex-1 rounded-2xl border-4 border-terracotta-200 bg-white px-3 py-2 font-body text-base text-terracotta-600"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-3 py-2 font-heading text-sm font-extrabold text-terracotta-600"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="rounded-xl bg-parrot-400/10 p-3 font-body text-xs text-terracotta-600/90">
            <strong className="font-extrabold text-parrot-500">
              Using your own key.
            </strong>{' '}
            Usage will bill to your ElevenLabs account.  The key is stored
            only in this browser's localStorage and sent only to
            elevenlabs.io.  Get a key at{' '}
            <span className="font-mono">elevenlabs.io → Profile → API Keys</span>.
          </div>
        </div>
      )}
    </div>
  );
}

// Visual tab used by the provider picker at the top of VoiceSection.
// Kept local to this component; centralising would be overkill.
function ProviderTab({ label, sub, active, onClick, tone = 'terracotta' }) {
  const activeBg = {
    terracotta: 'border-terracotta-500 bg-terracotta-400 text-white',
    jungle: 'border-jungle-400 bg-jungle-400 text-white',
    parrot: 'border-parrot-400 bg-parrot-400 text-white',
  }[tone];
  return (
    <button
      onClick={onClick}
      className={[
        'focus-ring rounded-xl border-4 px-3 py-2 text-left font-heading text-sm font-extrabold transition-colors',
        active ? activeBg : 'border-terracotta-200 bg-white text-terracotta-600',
      ].join(' ')}
    >
      {label}
      <span className="block text-[11px] font-bold opacity-80">{sub}</span>
    </button>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-3">
      <span className="font-body text-base font-bold text-terracotta-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={[
          'focus-ring relative h-8 w-14 rounded-full border-2 transition-colors',
          value ? 'border-sage-400 bg-sage-300' : 'border-terracotta-200 bg-white',
        ].join(' ')}
      >
        <span
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-soft transition-all"
          style={{ left: value ? '28px' : '4px' }}
        />
      </button>
    </label>
  );
}
