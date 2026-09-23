import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * Renders inline `*italic*` markers as <em> without pulling in a full markdown
 * parser. Plain text (no markers) is returned unchanged.
 */
function italicize(text) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    )
  );
}

/**
 * Section 4 · Lower-right — project details, linked to Section 3.
 * Shows the active item's title + metadata, a "Watch" button (when the item
 * has a video), and a thumbnail strip of the category's projects. Clicking a
 * thumbnail selects that project — and if it has a video, plays it inline via
 * the shared onPlay handler. No trailer → no button (e.g. Chiranjeevi Hanuman).
 */
export default function PreviewDetails({ onPlay }) {
  const { category, activeItem, selectItem } = useCompass();

  const openThumb = (it) => {
    selectItem(it.id);
    if (it.trailer) onPlay(it.trailer);
  };

  return (
    <Panel>
      <div>
        <Eyebrow>{category.label}</Eyebrow>

        <AnimatePresence mode="wait">
          <Content
            key={activeItem.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {activeItem.title && <Title>{activeItem.title}</Title>}

            <Meta>
              {activeItem.lines ? (
                // Ordered detail lines (Work / Theatre) with inline *italics*.
                activeItem.lines.map((line, i) => (
                  <span key={i}>{italicize(line)}</span>
                ))
              ) : (
                <>
                  {activeItem.company && <MetaHead>{activeItem.company}</MetaHead>}
                  {activeItem.director && <span>{activeItem.director}</span>}
                  {activeItem.platform && <span>{activeItem.platform}</span>}
                </>
              )}
            </Meta>

            {activeItem.location && <Location>{activeItem.location}</Location>}

            {activeItem.trailer && (
              <TrailerBtn onClick={() => onPlay(activeItem.trailer)}>
                Watch <Play>▶</Play>
              </TrailerBtn>
            )}
          </Content>
        </AnimatePresence>
      </div>

      {/* Right-side thumbnail strip — hidden for single-item sections (About). */}
      {category.items.length > 1 && (
        <Strip>
          {category.items.map((it) => (
            <Thumb
              key={it.id}
              $active={it.id === activeItem.id}
              style={{
                backgroundImage: it.still ? `url(${it.still})` : 'none',
                backgroundPosition: it.objectPosition || 'center',
              }}
              onClick={() => openThumb(it)}
              aria-label={it.trailer ? `Play ${it.title}` : it.title}
            />
          ))}
        </Strip>
      )}
    </Panel>
  );
}

const Panel = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 30px;
  height: 100%;
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

const Eyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  margin-bottom: 14px;
`;

const Content = styled(motion.div)``;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-weight: 500;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  line-height: 1;
  color: ${({ theme }) => theme.color.warmWhite};
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.gray};
`;

/* Standalone one-line location note (Contact section). */
const Location = styled.p`
  margin-top: 16px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.gray};
`;

/* The production-house line — emphasized, when present. */
const MetaHead = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  color: ${({ theme }) => theme.color.warmWhite};
`;

const TrailerBtn = styled.button`
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 12px 24px;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.warmWhite};
  border: 1px solid ${({ theme }) => theme.color.line};
  transition: all 0.35s ${({ theme }) => theme.ease};

  &:hover {
    color: ${({ theme }) => theme.color.gold};
    border-color: ${({ theme }) => theme.color.goldDeep};
    background: rgba(245, 222, 179, 0.04);
  }
`;

const Play = styled.span`
  color: ${({ theme }) => theme.color.gold};
  font-size: 9px;
`;

const Strip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Thumb = styled.button`
  width: 92px;
  height: clamp(40px, 7vh, 58px);
  flex: none;
  background-size: cover;
  background-position: center;
  /* Blank placeholder fill for plays without an image yet. */
  background-color: ${({ theme }) => theme.color.panel};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.color.gold : theme.color.line};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.3s ${({ theme }) => theme.ease},
    border-color 0.3s ${({ theme }) => theme.ease};

  &:hover {
    opacity: 1;
  }
`;
