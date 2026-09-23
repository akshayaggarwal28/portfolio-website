import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * A clean media frame for the top-right container (Work + Theatre).
 *
 * Renders ONLY the raw image/video (via <Feed>) flush inside four corner
 * brackets — no titles, counters, directors, or HUD text. The wrapper fills
 * its container edge-to-edge so the media sits flush with zero offset gaps.
 */
export default function MediaFrame({ children }) {
  return (
    <Wrapper className="media-frame-wrapper">
      {children}
      <Corner $c="tl" aria-hidden="true" />
      <Corner $c="tr" aria-hidden="true" />
      <Corner $c="bl" aria-hidden="true" />
      <Corner $c="br" aria-hidden="true" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  /* Fills the top-right container flush (which is ~16:9), so the media never
     leaves gaps inside the brackets. */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
`;

/* Crossfade layer holding the raw <img>/<video>, object-fit: cover, flush. */
export const Feed = styled(motion.div)`
  position: absolute;
  inset: 0;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

/* Corner brackets anchored to the wrapper's corners (inset 0), zero gap. */
const Corner = styled.span`
  position: absolute;
  z-index: 2;
  width: 22px;
  height: 22px;
  pointer-events: none;
  border-color: rgba(245, 222, 179, 0.75);
  ${({ $c }) => $c === 'tl' && 'top: 0; left: 0; border-top: 1px solid; border-left: 1px solid;'}
  ${({ $c }) => $c === 'tr' && 'top: 0; right: 0; border-top: 1px solid; border-right: 1px solid;'}
  ${({ $c }) => $c === 'bl' && 'bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid;'}
  ${({ $c }) => $c === 'br' && 'bottom: 0; right: 0; border-bottom: 1px solid; border-right: 1px solid;'}
`;
