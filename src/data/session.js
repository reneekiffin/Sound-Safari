// Session content picker.
//
// Two responsibilities:
//   1. Remember a rolling "recently seen" list per game so each new
//      session serves fresh rounds; the memory window shrinks when the
//      pool is almost exhausted so the kid never runs out.
//   2. Balance across sub-categories when rounds carry a `category` tag,
//      so a session feels varied instead of all-one-topic.  This matters
//      when we pool many lessons together (e.g. Sentences has 7 lessons
//      of content) — without this, the picker might hand the kid 8
//      rounds of "is/are" and 2 of everything else.
//
// Both behaviours are pure and deterministic given their inputs, so the
// caller (useProgress) can persist `recent` and feed it back in.

const DEFAULT_SESSION_SIZE = 10;

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Round-robin across buckets until we have enough picks.  We shuffle the
// inside of each bucket first, then iterate bucket-by-bucket so one
// bucket can't dominate a session.
function roundRobinPick(buckets, wanted) {
  const queues = buckets.map((b) => shuffle(b));
  const order = shuffle(queues.map((_, i) => i));
  const out = [];
  let progress = true;
  while (out.length < wanted && progress) {
    progress = false;
    for (const i of order) {
      if (out.length >= wanted) break;
      const q = queues[i];
      if (q.length) {
        out.push(q.shift());
        progress = true;
      }
    }
  }
  return out;
}

export function pickSession({
  pool,
  recent = [],
  size = DEFAULT_SESSION_SIZE,
  getId = (r) => r.id ?? JSON.stringify(r),
  balanceBy = 'category', // optional field name to balance across
}) {
  if (!pool?.length) {
    return { rounds: [], nextRecent: recent };
  }

  const recentSet = new Set(recent);
  // Keep the block window sensible: never block more than 70% of the pool.
  const maxBlock = Math.floor(pool.length * 0.7);
  const effectiveRecent =
    recentSet.size > maxBlock ? new Set([...recentSet].slice(-maxBlock)) : recentSet;

  const unseen = pool.filter((r) => !effectiveRecent.has(getId(r)));
  const seen = pool.filter((r) => effectiveRecent.has(getId(r)));

  const wanted = Math.min(size, pool.length);

  let picked;
  if (balanceBy && pool.some((r) => r[balanceBy] != null)) {
    // Bucket the unseen pool by the balance field and round-robin.
    const bucketMap = new Map();
    for (const r of unseen) {
      const key = r[balanceBy] ?? '__none__';
      if (!bucketMap.has(key)) bucketMap.set(key, []);
      bucketMap.get(key).push(r);
    }
    picked = roundRobinPick([...bucketMap.values()], wanted);

    // Backfill from "seen" (also round-robin balanced) if we still need more.
    if (picked.length < wanted) {
      const seenBuckets = new Map();
      for (const r of seen) {
        const key = r[balanceBy] ?? '__none__';
        if (!seenBuckets.has(key)) seenBuckets.set(key, []);
        seenBuckets.get(key).push(r);
      }
      const extra = roundRobinPick([...seenBuckets.values()], wanted - picked.length);
      picked = picked.concat(extra);
    }

    // Final gentle shuffle so buckets aren't strictly interleaved.
    picked = shuffle(picked);
  } else {
    // No balance field — fall back to simple random.
    picked = shuffle(unseen).slice(0, wanted);
    if (picked.length < wanted) {
      const extra = shuffle(seen).slice(0, wanted - picked.length);
      picked = picked.concat(extra);
    }
  }

  const ids = picked.map(getId);
  const nextRecent = [...recent, ...ids].slice(-maxBlock);

  return { rounds: picked, nextRecent };
}

export function shuffleOptions(round) {
  if (!round?.options) return round;
  return { ...round, options: shuffle(round.options) };
}
