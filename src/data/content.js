/**
 * Single source of truth for all site content.
 *
 * The Compass has four points; each maps to a `category` key below.
 * Sections 3 (PreviewMedia) and 4 (PreviewDetails) read from
 * `categories[activeCategory]` — so hovering the Compass simply changes
 * which slice of this object is rendered. Add/edit real credits here.
 *
 * Assets are imported (not string paths) so the bundler can inline them
 * for the self-contained single-file build.
 */
import hanuman from '../assets/media/hanuman.jpg';
import patiPatni2 from '../assets/media/pati-patni-still.jpg';
import patiPatni2Video from '../assets/media/pati_patni_2.mp4';
import tajThumbnail from '../assets/media/taj_thumbnail.jpg';
import tajMedia from '../assets/media/taj_media.mp4';
import introVideo from '../assets/media/intro_video.mp4';
import introPoster from '../assets/media/intro_poster.jpg';
import britannia5050Video from '../assets/media/britannia_5050.mp4';
import britannia5050Poster from '../assets/media/britannia_5050.jpg';

export const identity = {
  firstName: 'Akshay',
  lastName: 'Aggarwal',
  role: 'Actor',
  location: 'Mumbai, India',
  tagline: 'Step into the world of stories',
};

// Portrait slideshow images for the hero (Section 1, right quadrant).
// Swap these for high-res cinematic portraits when available.
/**
 * Hero portrait slideshow images.
 *
 * These are auto-loaded from `src/assets/hero/` and sorted by filename, so
 * dropping in `hero-1.jpg`, `hero-2.jpg`, … wires them into the slideshow in
 * that exact order — no code change needed. If the folder is empty we fall
 * back to the older portraits so the build never breaks.
 */
const heroGlob = import.meta.glob('../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
});
const heroImages = Object.keys(heroGlob)
  .sort()
  .map((key) => heroGlob[key]);

export const portraits = heroImages;

/**
 * Training / Workshops photos (top-right slideshow for that section). Drop
 * files into `src/assets/media/training-pics/` — auto-loaded, sorted, inlined.
 */
