import { AnimatePresence } from 'framer-motion';
import { useCompass } from '../context/CompassContext';
import MediaFrame, { Feed } from './MediaFrame';
import LoopVideo from './LoopVideo';

/**
 * WORK · top-right media frame.
 *
 * Renders the active project's trailer (native autoplay, muted, looping, zero
 * chrome via LoopVideo) or — for a project without one — its key still, both
 * object-fit: cover and flush inside the corner brackets. No text overlays: the
 * title/director/counter all live in the screening index below.
 */
export default function WorkViewfinder() {
  const { activeItem } = useCompass();
  const hasVideo = Boolean(activeItem.trailer);

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
          {hasVideo ? (
            <LoopVideo src={activeItem.trailer} />
          ) : (
            <img
              src={activeItem.still}
              alt=""
              style={{ objectPosition: activeItem.objectPosition || 'center' }}
            />
          )}
        </Feed>
      </AnimatePresence>
    </MediaFrame>
  );
}
