import { useMemo, useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';

// A simple math question that kids ages 3-9 can't reliably answer but that's
// trivial for adults.  Randomised so kids can't memorise a single answer.
function makeProblem() {
  const a = 6 + Math.floor(Math.random() * 7); // 6-12
  const b = 4 + Math.floor(Math.random() * 6); // 4-9
  return { a, b, answer: a + b };
}

export default function ParentGate({ open, onClose, onPass }) {
  const [problem, setProblem] = useState(makeProblem);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const reset = () => {
    setProblem(makeProblem());
    setValue('');
    setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number.parseInt(value, 10) === problem.answer) {
      onPass();
      reset();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      label="Parent gate"
    >
      <div className="storybook-card p-8 text-center">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Grown-ups only
        </p>
        <h2 className="mt-1 font-display text-3xl text-terracotta-600">
          Answer this to continue
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-4">
          <div className="font-display text-5xl text-terracotta-600">
            {problem.a} + {problem.b} = ?
          </div>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            aria-label="Your answer"
            className={[
              'focus-ring w-40 rounded-2xl border-4 bg-white px-4 py-3 text-center font-display text-3xl text-terracotta-600 shadow-soft',
              error ? 'border-parrot-400' : 'border-terracotta-200',
            ].join(' ')}
            autoFocus
          />
          {error && (
            <p className="font-body text-sm font-bold text-parrot-500">
              Hmm, not quite — try again.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="jungle" size="md">
              Unlock
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
