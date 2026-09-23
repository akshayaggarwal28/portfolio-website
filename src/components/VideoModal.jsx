import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Inline HTML5 video overlay. Plays `src` in a centered native <video> — no
 * canvas, no custom rAF render loop — so playback is driven entirely by the
 * browser's media clock (nothing here can desync from it).
 *
 * Resilience: if the stream stalls/underruns (which can leave the timer
 * advancing while the picture freezes), the recovery below nudges the
 * playback position to force the decoder to re-buffer, and reloads on a hard
 * error. A watchdog also catches "silent" freezes where no stall event fires.
 */
export default function VideoModal({ src, onClose }) {
  const videoRef = useRef(null);

  // Force the decoder to flush + re-buffer by re-seeking a hair backwards.
  const recover = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      const t = v.currentTime;
      // Re-seek to the nearest buffered position just behind the playhead.
      v.currentTime = Math.max(0, t - 0.15);
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    let stallTimer = null;
    let lastTime = 0;
    let sameTimeCount = 0;

    const onWaiting = () => {
      // Underrun: if it doesn't resume shortly, nudge it.
      clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        if (v.readyState < 3 /* HAVE_FUTURE_DATA */) recover();
      }, 1500);
    };
    const onPlaying = () => {
      clearTimeout(stallTimer);
      sameTimeCount = 0;
    };
    const onError = () => {
      // Hard decode/network error — reload the source and resume.
      try {
        v.load();
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } catch {
        /* ignore */
      }
    };

    v.addEventListener('waiting', onWaiting);
    v.addEventListener('stalled', onWaiting);
    v.addEventListener('suspend', onWaiting);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('error', onError);

    // Watchdog: catches "picture frozen but clock running" (and vice-versa)
    // where no stall event is dispatched. If we're meant to be playing but
    // currentTime hasn't moved for ~1s, force a recovery re-seek.
    const watchdog = setInterval(() => {
      if (v.paused || v.ended || v.seeking) {
        lastTime = v.currentTime;
        sameTimeCount = 0;
        return;
      }
      if (Math.abs(v.currentTime - lastTime) < 0.01) {
        sameTimeCount += 1;
        if (sameTimeCount >= 4) {
          // ~1s of no progress while "playing"
          sameTimeCount = 0;
          recover();
        }
      } else {
        sameTimeCount = 0;
      }
      lastTime = v.currentTime;
    }, 250);

    return () => {
      clearTimeout(stallTimer);
      clearInterval(watchdog);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('stalled', onWaiting);
      v.removeEventListener('suspend', onWaiting);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('error', onError);
    };
  }, [src, recover]);

  return (
    <AnimatePresence>
      {src && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <video
            ref={videoRef}
            src={src}
            controls
            autoPlay
            playsInline
            preload="auto"
            onClick={(e) => e.stopPropagation()}
          />
          <Close onClick={onClose} aria-label="Close video">
            ×
          </Close>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.92);
  padding: 6vw;

  video {
    width: 100%;
    max-width: 1000px;
    max-height: 84vh;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  }
`;

const Close = styled.button`
  position: absolute;
  top: 4vh;
  right: 5vw;
  font-size: 34px;
  line-height: 1;
  color: ${({ theme }) => theme.color.warmWhite};
  transition: color 0.3s ${({ theme }) => theme.ease};

  &:hover {
    color: ${({ theme }) => theme.color.gold};
  }
`;
