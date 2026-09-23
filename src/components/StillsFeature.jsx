import styled, { keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';
import MediaFrame from './MediaFrame';

/**
 * STILLS · top-right featured still.
 *
 * The hovered/selected still, shown large (object-fit: contain — never cropped)
 * with a slow Ken-Burns drift for cinematic life, a frame counter, and a
 * crossfade on change. Hovering a thumbnail below swaps it; click → lightbox.
 */
export default function StillsFeature() {
  const { activeItem, activeIndex, total } = useCompass();
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <MediaFrame>
      <AnimatePresence>
        <Shot
          key={activeItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img src={activeItem.still} alt="" />
        </Shot>
      </AnimatePresence>

      {activeItem.label && <Label>{activeItem.label}</Label>}

      <Counter>
        {pad(activeIndex + 1)} <i>/</i> {pad(total)}
      </Counter>
    </MediaFrame>
  );
}

const kenburns = keyframes`
  0%   { transform: scale(1) translate(0, 0); }
  50%  { transform: scale(1.06) translate(-1%, -1%); }
  100% { transform: scale(1) translate(0, 0); }
`;

const Shot = styled(motion.div)`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    padding: 3%;
    animation: ${kenburns} 18s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      animation: none;
    }
  }
`;

const Label = styled.p`
  position: absolute;
  z-index: 3;
  bottom: 16px;
  left: 20px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 10px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.85);
`;

const Counter = styled.p`
  position: absolute;
  z-index: 3;
  bottom: 16px;
  right: 20px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 11px;
  letter-spacing: 0.28em;
  color: ${({ theme }) => theme.color.gold};
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.8);

  i {
    color: ${({ theme }) => theme.color.goldDeep};
    font-style: normal;
  }
`;
