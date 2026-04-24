// Session content picker with a rolling "recently seen" memory per game.
//
// Each game has a pool of rounds.  We want every new session to feel fresh
// — so we remember the last N rounds the kid played and weight the picker
// to avoid them.  When the kid has seen almost the whole pool, the memory
// window shrinks automatically so they don't run out.
//
// Persistence is handled by useProgress (it passes us the current recent
// list and gets back the new one to save).  That keeps the data layer pure.

const DEFAULT_SESSION_SIZE = 10;

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick a session from a pool, preferring unseen rounds.  `getId` extracts a
// stable identifier from each round so we can compare across pool updates.
export function pickSession({
  pool,
  recent = [],
  size = DEFAULT_SESSION_SIZE,
  getId = (r) => r.id ?? JSON.stringify(r),
}) {
  if (!pool?.length) {
    return { rounds: [], nextRecent: recent };
  }

  const recentSet = new Set(recent);
  // Keep the recent window sensible: never block more than 70% of the pool.
  const maxBlock = Math.floor(pool.length * 0.7);
  const effectiveRecent =
    recentSet.size > maxBlock ? new Set([...recentSet].slice(-maxBlock)) : recentSet;

  const unseen = pool.filter((r) => !effectiveRecent.has(getId(r)));
  const seen = pool.filter((r) => effectiveRecent.has(getId(r)));

  const wanted = Math.min(size, pool.length);
  const picked = [];
  const from = shuffle(unseen);
  while (picked.length < wanted && from.length) picked.push(from.shift());
  // If we still need more, backfill from seen (least-recently-seen first).
  if (picked.length < wanted) {
    const fromSeen = shuffle(seen);
    while (picked.length < wanted && fromSeen.length) picked.push(fromSeen.shift());
  }

  // Update the rolling window — retain the most recent (pool.length * 0.7)
  // entries so new games stay fresh without permanently blocking rounds.
  const ids = picked.map(getId);
  const nextRecent = [...recent, ...ids].slice(-maxBlock);

  return { rounds: picked, nextRecent };
}

export function shuffleOptions(round) {
  if (!round?.options) return round;
  return { ...round, options: shuffle(round.options) };
}
