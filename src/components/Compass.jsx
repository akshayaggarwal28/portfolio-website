import styled from 'styled-components';
import { motion } from 'framer-motion';
import { compassPoints } from '../data/content';
import { useCompass } from '../context/CompassContext';
import Astrolabe from './Astrolabe';

/**
 * Section TWO · Left quadrant.
 * A circular "compass" menu — four gold points (ABOUT / WORK / CONTACT /
 * THEATRE) around a glowing central star, set against a faint astrolabe
 * star-chart. Hovering a point updates the active category (Sections 3 & 4).
 */
export default function Compass() {
  const { activeCategory, selectCategory } = useCompass();

  return (
    <Stage>
      {/* faint star-chart rings behind everything */}
      <Astrolabe />

      <Dial
        initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1], delay: 0.9 }}
      >
        {/* the compass orbit ring */}
        <Ring />

        {/* glowing central star */}
        <Center>
          <Glow
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.12, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Star
            viewBox="0 0 24 24"
            animate={{ scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 0 C12.6 8.2 15.8 11.4 24 12 C15.8 12.6 12.6 15.8 12 24 C11.4 15.8 8.2 12.6 0 12 C8.2 11.4 11.4 8.2 12 0 Z" />
          </Star>
        </Center>

        {/* gold node dots sitting exactly on the ring */}
        {compassPoints.map((p) => (
          <NodeDot
            key={`dot-${p.key}`}
            $position={p.position}
            $active={activeCategory === p.key}
          />
        ))}

        {/* text labels just outside the ring (the interactive hit targets) */}
        {compassPoints.map((p, i) => (
          <Point
            key={p.key}
            $position={p.position}
            $active={activeCategory === p.key}
            onMouseEnter={() => selectCategory(p.key)}
            onFocus={() => selectCategory(p.key)}
            onClick={() => selectCategory(p.key)}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.12 }}
          >
            {/* A "/"-separated label stacks onto two lines, keeping the slash
                trailing the first line — reads "TRAINING / WORKSHOPS". */}
            {p.label.includes('/')
              ? p.label.split('/').map((part, j, arr) => (
                  <LabelLine key={j}>
                    {j < arr.length - 1 ? `${part.trim()} /` : part.trim()}
                  </LabelLine>
                ))
              : p.label}
          </Point>
        ))}
      </Dial>
    </Stage>
  );
}

const Stage = styled.div`
  position: relative;
  /* Scales with the (shorter) single-page hero row while capping at 300px. */
  width: min(300px, 32vh);
  height: min(300px, 32vh);
  overflow: visible;

  @media (max-width: 900px) {
    width: 240px;
    height: 240px;
  }
`;

const Dial = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

const Ring = styled.div`
  position: absolute;
  inset: 24%;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 97, 0.35);
`;

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
`;

const Glow = styled(motion.div)`
  position: absolute;
  inset: -140%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 222, 179, 0.55) 0%,
    rgba(201, 169, 97, 0.28) 30%,
    transparent 68%
  );
`;

const Star = styled(motion.svg)`
  position: absolute;
  inset: 0;
  width: 22px;
  height: 22px;
  fill: ${({ theme }) => theme.color.gold};
  filter: drop-shadow(0 0 6px rgba(245, 222, 179, 0.9));
`;

/* Gold node dot sitting exactly on the ring (24% / 76% == ring edge). */
const NodeDot = styled.span`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.gold};
  box-shadow: 0 0 6px 1px
    rgba(245, 222, 179, ${({ $active }) => ($active ? 0.95 : 0.5)});
  transition: box-shadow 0.4s ${({ theme }) => theme.ease};

  ${({ $position }) =>
    $position === 'top' && `top: 24%; left: 50%; transform: translate(-50%, -50%);`}
  ${({ $position }) =>
    $position === 'bottom' &&
    `top: 76%; left: 50%; transform: translate(-50%, -50%);`}
  ${({ $position }) =>
    $position === 'left' && `left: 24%; top: 50%; transform: translate(-50%, -50%);`}
  ${({ $position }) =>
    $position === 'right' &&
    `left: 76%; top: 50%; transform: translate(-50%, -50%);`}
  ${({ $position }) =>
    $position === 'topright' &&
    `left: 68.4%; top: 31.6%; transform: translate(-50%, -50%);`}
`;

/**
 * Text label positioned just outside its node on the ring. These are the
 * interactive hit targets that drive the category selection.
 */
const Point = styled(motion.button)`
  position: absolute;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  white-space: nowrap;
  text-align: center;
  line-height: 1.35;
  color: ${({ $active, theme }) =>
    $active ? theme.color.gold : theme.color.warmWhite};
  transition: color 0.4s ${({ theme }) => theme.ease},
    letter-spacing 0.4s ${({ theme }) => theme.ease};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.color.gold};
    letter-spacing: 0.3em;
    outline: none;
  }

  ${({ $position }) =>
    $position === 'top' &&
    `top: 24%; left: 50%; transform: translate(-50%, calc(-100% - 12px));`}
  ${({ $position }) =>
    $position === 'bottom' &&
    `top: 76%; left: 50%; transform: translate(-50%, 12px);`}
  ${({ $position }) =>
    $position === 'left' &&
    `left: 24%; top: 50%; transform: translate(calc(-100% - 14px), -50%);`}
  ${({ $position }) =>
    $position === 'right' &&
    `left: 76%; top: 50%; transform: translate(14px, -50%);`}
  ${({ $position }) =>
    $position === 'topright' &&
    `left: 68.4%; top: 31.6%; transform: translate(6px, calc(-50% - 20px));`}
`;

/* One line of a stacked, "/"-separated compass label. */
const LabelLine = styled.span`
  display: block;
`;
