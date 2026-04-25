// Word Builders (Penny the Panda) — phonics fill-in.
//
// Kid sees a picture and a word with one letter (or letter-pair)
// missing, then picks the right pair to complete the word.  Three
// difficulty tiers covering the standard early-phonics progression:
//
//   easy   CVC vowel picks ("c_t") + simple initial digraphs ("__ip")
//   medium final digraphs ("du_ck") + l/r/s blends ("__og", "fl__")
//   hard   long-vowel pairs ("r_n" → rain), r-controlled ("st_r")
//
// Each tier has 40+ rounds so the session picker (10 per session by
// default; bumped to 12) hands the kid genuinely different content
// every replay rather than the same handful of words.
//
// Round shape:
//   { id, category, before, after, answer, options, word, emoji }
//
// Helpers below cut the per-round boilerplate so this file stays
// readable as it grows.

// Build a CVC vowel-pick: c_t with vowel options.  Always 3 distractors
// so the picker has meaningful choices.  `withDistractors` shuffles
// every session via session.js so order doesn't get memorised.
const cvc = (id, before, after, answer, options, word, emoji) => ({
  id, category: 'cvc', before, after, answer, options, word, emoji,
});
const dig = (id, before, after, answer, options, word, emoji, kind = 'digraph-start') => ({
  id, category: kind, before, after, answer, options, word, emoji,
});
const blend = (id, before, after, answer, options, word, emoji) => ({
  id, category: 'blend', before, after, answer, options, word, emoji,
});
const vp = (id, before, after, answer, options, word, emoji) => ({
  id, category: 'vowel-pair', before, after, answer, options, word, emoji,
});
const rcontrol = (id, before, after, answer, options, word, emoji) => ({
  id, category: 'r-control', before, after, answer, options, word, emoji,
});

const VOWELS_3 = ['a', 'e', 'i', 'o', 'u'];

// Each helper takes (id, before, after, answer, options, word, emoji).
// Picking 3 distractors from VOWELS_3 \ answer keeps option counts tidy.
function vowelOpts(answer) {
  const others = VOWELS_3.filter((v) => v !== answer);
  return [answer, ...others.slice(0, 2)];
}

