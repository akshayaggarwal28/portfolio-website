import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * Section 3 · Lower-left — the big media preview.
 * Driven entirely by CompassContext: shows the currently active item's still,
 * with a page counter (01 / 05) and prev/next arrows. Cross-fades on change.
 * When the active project has a video, the card is clickable to play it inline
 * (a play badge appears) via the shared `onPlay` handler.
 */
export default function PreviewMedia({ onPlay }) {
  const { activeItem, activeIndex, total, prev, next } = useCompass();

  const pad = (n) => String(n).padStart(2, '0');
  const hasVideo = Boolean(activeItem.trailer); // opens in the modal player
  const isInline = Boolean(activeItem.inlineVideo); // plays right here (About)
  const showNav = total > 1; // hide counter/arrows for single-item sections

  return (
    <Box>
      {/* Left rail: page counter */}
      {showNav && (
        <Counter>
          <Num>{pad(activeIndex + 1)}</Num>
          <Bar />
          <Total>{pad(total)}</Total>
        </Counter>
      )}

      <Stage
        $clickable={hasVideo}
        onClick={hasVideo ? () => onPlay(activeItem.trailer) : undefined}
        aria-label={hasVideo ? `Play ${activeItem.title}` : undefined}
      >
        {isInline ? (
          /* Intro video embedded + played inside the visual area (About). */
          <InlineVideo
            src={activeItem.inlineVideo}
            poster={activeItem.poster}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <Still
                key={activeItem.id}
                style={{
                  backgroundImage: activeItem.still
                    ? `url(${activeItem.still})`
                    : 'none',
                  backgroundPosition: activeItem.objectPosition || 'center',
                }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </AnimatePresence>

            <Shade />

            {/* Centered play badge when the project has a modal video */}
            {hasVideo && (
              <PlayBadge aria-hidden="true">
                <span>▶</span>
              </PlayBadge>
            )}
          </>
        )}

        {/* Bottom-left navigation arrows (don't trigger playback) */}
        {showNav && (
          <Arrows>
            <Arrow
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous project"
            >
              ‹
            </Arrow>
            <Arrow
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next project"
            >
              ›
            </Arrow>
          </Arrows>
        )}
      </Stage>
    </Box>
  );
}

const Box = styled.div`
  position: relative;
  display: flex;
  gap: 22px;
  align-items: stretch;
  height: 100%;
  min-height: 0;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const Counter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 6px;
  font-family: ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.color.gray};
`;

const Num = styled.span`
  font-size: 13px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.color.gold};
`;

const Bar = styled.span`
  width: 1px;
  flex: 1;
  min-height: 42px;
  background: ${({ theme }) => theme.color.line};
`;

const Total = styled.span`
  font-size: 11px;
  letter-spacing: 0.14em;
`;

const Stage = styled.div`
  position: relative;
  flex: 1;
  /* Fill the preview row's height in the single-page layout. */
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.line};
  /* Subtle fill so an image-less play reads as an intentional blank frame. */
  background: ${({ theme }) => theme.color.panel};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  @media (max-width: 900px) {
    height: auto;
    aspect-ratio: 16 / 9;
  }
`;

/* Intro video embedded inside the visual frame (About section). */
const InlineVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
`;

/* Centered play badge shown on projects that have a video. */
const PlayBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.gold};
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  color: ${({ theme }) => theme.color.gold};
  font-size: 18px;
  pointer-events: none;
  transition: transform 0.3s ${({ theme }) => theme.ease},
    background 0.3s ${({ theme }) => theme.ease};

  span {
    margin-left: 3px;
  }

  ${Stage}:hover & {
    transform: translate(-50%, -50%) scale(1.08);
    background: rgba(245, 222, 179, 0.12);
  }
`;

const Still = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
`;

const Shade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(0, 0, 0, 0.55) 100%
  );
`;

const Arrows = styled.div`
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: flex;
  gap: 10px;
`;

const Arrow = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 20px;
  line-height: 1;
  color: ${({ theme }) => theme.color.warmWhite};
  border: 1px solid ${({ theme }) => theme.color.line};
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  transition: all 0.3s ${({ theme }) => theme.ease};

  &:hover {
    color: ${({ theme }) => theme.color.gold};
    border-color: ${({ theme }) => theme.color.goldDeep};
  }
`;
