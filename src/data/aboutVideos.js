/**
 * About video gallery.
 *
 * Short, muted, web-optimized montage loops that autoplay in each tile (a
 * showreel wall). Downscaled so they inline cleanly into the single-file build.
 *
 * Reorder this array to reorder the gallery — index 0 is the L-grid feature.
 * `position` is the object-position focal point for the cover crop.
 *
 * Sources: loop-1 raunak_v1 · loop-2 ekam_s2 · loop-3 chanakya (tight face
 * crop) · loop-5 madhav.  ("azhar" and "TACO6" removed per request.)
 */
import loop1 from '../assets/media/about-videos/loop-1.mp4';
import loop2 from '../assets/media/about-videos/loop-2.mp4';
import loop3 from '../assets/media/about-videos/loop-3.mp4';
import loop5 from '../assets/media/about-videos/loop-5.mp4';

export const aboutVideos = [
  { src: loop1, position: 'center 35%' }, // feature (2×2 anchor of the L)
  { src: loop2, position: 'center' },
  { src: loop3, position: 'center' },
  { src: loop5, position: 'center' },
];
