import Slideshow from './Slideshow';
import { trainingImages } from '../data/content';

/**
 * TRAINING / WORKSHOPS · top-right visual.
 *
 * A slow cross-fade of the actual training/workshop photographs (teaching a
 * workshop, physical performance work) — the literal subject of this section,
 * paired with the training timeline below. Reuses the hero Slideshow with a
 * Training-specific image set + focal points.
 */
const STYLES = [
  // 1 · Workshop with audience (square) — drop the crop to the stage + crowd.
  { filter: 'brightness(1.06) contrast(1.06) saturate(1.04)', position: 'center 72%' },
  // 2 · Physical / fire performance (square) — lift to the screaming face up top.
  { filter: 'brightness(1.05) contrast(1.12) saturate(1.06)', position: 'center 14%' },
];

export default function TrainingStage() {
  return <Slideshow images={trainingImages} imageStyles={STYLES} interval={5600} />;
}
