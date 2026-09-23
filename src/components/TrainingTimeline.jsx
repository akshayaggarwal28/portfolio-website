import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * TRAINING / WORKSHOPS · lower timeline.
 *
 * The actor's training history as a chronological timeline on a gold rail —
 * the scannable record beneath the interactive skill astrolabe (top-right).
 */
export default function TrainingTimeline() {
  const { category } = useCompass();
  const timeline = category.timeline || [];

  return (
    <Panel
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Eyebrow>{category.label}</Eyebrow>

      <Rail>
        {timeline.map((t, i) => (
          <Item key={i}>
            <Dot />
            <Years>{t.years}</Years>
            <Detail>{t.detail}</Detail>
          </Item>
        ))}
      </Rail>
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

/* Vertical gold rail behind the year markers. */
const Rail = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20px;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.color.goldDeep},
      rgba(169, 136, 79, 0.15)
    );
  }
`;

const Item = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: clamp(78px, 8vw, 108px) 1fr;
  align-items: baseline;
  gap: clamp(14px, 1.6vw, 26px);
  padding: 0.55vh 0;
`;

const Dot = styled.span`
  position: absolute;
  left: -20px;
  top: 0.75em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.gold};
  box-shadow: 0 0 8px 1px rgba(245, 222, 179, 0.5);
  transform: translateX(0.5px);
`;

const Years = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: clamp(12px, 1vw, 14px);
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.gold};
  white-space: nowrap;
`;

const Detail = styled.span`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: clamp(1rem, 1.7vw, 1.4rem);
  line-height: 1.15;
  color: ${({ theme }) => theme.color.warmWhite};
`;