const EASY_CVC = [
  // _at family
  cvc('cat', 'c', 't', 'a', vowelOpts('a'), 'cat', '🐈'),
  cvc('bat', 'b', 't', 'a', vowelOpts('a'), 'bat', '🦇'),
  cvc('hat', 'h', 't', 'a', vowelOpts('a'), 'hat', '🎩'),
  cvc('mat', 'm', 't', 'a', vowelOpts('a'), 'mat', '🧶'),
  cvc('rat', 'r', 't', 'a', vowelOpts('a'), 'rat', '🐀'),
  // _an family
  cvc('can', 'c', 'n', 'a', vowelOpts('a'), 'can', '🥫'),
  cvc('fan', 'f', 'n', 'a', vowelOpts('a'), 'fan', '🪭'),
  cvc('man', 'm', 'n', 'a', vowelOpts('a'), 'man', '👨'),
  cvc('pan', 'p', 'n', 'a', vowelOpts('a'), 'pan', '🍳'),
  cvc('van', 'v', 'n', 'a', vowelOpts('a'), 'van', '🚐'),
  // _ap family
  cvc('cap', 'c', 'p', 'a', vowelOpts('a'), 'cap', '🧢'),
  cvc('map', 'm', 'p', 'a', vowelOpts('a'), 'map', '🗺️'),
  cvc('nap', 'n', 'p', 'a', vowelOpts('a'), 'nap', '😴'),
  // _ag family
  cvc('bag', 'b', 'g', 'a', vowelOpts('a'), 'bag', '👜'),
  cvc('flag', 'fl', 'g', 'a', vowelOpts('a'), 'flag', '🚩'),
  cvc('tag', 't', 'g', 'a', vowelOpts('a'), 'tag', '🏷️'),
  // short e
  cvc('bed', 'b', 'd', 'e', vowelOpts('e'), 'bed', '🛏️'),
  cvc('red', 'r', 'd', 'e', vowelOpts('e'), 'red', '🟥'),
  cvc('hen', 'h', 'n', 'e', vowelOpts('e'), 'hen', '🐔'),
  cvc('pen', 'p', 'n', 'e', vowelOpts('e'), 'pen', '🖊️'),
  cvc('ten', 't', 'n', 'e', vowelOpts('e'), 'ten', '🔟'),
  cvc('jet', 'j', 't', 'e', vowelOpts('e'), 'jet', '✈️'),
  cvc('net', 'n', 't', 'e', vowelOpts('e'), 'net', '🥅'),
  cvc('vet', 'v', 't', 'e', vowelOpts('e'), 'vet', '🥼'),
  cvc('egg', '', 'gg', 'e', vowelOpts('e'), 'egg', '🥚'),
  cvc('leg', 'l', 'g', 'e', vowelOpts('e'), 'leg', '🦵'),
  // short i
  cvc('pig', 'p', 'g', 'i', vowelOpts('i'), 'pig', '🐖'),
  cvc('big', 'b', 'g', 'i', vowelOpts('i'), 'big', '🐘'),
  cvc('wig', 'w', 'g', 'i', vowelOpts('i'), 'wig', '👱'),
  cvc('pin', 'p', 'n', 'i', vowelOpts('i'), 'pin', '📌'),
  cvc('lip', 'l', 'p', 'i', vowelOpts('i'), 'lip', '👄'),
  cvc('zip', 'z', 'p', 'i', vowelOpts('i'), 'zip', '🤐'),
  cvc('hit', 'h', 't', 'i', vowelOpts('i'), 'hit', '👊'),
  cvc('sit', 's', 't', 'i', vowelOpts('i'), 'sit', '🪑'),
  cvc('bib', 'b', 'b', 'i', vowelOpts('i'), 'bib', '👶'),
  // short o
  cvc('dog', 'd', 'g', 'o', vowelOpts('o'), 'dog', '🐕'),
  cvc('frog', 'fr', 'g', 'o', vowelOpts('o'), 'frog', '🐸'),
  cvc('log', 'l', 'g', 'o', vowelOpts('o'), 'log', '🪵'),
  cvc('hot', 'h', 't', 'o', vowelOpts('o'), 'hot', '🔥'),
  cvc('pot', 'p', 't', 'o', vowelOpts('o'), 'pot', '🍲'),
  cvc('top', 't', 'p', 'o', vowelOpts('o'), 'top', '🔝'),
  cvc('mop', 'm', 'p', 'o', vowelOpts('o'), 'mop', '🧹'),
  cvc('hop', 'h', 'p', 'o', vowelOpts('o'), 'hop', '🐰'),
  cvc('box', 'b', 'x', 'o', vowelOpts('o'), 'box', '📦'),
  cvc('fox', 'f', 'x', 'o', vowelOpts('o'), 'fox', '🦊'),
  // short u
  cvc('sun', 's', 'n', 'u', vowelOpts('u'), 'sun', '☀️'),
  cvc('bun', 'b', 'n', 'u', vowelOpts('u'), 'bun', '🍞'),
  cvc('run', 'r', 'n', 'u', vowelOpts('u'), 'run', '🏃'),
  cvc('cup', 'c', 'p', 'u', vowelOpts('u'), 'cup', '🥤'),
  cvc('pup', 'p', 'p', 'u', vowelOpts('u'), 'pup', '🐶'),
  cvc('bug', 'b', 'g', 'u', vowelOpts('u'), 'bug', '🐛'),
  cvc('hug', 'h', 'g', 'u', vowelOpts('u'), 'hug', '🤗'),
  cvc('mug', 'm', 'g', 'u', vowelOpts('u'), 'mug', '☕'),
  cvc('jug', 'j', 'g', 'u', vowelOpts('u'), 'jug', '🫗'),
  cvc('nut', 'n', 't', 'u', vowelOpts('u'), 'nut', '🥜'),
  cvc('cut', 'c', 't', 'u', vowelOpts('u'), 'cut', '✂️'),
  cvc('hut', 'h', 't', 'u', vowelOpts('u'), 'hut', '🛖'),
  cvc('bus', 'b', 's', 'u', vowelOpts('u'), 'bus', '🚌'),
];

