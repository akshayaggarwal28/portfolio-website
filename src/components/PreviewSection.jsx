import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PreviewMedia from './PreviewMedia';
import PreviewDetails from './PreviewDetails';
import TextList from './TextList';
import AboutPanel from './AboutPanel';
import WorkIndex from './WorkIndex';
import TheatreList from './TheatreList';
import TrainingTimeline from './TrainingTimeline';
import StillsGrid from './StillsGrid';
import VideoModal from './VideoModal';
import { useCompass } from '../context/CompassContext';

/**
 * Sections 3 + 4 (lower half of the screen).
 * Image-based categories (Work) render the media + details split; categories
 * flagged `textOnly` (Theatre) render a clean text list instead — no images.
 * Owns the inline video-player state for the image layout.
 */
export default function PreviewSection() {
  const { category } = useCompass();
  const [videoSrc, setVideoSrc] = useState(null);

  if (category.customAbout) {
    return <AboutPanel />;
  }

  // Work: the reel plays in the top-right viewfinder; here we list the
  // projects as a screening index that drives it on hover.
  if (category.viewfinder) {
    return (
      <>
        <WorkIndex onPlay={setVideoSrc} />
        <VideoModal src={videoSrc} onClose={() => setVideoSrc(null)} />
      </>
    );
  }

  // Theatre: the spotlight stage sits top-right; here is the playbill index.
  if (category.stage) {
    return <TheatreList />;
  }

  // Training / Workshops: the skill astrolabe sits top-right; here is the
  // chronological training/workshop timeline.
  if (category.training) {
    return <TrainingTimeline />;
  }

  // Stills: featured still sits top-right; here is the thumbnail grid + lightbox.
  if (category.stillsGallery) {
    return <StillsGrid />;
  }

  if (category.textOnly) {
    return <TextList />;
  }

  return (
    <>
      <Grid
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <PreviewMedia onPlay={setVideoSrc} />
        <PreviewDetails onPlay={setVideoSrc} />
      </Grid>

      <VideoModal src={videoSrc} onClose={() => setVideoSrc(null)} />
    </>
  );
}

const Grid = styled(motion.section)`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 4vw;
  align-items: stretch;
  /* Fills its grid row; internal content is sized to fit (no scroll). */
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 1.6vh ${({ theme }) => theme.gutter} 1.6vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 6vh;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 6vh ${({ theme }) => theme.gutter};
  }
`;
