import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useCompass } from '../context/CompassContext';
import MediaFrame, { Feed } from './MediaFrame';

/**
 * THEATRE · top-right media frame.
 *
 * Shows the active production's still, object-fit: cover and flush inside the
 * corner brackets — no title/programme overlays (those live in the playbill
 * index below). Portrait stills use `object-position: center 25%` so the crop
 * favours the upper subject instead of cutting heads off. A production without
 * a still shows a bare dark frame.
 */
export default function TheatreStage() {
  const { activeItem } = useCompass();

  return (
    <MediaFrame>
      <AnimatePresence>
        <Feed
          key={activeItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {activeItem.still ? (
            <img
              src={activeItem.still}
              alt=""
              style={{ objectPosition: activeItem.objectPosition || 'center 25%' }}
            />
          ) : (
            <Bare />
          )}
        </Feed>
      </AnimatePresence>
    </MediaFrame>
  );
}

/* Bare dark frame for a production with no still yet. */
const Bare = styled.div`
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0px,
    rgba(255, 255, 255, 0.02) 2px,
    transparent 2px,
    transparent 28px
  );
`;
