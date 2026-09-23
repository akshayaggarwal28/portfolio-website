/**
 * Central design tokens for the whole site.
 * Consumed via <ThemeProvider theme={theme}> so every styled-component
 * can read `props.theme.*`. Change a value here → it changes everywhere.
 */
export const theme = {
  color: {
    black: '#000000',
    charcoal: '#0b0b0a',
    panel: '#121110',
    // Wheat / gold accent (requested #F5DEB3) plus a warmer lit variant.
    gold: '#F5DEB3',
    goldLit: '#e8c987',
    goldDeep: '#a9884f',
    // Warm off-white for large serif copy, dark gray for secondary text.
    warmWhite: '#efe8db',
    gray: '#A9A9A9',
    grayDim: '#6b6b6b',
    line: 'rgba(245, 222, 179, 0.10)',
  },
  font: {
    serif: "'Playfair Display', Georgia, serif",
    display: "'Cinzel', 'Playfair Display', serif",
    sans: "'Montserrat', 'Lato', -apple-system, sans-serif",
  },
  ease: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  gutter: '5vw',
  // Framer Motion easing as an array (same curve, reusable in JS animations).
  motionEase: [0.22, 0.61, 0.36, 1],
};
