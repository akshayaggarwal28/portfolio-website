import styled from 'styled-components';
import Compass from './Compass';
import Slideshow from './Slideshow';
import VerticalScale from './VerticalScale';
import WorkViewfinder from './WorkViewfinder';
import TheatreStage from './TheatreStage';
import TrainingStage from './TrainingStage';
import StillsFeature from './StillsFeature';
import { useCompass } from '../context/CompassContext';

/**
 * Section 1 — the upper half of the screen.
 * Left column (50%, "Section TWO"): the astrolabe compass nav + far-left
 * vertical scale, over a faint cosmic starfield.
 * Right column (50%, "Section ONE"): a CONTEXT STAGE driven by the compass.
 * The portrait slideshow is the resting / About visual; each compass point
 * swaps in a panel tailored to that discipline:
 *   Work    → "Now Playing" viewfinder
 *   Theatre → production media frame
 *   Training→ workshop-photo slideshow
 */
const STAGES = {
  work: WorkViewfinder,
  theatre: TheatreStage,
  contact: TrainingStage,
  stills: StillsFeature,
};

export default function HeroSection() {
  const { activeCategory } = useCompass();
  const Stage = STAGES[activeCategory] || Slideshow;

  return (
    <Hero>
      <Left>
        <StarField />
        <VerticalScale />
        <Compass />
      </Left>

      <Right>
        <Stage />
      </Right>
    </Hero>
  );
}

const Hero = styled.section`
  position: relative;
  display: grid;
  /* Two equal halves: compass | image. Right column === 50% of the page. */
  grid-template-columns: 1fr 1fr;
  /* Fills its grid row in the single-page layout. */
  height: 100%;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 60vh;
    overflow: visible;
  }
`;

const Left = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Top padding clears the fixed header; the image half ignores it. */
  padding: 84px ${({ theme }) => theme.gutter} 2vh;

  @media (max-width: 900px) {
    padding: 14vh ${({ theme }) => theme.gutter} 8vh;
  }
`;

/**
 * Faint scattered gold stars for the cosmic / star-chart backdrop. Each
 * radial-gradient is a single tiny star; kept low-opacity so it reads as
 * atmosphere behind the compass.
 */
const StarField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image: radial-gradient(1.4px 1.4px at 12% 22%, rgba(201, 169, 97, 0.9), transparent),
    radial-gradient(1px 1px at 28% 68%, rgba(201, 169, 97, 0.7), transparent),
    radial-gradient(1.6px 1.6px at 46% 14%, rgba(245, 222, 179, 0.8), transparent),
    radial-gradient(1px 1px at 62% 82%, rgba(201, 169, 97, 0.6), transparent),
    radial-gradient(1.3px 1.3px at 78% 34%, rgba(201, 169, 97, 0.8), transparent),
    radial-gradient(1px 1px at 88% 60%, rgba(245, 222, 179, 0.6), transparent),
    radial-gradient(1.2px 1.2px at 8% 84%, rgba(201, 169, 97, 0.6), transparent),
    radial-gradient(1px 1px at 36% 92%, rgba(201, 169, 97, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 70% 8%, rgba(245, 222, 179, 0.7), transparent),
    radial-gradient(1px 1px at 92% 20%, rgba(201, 169, 97, 0.6), transparent);
`;

const Right = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 64vh;
    min-height: 64vh;
  }
`;
