import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCompass } from '../context/CompassContext';

/**
 * Text-only preview for categories flagged `textOnly` (e.g. Theatre).
 * Renders the category's items as a clean numbered list — title + detail
 * line(s) — with no images, thumbnails or media containers. Inherits the
 * site's serif/sans typography and gold accents for consistency with Work.
 */
export default function TextList() {
  const { category } = useCompass();
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <Panel
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <Eyebrow>{category.label}</Eyebrow>

      <List>
        {category.items.map((it, i) => (
          <Row key={it.id} tabIndex={0}>
            <Num>{pad(i + 1)}</Num>
            <Info>
              <RowTitle>{it.title}</RowTitle>
              {it.lines &&
                it.lines.map((line, j) => <RowLine key={j}>{line}</RowLine>)}
            </Info>
          </Row>
        ))}
      </List>
    </Panel>
  );
}

const Panel = styled(motion.section)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 2.4vh ${({ theme }) => theme.gutter};

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
  margin-bottom: 1.2vh;
  flex: none;
`;

const List = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 900px) {
    gap: 4vh;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: clamp(16px, 2vw, 32px);
  padding: 0.5vh 0;
  border-top: 1px solid ${({ theme }) => theme.color.line};
  cursor: default;
  transition: border-color 0.4s ${({ theme }) => theme.ease};

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.color.goldDeep};
    outline: none;
  }

  &:hover h3,
  &:focus-visible h3 {
    color: ${({ theme }) => theme.color.gold};
  }
`;

const Num = styled.span`
  flex: none;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.color.goldDeep};
  padding-top: 0.4em;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RowTitle = styled.h3`
  font-family: ${({ theme }) => theme.font.serif};
  font-weight: 500;
  font-size: clamp(1.3rem, 2.4vw, 2rem);
  line-height: 1.05;
  color: ${({ theme }) => theme.color.warmWhite};
  transition: color 0.4s ${({ theme }) => theme.ease};
`;

const RowLine = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.gray};
`;