const EASY_INITIAL_DIGRAPHS = [
  dig('ship', '', 'ip', 'sh', ['sh', 'ch', 'th'], 'ship', '🚢'),
  dig('sheep', '', 'eep', 'sh', ['sh', 'ch', 'th'], 'sheep', '🐑'),
  dig('shoe', '', 'oe', 'sh', ['sh', 'sn', 'ch'], 'shoe', '👟'),
  dig('shop', '', 'op', 'sh', ['sh', 'ch', 'sn'], 'shop', '🛍️'),
  dig('shark', '', 'ark', 'sh', ['sh', 'ch', 'st'], 'shark', '🦈'),
  dig('cheese', '', 'eese', 'ch', ['ch', 'sh', 'th'], 'cheese', '🧀'),
  dig('chair', '', 'air', 'ch', ['ch', 'sh', 'cl'], 'chair', '🪑'),
  dig('chick', '', 'ick', 'ch', ['ch', 'sh', 'th'], 'chick', '🐤'),
  dig('cherry', '', 'erry', 'ch', ['ch', 'sh', 'th'], 'cherry', '🍒'),
  dig('three', '', 'ree', 'th', ['th', 'tr', 'sh'], 'three', '3️⃣'),
  dig('thumb', '', 'umb', 'th', ['th', 'sh', 'ch'], 'thumb', '👍'),
  dig('whale', '', 'ale', 'wh', ['wh', 'sh', 'ch'], 'whale', '🐋'),
];

const MEDIUM_FINAL_DIGRAPHS = [
  // final ck
  dig('duck', 'du', '', 'ck', ['ck', 'sh', 'th'], 'duck', '🦆', 'digraph-end'),
  dig('sock', 'so', '', 'ck', ['ck', 'sh', 'st'], 'sock', '🧦', 'digraph-end'),
  dig('rock', 'ro', '', 'ck', ['ck', 'st', 'th'], 'rock', '🪨', 'digraph-end'),
  dig('lock', 'lo', '', 'ck', ['ck', 'sh', 'th'], 'lock', '🔒', 'digraph-end'),
  dig('clock', 'clo', '', 'ck', ['ck', 'sh', 'st'], 'clock', '🕰️', 'digraph-end'),
  dig('truck', 'tru', '', 'ck', ['ck', 'sh', 'st'], 'truck', '🚚', 'digraph-end'),
  dig('brick', 'bri', '', 'ck', ['ck', 'sh', 'th'], 'brick', '🧱', 'digraph-end'),
  dig('kick', 'ki', '', 'ck', ['ck', 'sh', 'st'], 'kick', '🦵', 'digraph-end'),
  // final ng
  dig('ring', 'ri', '', 'ng', ['ng', 'nk', 'mp'], 'ring', '💍', 'digraph-end'),
  dig('king', 'ki', '', 'ng', ['ng', 'nk', 'gh'], 'king', '🤴', 'digraph-end'),
  dig('sing', 'si', '', 'ng', ['ng', 'nk', 'mp'], 'sing', '🎤', 'digraph-end'),
  dig('wing', 'wi', '', 'ng', ['ng', 'nk', 'mp'], 'wing', '🪶', 'digraph-end'),
  dig('swing', 'swi', '', 'ng', ['ng', 'nk', 'th'], 'swing', '🎢', 'digraph-end'),
  dig('long', 'lo', '', 'ng', ['ng', 'nk', 'mp'], 'long', '📏', 'digraph-end'),
  // final sh
  dig('fish', 'fi', '', 'sh', ['sh', 'ch', 'th'], 'fish', '🐟', 'digraph-end'),
  dig('dish', 'di', '', 'sh', ['sh', 'ch', 'th'], 'dish', '🍽️', 'digraph-end'),
  dig('wish', 'wi', '', 'sh', ['sh', 'ch', 'th'], 'wish', '⭐', 'digraph-end'),
  dig('brush', 'bru', '', 'sh', ['sh', 'ch', 'th'], 'brush', '🪥', 'digraph-end'),
  // final th
  dig('bath', 'ba', '', 'th', ['th', 'sh', 'ch'], 'bath', '🛁', 'digraph-end'),
  dig('moth', 'mo', '', 'th', ['th', 'sh', 'ch'], 'moth', '🦋', 'digraph-end'),
  dig('tooth', 'too', '', 'th', ['th', 'sh', 'ck'], 'tooth', '🦷', 'digraph-end'),
];

