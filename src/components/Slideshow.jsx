import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { portraits } from '../data/content';

/**
 * Section 1 · Right column.
 * Full-bleed portrait slideshow with a slow, continuous cross-fade.
 *
 * All portraits are stacked absolutely and the active one is faded in via a
 * CSS opacity transition. Using CSS (not a JS/rAF animation) means the active
 * image always resolves to opacity 1 even if the tab is backgrounded or the
 * user prefers reduced motion — so the hero is never blank.
 *
 * Per-image grade: each portrait gets its own colour treatment so it reads
 * like a high-end headshot. Keyed by slideshow index (hero-1 → hero-4);
 * anything beyond the list falls back to DEFAULT_STYLE.
 */
// About hero portraits (hero-1..3), each with its own grade + focal point so
// the crop favours the face/subject and never cuts the head off.
const IMAGE_STYLES = [
  // 1 · SIGNATURE (akshay.JPG) — warm, approachable smiling close-up.
  { filter: 'brightness(1.04) contrast(1.08) saturate(1.05)', position: 'center 32%' },
  // 2 · B&W dramatic leaning portrait — intense; face centred by the crop.
  { filter: 'brightness(1.05) contrast(1.2)', position: 'center 40%' },
  // 3 · Floor performance (landscape) — dynamic diagonal pose; warm lift.
  {
    filter: 'brightness(1.06) contrast(1.1) saturate(1.08)',
    position: 'center 42%',
  },
];

const DEFAULT_STYLE = {
  filter: 'contrast(1.05) saturate(1.02)',
  position: 'center 30%',
};

export default function Slideshow({
  images = portraits,
  imageStyles = IMAGE_STYLES,
  interval = 5200,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <Frame>
      {images.map((src, i) => {
        const style = imageStyles[i] ?? DEFAULT_STYLE;
        return (
          <Photo
            key={i}
            src={src}
            alt=""
            $active={i === index}
            $filter={style.filter}
            $position={style.position}
            aria-hidden={i !== index}
          />
        );
      })}

      {/* Cinematic vignette + soft left fade so the seam with the compass
          column stays smooth. */}
      <Vignette />
    </Frame>
  );
}

/**
 * The slideshow container. It strictly fills its parent cell (the hero's
 * right column) at exactly 100% × 100%, so every image shares one identical
 * box at every viewport size.
 */
const Frame = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.color.black};
`;

/**
 * Every portrait is the SAME source aspect ratio (4:5), stacked in the same
 * box, and each fills it with width/height 100% + object-fit: cover. Because
 * the sources are uniform, all slides scale identically at any window size —
 * no image zooms differently or pops to a different size on resize.
 */
const Photo = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Per-image vertical framing (headspace) — kept intact. */
  object-position: ${({ $position }) => $position};
  /* Per-image colour grade (see IMAGE_STYLES). */
  filter: ${({ $filter }) => $filter};

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 2.2s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
      90deg,
      ${({ theme }) => theme.color.black} 0%,
      rgba(0, 0, 0, 0.22) 12%,
      transparent 38%
    ),
    radial-gradient(
      130% 100% at 65% 42%,
      transparent 68%,
      rgba(0, 0, 0, 0.32) 100%
    );
`;
