import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Delicate vertical ruler on the far-left edge of the hero (Section TWO):
 * a thin line with graduated tick marks and the numbers 20 / 10 / 05 stacked
 * top-to-bottom, matching the reference.
 */
const TICKS = Array.from({ length: 25 }, (_, i) => i); // 24 gaps
const LABELS = { 3: '20', 12: '10', 21: '05' }; // which ticks get a number

export default function VerticalScale() {
  return (
    // Non-motion wrapper owns the centring transform so Framer's x-animation
    // on <Scale> can't override it.
    <Positioner>
      <Scale
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 1.4 }}
      >
        <Line />
        <Ticks>
          {TICKS.map((i) => {
            const label = LABELS[i];
            const major = Boolean(label) || i % 3 === 0;
            return (
              <Row key={i}>
                <Tick $major={major} />
                {label && <Num>{label}</Num>}
              </Row>
            );
          })}
        </Ticks>
      </Scale>
    </Positioner>
  );
}

const Positioner = styled.div`
  position: absolute;
  left: 1.6vw;
  top: 50%;
  transform: translateY(-50%);
  height: 38vh;
  max-height: 360px;
  pointer-events: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Scale = styled(motion.div)`
  display: flex;
  align-items: stretch;
  gap: 10px;
  height: 100%;
`;

const Line = styled.div`
  width: 1px;
  background: linear-gradient(
    ${({ theme }) => theme.color.line},
    rgba(201, 169, 97, 0.35),
    ${({ theme }) => theme.color.line}
  );
`;

const Ticks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Tick = styled.span`
  display: block;
  height: 1px;
  width: ${({ $major }) => ($major ? '10px' : '5px')};
  background: rgba(201, 169, 97, ${({ $major }) => ($major ? 0.6 : 0.3)});
`;

const Num = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 11px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.color.gray};
`;
