import styled from 'styled-components';
import Footer from './Footer';

/**
 * Page shell — a single, non-scrolling screen.
 * The whole app is locked to 100vh: a Main grid that splits into the hero row
 * and the preview row, and a compact Footer. Nothing scrolls on desktop (the
 * mobile fallback below allows normal stacking). (The "AA" monogram header was
 * removed per request.)
 */
export default function Layout({ children }) {
  return (
    <Shell>
      <Main>{children}</Main>
      <Footer />
    </Shell>
  );
}

const Shell = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: radial-gradient(
      120% 80% at 80% 0%,
      ${({ theme }) => theme.color.charcoal} 0%,
      ${({ theme }) => theme.color.black} 60%
    );

  @media (max-width: 900px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* The lower (preview / About) row now takes the larger share so the video
     gallery + content get more height; combined with the trimmed footer, that
     is the reclaimed vertical space being handed to the main content. The hero
     row keeps enough room for the compass + portrait. Stays within 100vh. */
  grid-template-rows: 1fr 1.12fr;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;