const trainingGlob = import.meta.glob(
  '../assets/media/training-pics/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);
export const trainingImages = Object.keys(trainingGlob)
  .sort()
  .map((key) => trainingGlob[key]);

/**
 * Stills gallery photos (the professional catalog: headshot, editorial,
 * character, cinematic). Drop files into `src/assets/media/stills/` — sorted,
 * inlined. Each becomes a gallery item + lightbox image.
 */
const stillsGlob = import.meta.glob(
  '../assets/media/stills/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);
export const stillsImages = Object.keys(stillsGlob)
  .sort()
  .map((key) => stillsGlob[key]);

/**
 * Theatre play stills. Drop image files into `src/assets/media/theatre-plays/`
 * named `romi-julie`, `macchli`, `muggy-night`, `bichchoo` (any web format) and
 * they're auto-loaded + inlined. A missing file resolves to '' and renders as
 * a blank placeholder frame — no broken image icon.
 */
const theatreGlob = import.meta.glob(
  '../assets/media/theatre-plays/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);
const theatreStill = (name) => {
  const key = Object.keys(theatreGlob).find((k) =>
    k.toLowerCase().includes(`/${name}.`)
  );
  return key ? theatreGlob[key] : '';
};

/**
 * About-section gallery. Drop images into `src/assets/media/about-me/` and
 * they're auto-loaded (sorted by filename) + inlined into the build. Each
 * entry carries its base `name`, so a per-photo focal point can be applied.
 */
const aboutGlob = import.meta.glob(
  '../assets/media/about-me/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

// Optional per-photo focal point (object-position). Falls back to 'center 30%'.
// Screenshots are wide/letterboxed; these focal points crop to the subject.
const ABOUT_FOCAL = {
  'about-1': '60% 40%', // bloodied close-up — subject sits right & high in frame
  'about-2': '50% 52%', // calm wide shot — subject centred, slightly low
};

export const aboutGallery = Object.keys(aboutGlob)
  .sort()
  .map((key) => {
    const name = key.split('/').pop().replace(/\.[^.]+$/, '');
    return {
      src: aboutGlob[key],
      position: ABOUT_FOCAL[name] || 'center 30%',
    };
  });

/**
 * Category content. Each category owns an eyebrow label + a list of `items`.
 * An item drives BOTH the big preview (Section 3) and the detail panel
 * (Section 4). Fields:
 *   title, still (16:9 image), company, director, platform, trailer (optional)
 */
export const categories = {
  work: {
    label: 'Recent Work',
    viewfinder: true, // top-right "Now Playing" monitor + screening index below
    items: [
      {
        id: 'chiranjeevi-hanuman',
        title: 'Chiranjeevi Hanuman',
        still: hanuman,
        lines: ['Directed by Rajesh Mapuskar ~ 2026'],
        trailer: '',
      },
      {
        id: 'pati-patni-aur-woh-2',
        title: 'Pati Patni Aur Woh Do',
        still: patiPatni2,
        lines: ['Directed by Mudassar Aziz ~ 2026', 'T-Series'],
        trailer: patiPatni2Video,
      },
      {
        id: 'taj',
        title: 'TAJ (Season 01 & 02)',
        still: tajThumbnail,
        lines: [
          'Directed by Ron Scalpello ~ 2023',
          'BBC Studios & Contiloe Pictures',
          'Zee5',
        ],
        trailer: tajMedia,
      },
      {
        id: 'britannia-5050',
        title: '50·50 · Britannia',
        still: britannia5050Poster,
        lines: ['Television Commercial', 'Britannia'],
        trailer: britannia5050Video,
      },
    ],
  },

  theatre: {
    label: 'On The Stage',
    stage: true, // spotlight stage (top-right) + playbill index below
    items: [
      {
        id: 'romi-julie',
        title: 'Romi Julie',
        still: theatreStill('romi-julie'),
        lines: ['Adaptation of *Romeo & Juliet* in Haryanvi'],
        trailer: '',
      },
      {
        id: 'macchli-jal-ki-rani-hai',
        title: 'Macchli Jal Ki Rani Hai',
        still: theatreStill('macchli'),
        lines: ['Adaptation of *The Mousetrap* by Agatha Christie'],
        trailer: '',
      },
      {
        id: 'on-a-muggy-night-in-mumbai',
        title: 'On a Muggy Night in Mumbai',
        still: theatreStill('muggy-night'),
        // Shift the crop left so the actor stays in frame on this wide photo.
        objectPosition: '25% center',
        lines: ['By Mahesh Dattani'],
        trailer: '',
      },
      {
        id: 'bichchoo',
        title: 'Bichchoo',
        still: theatreStill('bichchoo'),
        lines: ['Hindi adaptation of *Les Fourberies de Scapin* by Molière'],
        trailer: '',
      },
      {
        id: 'main-bhi-bachchan',
        title: 'Main Bhi Bachchan',
        still: '', // blank placeholder — image to be added later
        lines: ['Directed by Mohit Tripathi', '*among others*'],
        trailer: '',
      },
    ],
  },

  about: {
    label: 'The Actor',
    customAbout: true, // custom layout: intro video + bio + gallery
    items: [
      {
        id: 'about',
        title: '',
        still: '',
        inlineVideo: introVideo, // plays inline in the main visual area
        poster: introPoster, // frame shown before the video plays
        lines: [
          'Trained in Stage & Screen',
          'Hindi · English · Haryanavi dialect',
          'MMA · Horse Riding',
        ],
        trailer: '',
      },
    ],
  },

  stills: {
    label: 'Stills',
    stillsGallery: true, // featured still (top-right) + thumbnail grid + lightbox
    // Per-still focal point (so the head/subject is never cropped in a tile)
    // + an editorial category label. Order follows still-1..5 by filename.
    items: stillsImages.map((src, i) => {
      const meta = [
        { position: 'center 30%', label: 'Headshot' },
        { position: 'center 28%', label: 'Editorial' },
        { position: 'center 22%', label: 'Character' },
        { position: 'center 28%', label: 'Cinematic' },
        { position: 'center 12%', label: 'Physical' },
      ][i] || { position: 'center 30%', label: 'Still' };
      return { id: `still-${i + 1}`, still: src, position: meta.position, label: meta.label };
    }),
  },

  contact: {
    label: 'Training / Workshops',
    // Skill astrolabe (top-right) + scannable list (below). `pos` places each
    // skill node at a cardinal point of the ring, mirroring the compass.
    training: true,
    // Chronological training / workshop history (shown as a timeline below).
    // Verbatim per client (spelling/punctuation preserved exactly as provided,
    // incl. "Renaisstance").
    timeline: [
      { years: '2017 - 2021', detail: 'Renaisstance Theatre Society, Delhi' },
      { years: '2018', detail: 'Intensive Acting Workshop by Happy Ranajit, NSD' },
      { years: '2019', detail: 'FTII Foundation Acting Course' },
      { years: '2021', detail: 'Masterclass in Acting by Neeraj Kabi' },
      { years: '2022', detail: 'Advanced Acting Workshop by Mahesh Dattani' },
      { years: '2023', detail: 'Navarasa Sadhana by Guru G Venu, Natanakairali' },
      {
        years: '2024',
        detail: 'The Ray Program by Abhimanyu Ray, Bollywood Casting Director',
      },
    ],
    skills: [
      {
        key: 'stage-screen',
        label: 'Stage & Screen',
        detail: 'Trained for both theatre and camera',
        pos: 'top',
      },
      {
        key: 'dialects',
        label: 'Dialects',
        detail: 'Hindi · English · Haryanvi',
        pos: 'right',
      },
      {
        key: 'combat',
        label: 'Combat / MMA',
        detail: 'Mixed martial arts & stage combat',
        pos: 'bottom',
      },
      {
        key: 'horse',
        label: 'Horse Riding',
        detail: 'Mounted & period action',
        pos: 'left',
      },
    ],
    items: [{ id: 'contact-1', title: '', still: '', trailer: '' }],
  },
};

// Compass points, ordered by their fixed position on screen.
// Compass points, positioned to match refernce.png:
// ABOUT (top) · WORK (right) · CONTACT (bottom) · THEATRE (left).
export const compassPoints = [
  { key: 'about', label: 'About', position: 'top' },
  { key: 'work', label: 'Work', position: 'right' },
  { key: 'contact', label: 'Training / Workshops', position: 'bottom' },
  { key: 'theatre', label: 'Theatre', position: 'left' },
  { key: 'stills', label: 'Stills', position: 'topright' },
];

export const quote =
  'Drawn to stories that explore the human experience,\nI found my foundation in theatre.';

export const contactInfo = {
  email: 'akshay.agg@hotmail.com',
  phone: '+91 99102 99949',
  instagram: 'https://www.instagram.com/akshayaggarwal28/?hl=en',
  imdb: 'https://www.imdb.com/name/nm15185708/?ref_=nv_sr_srsg_0_tt_0_nm_8_in_0_q_akshay%20agg',
};
