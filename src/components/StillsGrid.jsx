import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * STILLS · lower editorial gallery.
 *
 * Not a flat photo dump: an asymmetric "contact sheet" — one lead frame + a
 * cluster of smaller ones, each numbered, that brighten and lift on hover and
 * feature large in the top-right. Clicking opens a cinematic lightbox with
 * prev/next (arrows + keyboard), a counter, and a scale-in reveal.
 */
export default function StillsGrid() {
  const { category, activeItem, selectItem } = useCompass();
  const items = category.items;
  const [lb, setLb] = useState(null); // lightbox index, or null

  const close = () => setLb(null);
  const nav = (dir) =>
    setLb((i) => (i === null ? i : (i + dir + items.length) % items.length));

  useEffect(() => {
    if (lb === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') nav(1);
      else if (e.key === 'ArrowLeft') nav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb]); // eslint-disable-line react-hooks/exhaustive-deps

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      <Panel
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Eyebrow>{category.label}</Eyebrow>

        <Grid>
          {items.map((it, i) => (
            <Frame
              key={it.id}
              $active={it.id === activeItem.id}
              style={{
                backgroundImage: `url(${it.still})`,
                backgroundPosition: it.position || 'center',
              }}
              onMouseEnter={() => selectItem(it.id)}
              onFocus={() => selectItem(it.id)}
              onClick={() => setLb(i)}
              tabIndex={0}
              aria-label={`${it.label || 'Still'} — open`}
            >
              <Num>{pad(i + 1)}</Num>
              <Glow />
              {it.label && <Cap>{it.label}</Cap>}
            </Frame>
          ))}
        </Grid>
      </Panel>

      <AnimatePresence>
        {lb !== null && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <Arrow
              $side="left"
              onClick={(e) => {
                e.stopPropagation();
                nav(-1);
              }}
              aria-label="Previous"
            >
              ‹
            </Arrow>

            <AnimatePresence mode="wait">
              <Big
                key={items[lb].id}
                src={items[lb].still}
                alt=""
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </AnimatePresence>

            <Arrow
              $side="right"
              onClick={(e) => {
                e.stopPropagation();
                nav(1);
              }}
              aria-label="Next"
            >
              ›
            </Arrow>

            <LbCounter>
              {pad(lb + 1)} <i>/</i> {pad(items.length)}
            </LbCounter>
            <Close onClick={close} aria-label="Close">
              ×
            </Close>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

const Panel = styled(motion.section)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 1.6vh ${({ theme }) => theme.gutter};

  @media (max-width: 900px) {
    height: auto;
    overflow: visible;
    padding: 6vh ${({ theme }) => theme.gutter};
  }
`;

const Eyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  margin-bottom: 1.4vh;
  flex: none;
`;

/* Asymmetric contact-sheet: lead frame (2×2) + a 2×2 cluster beside it. */
const Grid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 10px;

  & > *:first-child {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;

    & > *:first-child {
      grid-column: 1 / -1;
      grid-row: auto;
      aspect-ratio: 16 / 9;
    }
    & > * {
      aspect-ratio: 3 / 4;
    }
  }
`;

const Glow = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
  opacity: 0.85;
  transition: opacity 0.35s ${({ theme }) => theme.ease};
`;

const Num = styled.span`
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 10px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 10px;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.color.warmWhite};
  opacity: 0.55;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
  transition: color 0.3s ${({ theme }) => theme.ease},
    opacity 0.3s ${({ theme }) => theme.ease};
`;

/* Editorial category label, revealed on hover. */
const Cap = styled.span`
  position: absolute;
  z-index: 2;
  bottom: 9px;
  left: 11px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  opacity: 0;
  transform: translateY(5px);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.95);
  transition: opacity 0.35s ${({ theme }) => theme.ease},
    transform 0.35s ${({ theme }) => theme.ease};
`;

const Frame = styled.button`
  position: relative;
  min-height: 0;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-color: ${({ theme }) => theme.color.panel};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.color.gold : theme.color.line)};
  border-radius: 3px;
  cursor: pointer;
  filter: ${({ $active }) => ($active ? 'none' : 'grayscale(0.15) brightness(0.82)')};
  transform: translateZ(0);
  transition: filter 0.4s ${({ theme }) => theme.ease},
    border-color 0.4s ${({ theme }) => theme.ease},
    transform 0.4s ${({ theme }) => theme.ease},
    box-shadow 0.4s ${({ theme }) => theme.ease};

  &:hover,
  &:focus-visible {
    outline: none;
    filter: none;
    border-color: ${({ theme }) => theme.color.goldDeep};
    transform: scale(1.015);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55),
      0 0 26px rgba(201, 169, 97, 0.16);
    z-index: 1;
  }
  &:hover ${Glow}, &:focus-visible ${Glow} {
    opacity: 0.35;
  }
  &:hover ${Num}, &:focus-visible ${Num} {
    opacity: 1;
    color: ${({ theme }) => theme.color.gold};
  }
  &:hover ${Cap}, &:focus-visible ${Cap} {
    opacity: 1;
    transform: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.95);
  padding: 6vh 8vw;
`;

const Big = styled(motion.img)`
  max-width: 84vw;
  max-height: 88vh;
  object-fit: contain;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.75);
`;

const Arrow = styled.button`
  position: absolute;
  ${({ $side }) => ($side === 'left' ? 'left: 2vw;' : 'right: 2vw;')}
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  font-size: 34px;
  line-height: 1;
  color: ${({ theme }) => theme.color.warmWhite};
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  transition: all 0.3s ${({ theme }) => theme.ease};

  &:hover {
    color: ${({ theme }) => theme.color.gold};
    border-color: ${({ theme }) => theme.color.goldDeep};
  }
`;

const LbCounter = styled.p`
  position: absolute;
  bottom: 4vh;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  letter-spacing: 0.3em;
  color: ${({ theme }) => theme.color.gold};

  i {
    color: ${({ theme }) => theme.color.goldDeep};
    font-style: normal;
  }
`;

const Close = styled.button`
  position: absolute;
  top: 3vh;
  right: 4vw;
  font-size: 36px;
  line-height: 1;
  color: ${({ theme }) => theme.color.warmWhite};
  transition: color 0.3s ${({ theme }) => theme.ease};

  &:hover {
    color: ${({ theme }) => theme.color.gold};
  }
`;
