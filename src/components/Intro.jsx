import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { identity } from '../data/content';
import introPortrait from '../assets/media/intro-portrait.jpg';

/**
 * Opening splash — a fixed full-screen layer that sits ON TOP of the portfolio.
 * Sequence (matches the reference): a ✦ star fades in at centre, the black cover
 * dissolves to reveal the B&W portrait, the star drifts down and fades, then the
 * name unravels. It holds until the name has appeared (scroll is locked), and
 * once the user scrolls it DISSOLVES IN PLACE — fade + a whisper of zoom, no
 * slide — unveiling the homepage that was underneath all along.
 */
const NAME = (identity.firstName + ' ' + identity.lastName).toUpperCase();
const NAME_DONE_MS = 5800; // when the name is fully shown → unlock scrolling

export default function Intro() {
  const [ready, setReady] = useState(false); // intro finished, scroll unlocked
  const [p, setP] = useState(0); // scroll-reveal progress 0 → 1

  // Unlock scrolling once the opening sequence has revealed the name.
  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      document.documentElement.classList.add('intro-ready');
    }, NAME_DONE_MS);
    return () => clearTimeout(t);
  }, []);

  // Scroll-reveal: dissolve the intro over one viewport of scroll.
  useEffect(() => {
    if (!ready) return;
    const onScroll = () =>
      setP(Math.max(0, Math.min(1, window.scrollY / (window.innerHeight || 1))));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ready]);

  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease-in-out
  const gone = p >= 0.999;

  return (
    <Overlay
      style={{
        opacity: 1 - e,
        transform: `scale(${1 + e * 0.06})`,
        pointerEvents: gone ? 'none' : 'auto',
        visibility: gone ? 'hidden' : 'visible',
      }}
    >
      {/* B&W portrait beneath the cover */}
      <Portrait style={{ backgroundImage: `url(${introPortrait})` }} />
      <Gradient />

      {/* black cover dissolves to reveal the portrait */}
      <Cover
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.0, ease: 'easeInOut' }}
      />

      {/* the ✦ star: fades in centre, holds, drifts down and fades */}
      <Star
        initial={{ opacity: 0, y: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0.9, 0.9, 0],
          y: ['0vh', '0vh', '38vh', '40vh'],
          scale: [0.6, 1, 1, 0.85],
        }}
        transition={{
          duration: 3.0,
          delay: 0.2,
          times: [0, 0.18, 0.64, 1],
          ease: 'easeInOut',
        }}
      >
        ✦
      </Star>

      {/* the name unravels, letter by letter */}
      <Name
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.075, delayChildren: 3.4 } },
        }}
        aria-label={NAME}
      >
        {NAME.split('').map((ch, i) =>
          ch === ' ' ? (
            <Space key={i} />
          ) : (
            <Letter key={i} variants={letterV} aria-hidden="true">
              {ch}
            </Letter>
          )
        )}
      </Name>

      <Hint
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 5.4 }}
        style={{ opacity: p > 0.02 ? 0 : undefined }}
      >
        Scroll
      </Hint>
    </Overlay>
  );
}

const letterV = {
  hidden: { opacity: 0, y: '0.5em' },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  background: ${({ theme }) => theme.color.black};
  overflow: hidden;
  will-change: opacity, transform;
`;

const Portrait = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  /* Pulled up (higher Y%) so the hands near the bottom of the frame are revealed. */
  background-position: 50% 68%;
  filter: grayscale(1) contrast(1.18) brightness(0.78);
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(6, 6, 5, 0.15) 0%,
    rgba(6, 6, 5, 0) 30%,
    rgba(6, 6, 5, 0) 48%,
    rgba(6, 6, 5, 0.72) 74%,
    rgba(6, 6, 5, 0.97) 100%
  );
`;

const Cover = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.color.black};
`;

const Star = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -0.5em;
  margin-top: -0.5em;
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 22px;
  color: ${({ theme }) => theme.color.warmWhite};
  text-shadow: 0 0 14px rgba(245, 222, 179, 0.65);
`;

const Name = styled(motion.h1)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6vh;
  text-align: center;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: clamp(12px, 1.3vw, 18px);
  font-weight: 300;
  letter-spacing: 0.48em;
  text-indent: 0.48em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.warmWhite};
  /* Nudge right so the name's centre sits under the subject (right of frame centre). */
  transform: translateX(2.6vw);
`;

const Letter = styled(motion.span)`
  display: inline-block;
`;

const Space = styled.span`
  display: inline-block;
  width: 0.55em;
`;

const Hint = styled(motion.div)`
  position: absolute;
  right: 2vw;
  bottom: 8vh;
  writing-mode: vertical-rl;
  font-size: 9px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.grayDim};
`;
