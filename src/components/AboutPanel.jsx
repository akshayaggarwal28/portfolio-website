import { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';
import { aboutVideos } from '../data/aboutVideos';
import LoopVideo from './LoopVideo';

/**
 * Custom About layout: a cinematic intro-video player on the left (the "main
 * content"), and the bio + a video-clip gallery on the right. The gallery is
 * an L-shape — a 2×2 feature clip with the remaining clips wrapping its right
 * and bottom edges. Each tile autoplays a short, muted loop (a showreel wall).
 */
export default function AboutPanel() {
  const { activeItem } = useCompass();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Click-to-unmute: the intro monologue doubles as the voice/presence sample.
  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    setMuted(next);
  };

  return (
    <Panel
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Left>
        <Player>
          <LoopVideo ref={videoRef} src={activeItem.inlineVideo} />

          {/* Signature "hear him" toggle — the only unmutable clip on the site. */}
          <SoundToggle onClick={toggleSound} $on={!muted} aria-label={muted ? 'Unmute intro' : 'Mute intro'}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" />
              {muted ? (
                <path d="M17 8l5 8M22 8l-5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              )}
            </svg>
            <span>{muted ? 'Hear him' : 'Mute'}</span>
          </SoundToggle>
        </Player>

        <Bio>
          {activeItem.lines &&
            activeItem.lines.map((line, i) => <span key={i}>{line}</span>)}
        </Bio>
      </Left>

      {aboutVideos.length > 0 && (
        <Gallery>
          {aboutVideos.map((clip, i) => (
            <VideoTile key={i} clip={clip} />
          ))}
        </Gallery>
      )}
    </Panel>
  );
}

/**
 * A single gallery tile: the clip autoplays muted on a seamless loop.
 */
function VideoTile({ clip }) {
  return (
    <Tile>
      <LoopVideo src={clip.src} style={{ objectPosition: clip.position }} />
    </Tile>
  );
}

const Panel = styled(motion.section)`
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  gap: 3.4vw;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 1.6vh ${({ theme }) => theme.gutter} 1.6vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
    gap: 4vh;
    padding: 6vh ${({ theme }) => theme.gutter};
  }
`;

/* Left column: the main intro video + bio, centred as one balanced block so
   there's no dead space above/below the player. */
const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
  min-height: 0;

  @media (max-width: 900px) {
    gap: 3vh;
  }
`;

/* Cinematic video frame — locked aspect, soft outer glow, clean border. */
const Player = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 72%;
  overflow: hidden;
  border: 1px solid rgba(245, 222, 179, 0.14);
  border-radius: 4px;
  background: ${({ theme }) => theme.color.black};
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(201, 169, 97, 0.06);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 900px) {
    max-height: none;
  }
`;

/* "Hear him" pill — the site's single click-to-unmute voice/presence moment. */
const SoundToggle = styled.button`
  position: absolute;
  z-index: 3;
  bottom: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px 7px 10px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ $on, theme }) => ($on ? theme.color.black : theme.color.gold)};
  background: ${({ $on, theme }) =>
    $on ? theme.color.gold : 'rgba(10, 10, 9, 0.5)'};
  border: 1px solid rgba(245, 222, 179, 0.55);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: all 0.3s ${({ theme }) => theme.ease};

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
    stroke: currentColor;
  }

  &:hover {
    background: ${({ $on, theme }) =>
      $on ? theme.color.goldLit : 'rgba(20, 18, 14, 0.65)'};
    box-shadow: 0 0 24px rgba(245, 222, 179, 0.35);
  }
`;

/* Matches the Work/Theatre Meta list (12px · 0.04em · gray · 4px gap). */
const Bio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.gray};
  flex: none;
`;

/*
 * Video gallery — a balanced grid that fills its column edge-to-edge with no
 * dead cells. Two columns × auto rows: the current four clips form a clean 2×2
 * showreel wall (drop in more and it grows in pairs, still gapless).
 */
const Gallery = styled.div`
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 10px;

  @media (max-width: 900px) {
    height: auto;
    grid-auto-rows: auto;
  }
`;

/* Cinematic frame for each clip: crisp radius, faint gold hairline, soft
   outer shadow, and a toggleable vignette (on while looping / before play). */
const Tile = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid rgba(245, 222, 179, 0.14);
  background: ${({ theme }) => theme.color.black};
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.35);
  transition: border-color 0.35s ${({ theme }) => theme.ease},
    box-shadow 0.35s ${({ theme }) => theme.ease};

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ${({ theme }) => theme.ease};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.28) 0%,
        rgba(0, 0, 0, 0) 34%,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.44) 100%
      ),
      radial-gradient(120% 100% at 50% 40%, transparent 54%, rgba(0, 0, 0, 0.5) 100%);
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.goldDeep};
    box-shadow: 0 20px 46px rgba(0, 0, 0, 0.55),
      0 0 30px rgba(201, 169, 97, 0.12);
  }
  &:hover video {
    transform: scale(1.04);
  }

  @media (max-width: 900px) {
    aspect-ratio: 16 / 9;
  }
`;
