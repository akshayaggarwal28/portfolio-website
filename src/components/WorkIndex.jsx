import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * WORK · lower "screening index".
 *
 * Replaces the media+details split for Work. Each project is a row; hovering
 * (or focusing) a row selects it, which drives the top-right viewfinder — so
 * the CD scans the list and watches each reel play above without a click.
 * Clicking a row that has a trailer opens the full player (with sound).
 */
export default function WorkIndex({ onPlay }) {
  const { category, activeItem, selectItem } = useCompass();
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <Panel
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Eyebrow>{category.label}</Eyebrow>

      <Rows>
        {category.items.map((it, i) => (
          <Row
            key={it.id}
            $active={it.id === activeItem.id}
            onMouseEnter={() => selectItem(it.id)}
            onFocus={() => selectItem(it.id)}
            onClick={() => (it.trailer ? onPlay(it.trailer) : selectItem(it.id))}
            tabIndex={0}
            aria-label={it.trailer ? `Play ${it.title}` : it.title}
          >
            <Num>{pad(i + 1)}</Num>
            <Info>
              <RowTitle $active={it.id === activeItem.id}>{it.title}</RowTitle>
              {it.lines && it.lines.length > 0 && (
                <RowMeta>{it.lines.join('  ·  ')}</RowMeta>
              )}
            </Info>
            <Cue $live={Boolean(it.trailer)}>
              {it.trailer ? (
                <>
                  Watch <Play>▶</Play>
                </>
              ) : (
                'Still'
              )}
            </Cue>
          </Row>
        ))}
      </Rows>
    </Panel>
  );
}

const Panel = styled(motion.section)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 1.6vh ${({ theme }) => theme.gutter};

  @media (max-width: 900px) {
    height: auto;
    overflow: visible;
    padding: 6vh ${({ theme }) => theme.gutter};
  }
`;

const Eyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  margin-bottom: 1vh;
  flex: none;
`;

const Rows = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(16px, 2.2vw, 34px);
  padding: 1vh 0;
  border-top: 1px solid
    ${({ $active, theme }) => ($active ? theme.color.goldDeep : theme.color.line)};
  cursor: pointer;
  transition: border-color 0.4s ${({ theme }) => theme.ease};

  /* active/hover gold sweep on the left edge */
  &::before {
    content: '';
    position: absolute;
    left: -${({ theme }) => theme.gutter};
    top: -1px;
    height: 1px;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.color.gold},
      transparent
    );
    transition: width 0.5s ${({ theme }) => theme.ease};
  }

  &:last-child {
    border-bottom: 1px solid
      ${({ $active, theme }) =>
        $active ? theme.color.goldDeep : theme.color.line};
  }
`;

const Num = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.color.goldDeep};
`;

const Info = styled.div`
  min-width: 0;
`;

const RowTitle = styled.h3`
  font-family: ${({ theme }) => theme.font.serif};
  font-weight: 500;
  font-size: clamp(1.3rem, 2.6vw, 2.1rem);
  line-height: 1.04;
  color: ${({ $active, theme }) =>
    $active ? theme.color.gold : theme.color.warmWhite};
  transition: color 0.4s ${({ theme }) => theme.ease};

  ${Row}:hover &,
  ${Row}:focus-visible & {
    color: ${({ theme }) => theme.color.gold};
  }
`;

const RowMeta = styled.p`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 11px;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Cue = styled.span`
  flex: none;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${({ $live, theme }) =>
    $live ? theme.color.gold : theme.color.grayDim};
  opacity: 0.85;
`;

const Play = styled.span`
  font-size: 8px;
`;