const MEDIUM_BLENDS = [
  // l-blends
  blend('flag-bl', '', 'ag', 'fl', ['fl', 'gl', 'pl'], 'flag', '🚩'),
  blend('flat', '', 'at', 'fl', ['fl', 'gl', 'pl'], 'flat', '📃'),
  blend('plug', '', 'ug', 'pl', ['pl', 'cl', 'fl'], 'plug', '🔌'),
  blend('plant', '', 'ant', 'pl', ['pl', 'cl', 'gl'], 'plant', '🪴'),
  blend('glove', '', 'ove', 'gl', ['gl', 'cl', 'sl'], 'glove', '🧤'),
  blend('blue', '', 'ue', 'bl', ['bl', 'gl', 'cl'], 'blue', '🟦'),
  blend('clock-bl', '', 'ock', 'cl', ['cl', 'bl', 'fl'], 'clock', '🕰️'),
  blend('cloud-bl', '', 'oud', 'cl', ['cl', 'bl', 'pl'], 'cloud', '☁️'),
  blend('slide', '', 'ide', 'sl', ['sl', 'sn', 'st'], 'slide', '🛝'),
  blend('sleep', '', 'eep', 'sl', ['sl', 'sn', 'st'], 'sleep', '😴'),
  // r-blends
  blend('frog-bl', '', 'og', 'fr', ['fr', 'cr', 'tr'], 'frog', '🐸'),
  blend('free', '', 'ee', 'fr', ['fr', 'tr', 'cr'], 'free', '🕊️'),
  blend('grape', '', 'ape', 'gr', ['gr', 'tr', 'cr'], 'grape', '🍇'),
  blend('green', '', 'een', 'gr', ['gr', 'cr', 'tr'], 'green', '🟢'),
  blend('crab', '', 'ab', 'cr', ['cr', 'gr', 'dr'], 'crab', '🦀'),
  blend('crown', '', 'own', 'cr', ['cr', 'gr', 'br'], 'crown', '👑'),
  blend('drum', '', 'um', 'dr', ['dr', 'tr', 'br'], 'drum', '🥁'),
  blend('drop', '', 'op', 'dr', ['dr', 'tr', 'br'], 'drop', '💧'),
  blend('tree', '', 'ee', 'tr', ['tr', 'fr', 'br'], 'tree', '🌳'),
  blend('train', '', 'ain', 'tr', ['tr', 'br', 'cr'], 'train', '🚂'),
  blend('brick-bl', '', 'ick', 'br', ['br', 'cr', 'tr'], 'brick', '🧱'),
  blend('bread', '', 'ead', 'br', ['br', 'cr', 'tr'], 'bread', '🍞'),
  blend('prize', '', 'ize', 'pr', ['pr', 'br', 'tr'], 'prize', '🏆'),
  // s-blends
  blend('star', '', 'ar', 'st', ['st', 'sp', 'sn'], 'star', '⭐'),
  blend('stop', '', 'op', 'st', ['st', 'sp', 'sk'], 'stop', '🛑'),
  blend('snail', '', 'ail', 'sn', ['sn', 'sl', 'st'], 'snail', '🐌'),
  blend('snake-bl', '', 'ake', 'sn', ['sn', 'sl', 'st'], 'snake', '🐍'),
  blend('skip', '', 'ip', 'sk', ['sk', 'st', 'sp'], 'skip', '🏃'),
  blend('spider', '', 'ider', 'sp', ['sp', 'st', 'sk'], 'spider', '🕷️'),
  blend('spoon', '', 'oon', 'sp', ['sp', 'st', 'sk'], 'spoon', '🥄'),
  blend('swim', '', 'im', 'sw', ['sw', 'st', 'sp'], 'swim', '🏊'),
  blend('smile', '', 'ile', 'sm', ['sm', 'sl', 'sn'], 'smile', '😀'),
];

