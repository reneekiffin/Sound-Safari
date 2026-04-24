import { motion } from 'framer-motion';

// Inline SVG animal hosts — designed to be a warm, storybook feel without
// any external art.  Easy to swap with real illustrations later: each
// character is a single component with a consistent bounding box.
const ANIMALS = {
  lion: Lion,
  monkey: Monkey,
  parrot: Parrot,
  elephant: Elephant,
  toucan: Toucan,
  frog: Frog,
};

export default function AnimalHost({
  type,
  size = 180,
  idle = true,
  happy = false,
  className = '',
}) {
  const Component = ANIMALS[type] ?? Lion;
  return (
    <motion.div
      className={['inline-block', className].join(' ')}
      style={{ width: size, height: size }}
      animate={
        happy
          ? { y: [0, -14, 0], rotate: [-4, 4, -4] }
          : idle
          ? { y: [0, -4, 0] }
          : undefined
      }
      transition={{
        duration: happy ? 0.9 : 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    >
      <Component />
    </motion.div>
  );
}

function baseProps() {
  return {
    viewBox: '0 0 200 200',
    width: '100%',
    height: '100%',
    xmlns: 'http://www.w3.org/2000/svg',
  };
}

function Lion() {
  return (
    <svg {...baseProps()}>
      {/* Mane */}
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const r = 70;
          const cx = 100 + Math.cos(a) * r;
          const cy = 110 + Math.sin(a) * r;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="28"
              fill="#d9a221"
              stroke="#a0441a"
              strokeWidth="3"
            />
          );
        })}
      </g>
      {/* Face */}
      <circle cx="100" cy="110" r="60" fill="#f7eac0" stroke="#a0441a" strokeWidth="4" />
      {/* Ears */}
      <circle cx="60" cy="70" r="14" fill="#e8bd4a" stroke="#a0441a" strokeWidth="3" />
      <circle cx="140" cy="70" r="14" fill="#e8bd4a" stroke="#a0441a" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="82" cy="102" r="6" fill="#3a2a1a" />
      <circle cx="118" cy="102" r="6" fill="#3a2a1a" />
      <circle cx="84" cy="100" r="2" fill="#fff" />
      <circle cx="120" cy="100" r="2" fill="#fff" />
      {/* Muzzle */}
      <ellipse cx="100" cy="130" rx="24" ry="18" fill="#fbf5e7" stroke="#a0441a" strokeWidth="3" />
      <path d="M100 118 L94 128 L106 128 Z" fill="#3a2a1a" />
      <path d="M100 128 Q92 138 88 135 M100 128 Q108 138 112 135" stroke="#3a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Monkey() {
  return (
    <svg {...baseProps()}>
      {/* Body */}
      <ellipse cx="100" cy="150" rx="48" ry="38" fill="#7a3214" stroke="#3a2a1a" strokeWidth="3" />
      {/* Head */}
      <circle cx="100" cy="95" r="55" fill="#a0441a" stroke="#3a2a1a" strokeWidth="4" />
      {/* Ears */}
      <circle cx="50" cy="90" r="18" fill="#a0441a" stroke="#3a2a1a" strokeWidth="3" />
      <circle cx="150" cy="90" r="18" fill="#a0441a" stroke="#3a2a1a" strokeWidth="3" />
      <circle cx="50" cy="90" r="9" fill="#f7eac0" />
      <circle cx="150" cy="90" r="9" fill="#f7eac0" />
      {/* Face patch */}
      <ellipse cx="100" cy="110" rx="40" ry="34" fill="#f7eac0" stroke="#3a2a1a" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="85" cy="100" r="6" fill="#3a2a1a" />
      <circle cx="115" cy="100" r="6" fill="#3a2a1a" />
      <circle cx="87" cy="98" r="2" fill="#fff" />
      <circle cx="117" cy="98" r="2" fill="#fff" />
      {/* Nose */}
      <ellipse cx="100" cy="118" rx="4" ry="3" fill="#3a2a1a" />
      {/* Smile */}
      <path d="M82 128 Q100 144 118 128" stroke="#3a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Parrot() {
  return (
    <svg {...baseProps()}>
      {/* Tail */}
      <path d="M140 155 L180 175 L158 150 Z" fill="#2aa29a" stroke="#3a2a1a" strokeWidth="3" />
      <path d="M140 155 L190 155 L158 138 Z" fill="#e8bd4a" stroke="#3a2a1a" strokeWidth="3" />
      {/* Body */}
      <ellipse cx="95" cy="120" rx="55" ry="60" fill="#e24a3c" stroke="#3a2a1a" strokeWidth="4" />
      {/* Wing */}
      <path
        d="M75 105 Q55 130 85 155 Q100 140 95 115 Z"
        fill="#2aa29a"
        stroke="#3a2a1a"
        strokeWidth="3"
      />
      {/* Head */}
      <circle cx="95" cy="75" r="35" fill="#e24a3c" stroke="#3a2a1a" strokeWidth="4" />
      {/* Beak */}
      <path d="M60 75 Q40 80 60 92 Q80 88 75 82 Z" fill="#f2994a" stroke="#3a2a1a" strokeWidth="3" />
      {/* Eye */}
      <circle cx="100" cy="70" r="7" fill="#fbf5e7" stroke="#3a2a1a" strokeWidth="2" />
      <circle cx="102" cy="72" r="4" fill="#3a2a1a" />
      <circle cx="103" cy="71" r="1.2" fill="#fff" />
      {/* Foot */}
      <path d="M95 180 L90 195 M105 180 L110 195" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Elephant() {
  return (
    <svg {...baseProps()}>
      {/* Body */}
      <ellipse cx="105" cy="125" rx="60" ry="50" fill="#b0cd9f" stroke="#3b5728" strokeWidth="4" />
      {/* Head */}
      <circle cx="80" cy="95" r="40" fill="#d9e8cf" stroke="#3b5728" strokeWidth="4" />
      {/* Ear */}
      <ellipse cx="55" cy="95" rx="22" ry="30" fill="#b0cd9f" stroke="#3b5728" strokeWidth="3" />
      {/* Trunk */}
      <path
        d="M70 115 Q60 145 80 160 Q95 160 95 145"
        fill="#d9e8cf"
        stroke="#3b5728"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="88" cy="90" r="5" fill="#3a2a1a" />
      <circle cx="90" cy="88" r="1.8" fill="#fff" />
      {/* Tusk */}
      <path d="M74 120 L68 130" stroke="#fbf5e7" strokeWidth="5" strokeLinecap="round" />
      {/* Legs */}
      <rect x="80" y="160" width="16" height="25" rx="6" fill="#b0cd9f" stroke="#3b5728" strokeWidth="3" />
      <rect x="120" y="160" width="16" height="25" rx="6" fill="#b0cd9f" stroke="#3b5728" strokeWidth="3" />
    </svg>
  );
}

function Toucan() {
  return (
    <svg {...baseProps()}>
      {/* Body */}
      <ellipse cx="105" cy="125" rx="48" ry="58" fill="#3a2a1a" stroke="#1a0f05" strokeWidth="3" />
      {/* Belly */}
      <ellipse cx="105" cy="140" rx="22" ry="32" fill="#fbf5e7" />
      {/* Head */}
      <circle cx="100" cy="80" r="34" fill="#3a2a1a" stroke="#1a0f05" strokeWidth="3" />
      {/* Beak */}
      <path
        d="M60 75 Q30 85 55 100 Q85 105 80 85 Z"
        fill="#f2994a"
        stroke="#1a0f05"
        strokeWidth="3"
      />
      <path d="M60 75 L80 85" stroke="#e24a3c" strokeWidth="3" />
      {/* Eye */}
      <circle cx="105" cy="75" r="7" fill="#e8bd4a" stroke="#1a0f05" strokeWidth="2" />
      <circle cx="107" cy="77" r="3" fill="#3a2a1a" />
      {/* Foot */}
      <path d="M95 185 L95 195 M115 185 L115 195" stroke="#f2994a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Frog() {
  return (
    <svg {...baseProps()}>
      {/* Body */}
      <ellipse cx="100" cy="130" rx="55" ry="50" fill="#679148" stroke="#3b5728" strokeWidth="4" />
      {/* Eyes (on top) */}
      <circle cx="75" cy="75" r="22" fill="#679148" stroke="#3b5728" strokeWidth="3" />
      <circle cx="125" cy="75" r="22" fill="#679148" stroke="#3b5728" strokeWidth="3" />
      <circle cx="75" cy="75" r="12" fill="#fbf5e7" />
      <circle cx="125" cy="75" r="12" fill="#fbf5e7" />
      <circle cx="75" cy="78" r="6" fill="#3a2a1a" />
      <circle cx="125" cy="78" r="6" fill="#3a2a1a" />
      {/* Smile */}
      <path d="M70 135 Q100 165 130 135" stroke="#3b5728" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Cheek dots */}
      <circle cx="65" cy="130" r="4" fill="#f2994a" />
      <circle cx="135" cy="130" r="4" fill="#f2994a" />
    </svg>
  );
}
