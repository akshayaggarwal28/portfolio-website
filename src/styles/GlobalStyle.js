import { createGlobalStyle } from 'styled-components';

/**
 * Global reset + base atmosphere for the cinematic dark theme.
 * Includes the film-grain overlay applied to the whole document body.
 */
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    /* Scroll is locked while the intro plays; unlocked once the name shows. */
    overflow: hidden;
  }
  html.intro-ready {
    overflow-y: auto;
    overflow-x: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }

  body {
    background: ${({ theme }) => theme.color.black};
    color: ${({ theme }) => theme.color.warmWhite};
    font-family: ${({ theme }) => theme.font.sans};
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  img, video {
    display: block;
    max-width: 100%;
  }

  /* Kill the native centre "start playback" / overlay play button on EVERY
     video (WebKit shows it whenever a clip isn't actively playing). Unscoped —
     some Safari builds silently DROP the rule when it's combined with a
     :not([...]) attribute selector, which is exactly why the button kept
     reappearing. The VideoModal keeps its control BAR (separate pseudo-element),
     so hiding just the centre overlay button here doesn't affect it. */
  video::-webkit-media-controls-start-playback-button,
  video::-webkit-media-controls-overlay-play-button {
    display: none !important;
    -webkit-appearance: none !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
  }

  /* Ambient loops (data-loop): strip ALL native chrome + block interaction so
     they read as pure background visuals — no bar, no timeline, no buttons. */
  video[data-loop] {
    pointer-events: none;
  }
  video[data-loop]::-webkit-media-controls,
  video[data-loop]::-webkit-media-controls-enclosure,
  video[data-loop]::-webkit-media-controls-panel,
  video[data-loop]::-webkit-media-controls-panel-container,
  video[data-loop]::-webkit-media-controls-overlay-enclosure {
    display: none !important;
    -webkit-appearance: none !important;
    opacity: 0 !important;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    background: ${({ theme }) => theme.color.gold};
    color: ${({ theme }) => theme.color.black};
  }

  /* Fixed film-grain layer that sits above the page for a filmic texture. */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 200;
    pointer-events: none;
    opacity: 0.04;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
`;