const HARD_VOWEL_PAIRS = [
  // ai
  vp('rain', 'r', 'n', 'ai', ['ai', 'ay', 'ei'], 'rain', '🌧️'),
  vp('train-vp', 'tr', 'n', 'ai', ['ai', 'ay', 'ei'], 'train', '🚂'),
  vp('snail-vp', 'sn', 'l', 'ai', ['ai', 'ay', 'ee'], 'snail', '🐌'),
  vp('mail', 'm', 'l', 'ai', ['ai', 'ay', 'oa'], 'mail', '📬'),
  vp('paint', 'p', 'nt', 'ai', ['ai', 'ay', 'ee'], 'paint', '🎨'),
  // ee
  vp('tree-vp', 'tr', '', 'ee', ['ee', 'ea', 'ie'], 'tree', '🌳'),
  vp('bee', 'b', '', 'ee', ['ee', 'ea', 'ai'], 'bee', '🐝'),
  vp('sheep-vp', 'sh', 'p', 'ee', ['ee', 'ea', 'oa'], 'sheep', '🐑'),
  vp('seed', 's', 'd', 'ee', ['ee', 'ea', 'oa'], 'seed', '🌱'),
  vp('green-vp', 'gr', 'n', 'ee', ['ee', 'ea', 'ai'], 'green', '🟢'),
  // ea
  vp('leaf', 'l', 'f', 'ea', ['ea', 'ee', 'ai'], 'leaf', '🍃'),
  vp('beach', 'b', 'ch', 'ea', ['ea', 'ee', 'oa'], 'beach', '🏖️'),
  vp('peach', 'p', 'ch', 'ea', ['ea', 'ee', 'ai'], 'peach', '🍑'),
  vp('eat', '', 't', 'ea', ['ea', 'ai', 'oa'], 'eat', '🍽️'),
  vp('meat', 'm', 't', 'ea', ['ea', 'ee', 'ai'], 'meat', '🥩'),
  // oa
  vp('boat', 'b', 't', 'oa', ['oa', 'ow', 'oe'], 'boat', '⛵'),
  vp('goat', 'g', 't', 'oa', ['oa', 'ow', 'oe'], 'goat', '🐐'),
  vp('coat', 'c', 't', 'oa', ['oa', 'ow', 'oe'], 'coat', '🧥'),
  vp('toast', 't', 'st', 'oa', ['oa', 'ow', 'au'], 'toast', '🍞'),
  vp('soap', 's', 'p', 'oa', ['oa', 'ow', 'au'], 'soap', '🧼'),
  // oo (long)
  vp('moon', 'm', 'n', 'oo', ['oo', 'ou', 'ow'], 'moon', '🌙'),
  vp('spoon-vp', 'sp', 'n', 'oo', ['oo', 'ou', 'ow'], 'spoon', '🥄'),
  vp('boot', 'b', 't', 'oo', ['oo', 'ou', 'oa'], 'boot', '🥾'),
  vp('pool', 'p', 'l', 'oo', ['oo', 'ou', 'oa'], 'pool', '🏊'),
  vp('zoo', 'z', '', 'oo', ['oo', 'ou', 'oa'], 'zoo', '🦒'),
  // ou / ow
  vp('cloud', 'cl', 'd', 'ou', ['ou', 'ow', 'oo'], 'cloud', '☁️'),
  vp('mouth', 'm', 'th', 'ou', ['ou', 'ow', 'oo'], 'mouth', '👄'),
  vp('house', 'h', 'se', 'ou', ['ou', 'ow', 'oo'], 'house', '🏠'),
  vp('mouse', 'm', 'se', 'ou', ['ou', 'ow', 'oa'], 'mouse', '🐭'),
  vp('cow', 'c', '', 'ow', ['ow', 'oo', 'oa'], 'cow', '🐄'),
  vp('crown-vp', 'cr', 'n', 'ow', ['ow', 'ou', 'oa'], 'crown', '👑'),
];

const HARD_R_CONTROL = [
  rcontrol('star-rc', 'st', '', 'ar', ['ar', 'or', 'er'], 'star', '⭐'),
  rcontrol('car', 'c', '', 'ar', ['ar', 'or', 'er'], 'car', '🚗'),
  rcontrol('jar', 'j', '', 'ar', ['ar', 'or', 'er'], 'jar', '🫙'),
  rcontrol('park', 'p', 'k', 'ar', ['ar', 'or', 'er'], 'park', '🏞️'),
  rcontrol('shark-rc', 'sh', 'k', 'ar', ['ar', 'or', 'ir'], 'shark', '🦈'),
  rcontrol('barn', 'b', 'n', 'ar', ['ar', 'or', 'er'], 'barn', '🏚️'),
  rcontrol('fork', 'f', 'k', 'or', ['or', 'ar', 'er'], 'fork', '🍴'),
  rcontrol('horn', 'h', 'n', 'or', ['or', 'ar', 'ur'], 'horn', '🎺'),
  rcontrol('corn', 'c', 'n', 'or', ['or', 'ar', 'ur'], 'corn', '🌽'),
  rcontrol('storm', 'st', 'm', 'or', ['or', 'ar', 'ur'], 'storm', '🌩️'),
  rcontrol('bird', 'b', 'd', 'ir', ['ir', 'ur', 'er'], 'bird', '🐦'),
  rcontrol('shirt', 'sh', 't', 'ir', ['ir', 'ur', 'er'], 'shirt', '👕'),
];

export const WORD_BUILDERS_ROUNDS = {
  easy: [...EASY_CVC, ...EASY_INITIAL_DIGRAPHS],
  medium: [...MEDIUM_FINAL_DIGRAPHS, ...MEDIUM_BLENDS, ...EASY_INITIAL_DIGRAPHS.slice(0, 5)],
  hard: [...HARD_VOWEL_PAIRS, ...HARD_R_CONTROL, ...MEDIUM_BLENDS.slice(0, 6)],
};
