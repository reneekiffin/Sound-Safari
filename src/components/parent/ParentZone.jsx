import { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';
import ProgressBar from '../shared/ProgressBar.jsx';
import { GAMES, LEVELS } from '../../data/games.js';
import { OPENAI_VOICES } from '../../hooks/useCloudSpeech.js';

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

// Voice & TTS settings — split into two tabs:
//   - Browser voice (free, Web Speech)
//   - Cloud voice (much more natural, needs an API key, costs ~pennies)
function VoiceSection({ state, voices, onUpdateSettings }) {
  const provider = state.settings.ttsProvider ?? 'browser';
  const isCloud = provider === 'openai';
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="mt-4 rounded-2xl bg-white/70 p-3">
      <p className="font-heading text-base font-extrabold text-terracotta-600">
        Voice
      </p>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onUpdateSettings({ ttsProvider: 'browser' })}
          className={[
            'focus-ring flex-1 rounded-xl border-4 px-3 py-2 font-heading text-sm font-extrabold transition-colors',
            provider === 'browser'
              ? 'border-terracotta-500 bg-terracotta-400 text-white'
              : 'border-terracotta-200 bg-white text-terracotta-600',
          ].join(' ')}
        >
          Browser voice
          <span className="block text-[11px] font-bold opacity-80">free, varies by device</span>
        </button>
        <button
          onClick={() => onUpdateSettings({ ttsProvider: 'openai' })}
          className={[
            'focus-ring flex-1 rounded-xl border-4 px-3 py-2 font-heading text-sm font-extrabold transition-colors',
            provider === 'openai'
              ? 'border-jungle-400 bg-jungle-400 text-white'
              : 'border-terracotta-200 bg-white text-terracotta-600',
          ].join(' ')}
        >
          Natural voice (OpenAI)
          <span className="block text-[11px] font-bold opacity-80">API key, very natural</span>
        </button>
      </div>

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

      {isCloud && (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-body text-sm font-bold text-terracotta-500">
              OpenAI voice
            </span>
            <select
              value={state.settings.ttsCloudVoice ?? 'nova'}
              onChange={(e) =>
                onUpdateSettings({ ttsCloudVoice: e.target.value })
              }
              className="focus-ring rounded-2xl border-4 border-terracotta-200 bg-white px-3 py-2 font-heading text-base font-extrabold text-terracotta-600"
            >
              {OPENAI_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-body text-sm font-bold text-terracotta-500">
              OpenAI API key
            </span>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={state.settings.ttsApiKey ?? ''}
                onChange={(e) => onUpdateSettings({ ttsApiKey: e.target.value })}
                placeholder="sk-..."
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

          <div className="rounded-xl bg-jungle-400/10 p-3 font-body text-xs text-terracotta-600/90">
            <strong className="font-extrabold text-jungle-500">How this works.</strong>{' '}
            Speech is sent to OpenAI's TTS API (<span className="font-mono">gpt-4o-mini-tts</span>)
            and the audio is cached on this device, so repeated phrases cost nothing
            after the first time. The key is stored only in this browser's
            localStorage. Roughly <span className="font-mono">$0.015</span> per 1k
            characters; a 10-round session typically costs a fraction of a cent.
          </div>

          <p className="font-body text-xs text-terracotta-500/80">
            Don't have a key? Get one at{' '}
            <span className="font-mono">platform.openai.com/api-keys</span>.
          </p>
        </div>
      )}
    </div>
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
