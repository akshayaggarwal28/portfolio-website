import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { CompassProvider } from './context/CompassContext';

import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import PreviewSection from './components/PreviewSection';
import Intro from './components/Intro';

/**
 * App root.
 *
 * The portfolio homepage is pinned in a fixed layer; the <Intro> splash sits
 * on top of it. On scroll the intro dissolves in place (fade + tiny zoom, no
 * slide), unveiling the homepage that was underneath all along. <ScrollDriver>
 * simply gives the page one viewport of scroll height to run that reveal.
 */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <CompassProvider>
        {/* homepage — pinned beneath the intro */}
        <Homepage>
          <Layout>
            <HeroSection />
            <PreviewSection />
          </Layout>
        </Homepage>

        {/* opening splash — dissolves away on scroll */}
        <Intro />

        {/* invisible: provides the scroll distance for the reveal */}
        <ScrollDriver aria-hidden="true" />
      </CompassProvider>
    </ThemeProvider>
  );
}

const Homepage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;

  /* On mobile the portfolio stacks and scrolls, so let it flow normally. */
  @media (max-width: 900px) {
    position: relative;
    inset: auto;
  }
`;

const ScrollDriver = styled.div`
  height: 200vh;
  width: 100%;
  pointer-events: none;

  @media (max-width: 900px) {
    display: none;
  }
`;
