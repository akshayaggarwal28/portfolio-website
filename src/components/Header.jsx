import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Fixed top bar: "AA" monogram (left).
 */
export default function Header() {
  return (
    <Bar
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.4 }}
    >
      <Brand>AA</Brand>
    </Bar>
  );
}

const Bar = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px ${({ theme }) => theme.gutter};
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const Brand = styled.div`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 20px;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.color.gold};
`;
