import styled from 'styled-components';
import { contactInfo } from '../data/content';

/**
 * Footer — a full-width bar split into four equal segments separated by
 * subtle vertical lines, matching refernce.png:
 *   Instagram · IMDb · Email · Phone
 * Each segment is a centered gold icon above grey text, and the whole
 * segment is a link.
 */
export default function Footer() {
  return (
    <Foot>
      <Seg href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
        <InstagramIcon />
        <Label>Instagram</Label>
      </Seg>

      <Seg href={contactInfo.imdb} target="_blank" rel="noopener noreferrer">
        <Badge>IMDb</Badge>
        <Label>IMDB</Label>
      </Seg>

      <Seg href={`mailto:${contactInfo.email}`}>
        <MailIcon />
        <Label>{contactInfo.email.toUpperCase()}</Label>
      </Seg>

      <Seg href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
        <PhoneIcon />
        <Label>{contactInfo.phone}</Label>
      </Seg>
    </Foot>
  );
}

/* ── inline gold icons ─────────────────────────────────────────────── */
const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const InstagramIcon = () => (
  <svg {...iconProps}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="M3 6l9 6 9-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);

/* ── layout ────────────────────────────────────────────────────────── */
const Foot = styled.footer`
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid ${({ theme }) => theme.color.line};
  background: ${({ theme }) => theme.color.black};

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Seg = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  /* Absolute-minimum footer — hairline padding, just legible. Every pixel
     reclaimed here is handed to the main content + video gallery (Layout.jsx). */
  padding: 2px 16px 3px;
  text-align: center;
  color: ${({ theme }) => theme.color.goldDeep};
  transition: color 0.3s ${({ theme }) => theme.ease};

  /* Subtle vertical dividers between segments (not after the last). */
  border-right: 1px solid ${({ theme }) => theme.color.line};
  &:last-child {
    border-right: none;
  }

  &:hover {
    color: ${({ theme }) => theme.color.gold};
  }

  @media (max-width: 700px) {
    &:nth-child(2) {
      border-right: none;
    }
  }
`;

const Label = styled.span`
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gray};
`;

/* Gold "IMDb" pill to stand in for the wordmark, mirroring the reference. */
const Badge = styled.span`
  display: inline-grid;
  place-items: center;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.color.black};
  background: ${({ theme }) => theme.color.gold};
  border-radius: 3px;
`;
