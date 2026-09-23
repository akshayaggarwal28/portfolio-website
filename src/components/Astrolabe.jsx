import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Faint gold "astrolabe" / star-chart that sits behind the compass:
 * intersecting rings, a graduated tick ring, crosshair markers and scattered
 * stars — all drawn programmatically so the geometry stays clean.
 *
 * viewBox is 600×600 with the centre at (300,300), matching the compass dial.
 */
const CX = 300;
const CY = 300;
const GOLD = 'rgba(201, 169, 97, 0.9)';

// Polar → cartesian (0° = up, clockwise).
const pt = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

// Graduated tick ring: a longer tick every 30°, short ones every 6°.
const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);

// A few scattered "star" sparkles + crosshair markers (chart coordinates).
const STARS = [
  [70, 90, 1.6], [150, 60, 1], [500, 70, 1.4], [560, 200, 1],
  [40, 300, 1.2], [90, 470, 1], [520, 470, 1.5], [470, 540, 1],
  [300, 30, 1.2], [300, 570, 1], [250, 520, 0.9], [400, 120, 1.1],
];
const CROSSHAIRS = [
  [110, 200], [500, 330], [180, 500], [430, 470], [560, 120],
];

export default function Astrolabe() {
  return (
    <Wrap>
      <Svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        initial={{ opacity: 0, rotate: -8 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1], delay: 0.5 }}
      >
      {/* concentric rings — a couple intersecting/off-centre for the chart feel */}
      <circle cx={CX} cy={CY} r={70} className="ring" />
      <circle cx={CX} cy={CY} r={150} className="ring faint" />
      <circle cx={CX} cy={CY} r={205} className="ring" />
      <circle cx={CX} cy={CY} r={285} className="ring faint" />
      {/* intersecting off-centre rings, like overlapping orbits */}
      <circle cx={CX - 120} cy={CY + 20} r={230} className="ring faint" />
      <circle cx={CX + 150} cy={CY - 30} r={180} className="ring faint" />

      {/* graduated tick ring */}
      <g className="ticks">
        {TICKS.map((deg, i) => {
          const long = deg % 30 === 0;
          const [x1, y1] = pt(long ? 236 : 244, deg);
          const [x2, y2] = pt(252, deg);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* a dashed arc segment */}
      <path
        d={`M ${pt(255, 20)[0]} ${pt(255, 20)[1]} A 255 255 0 0 1 ${pt(255, 120)[0]} ${pt(255, 120)[1]}`}
        className="dashed"
      />

      {/* crosshair markers */}
      <g className="cross">
        {CROSSHAIRS.map(([x, y], i) => (
          <g key={i}>
            <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
          </g>
        ))}
      </g>

      {/* scattered stars */}
      <g className="stars">
        {STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      </Svg>
    </Wrap>
  );
}

/* Plain wrapper handles the centring so Framer's rotate on <Svg> can't
   clobber a CSS translate. */
const Wrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 170%;
  height: 170%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const Svg = styled(motion.svg)`
  width: 100%;
  height: 100%;
  overflow: visible;

  .ring {
    fill: none;
    stroke: ${GOLD};
    stroke-width: 1;
    opacity: 0.22;
  }
  .ring.faint {
    opacity: 0.1;
  }
  .ticks line {
    stroke: ${GOLD};
    stroke-width: 1;
    opacity: 0.3;
  }
  .dashed {
    fill: none;
    stroke: ${GOLD};
    stroke-width: 1;
    stroke-dasharray: 2 6;
    opacity: 0.35;
  }
  .cross line {
    stroke: ${GOLD};
    stroke-width: 1;
    opacity: 0.4;
  }
  .stars circle {
    fill: ${GOLD};
    opacity: 0.55;
  }
`;
