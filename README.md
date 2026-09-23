# Akshay Aggarwal — Actor Portfolio

A cinematic, single-page actor portfolio. Vite + React + styled-components +
Framer Motion. The production build compiles to **one self-contained
`index.html`** (all JS, CSS, images, and video inlined) that opens by
double-click — no server needed.

## Run it

Requires **Node 18+**.

```bash
npm install        # install dependencies (creates node_modules/)
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → dist/index.html (single self-contained file)
npm run preview    # serve the built dist/ locally
```

The deliverable is `dist/index.html` after `npm run build`.

## How it's organised

```
src/
  App.jsx                     app root + intro splash + scroll-reveal
  components/                 all UI
    Compass.jsx               the 5-point astrolabe navigation
    HeroSection.jsx           top row: compass (left) + context stage (right)
    Slideshow.jsx             About signature portrait slideshow (+ Training photos)
    WorkViewfinder.jsx        Work: "now playing" media frame
    WorkIndex.jsx             Work: screening index (drives the viewfinder)
    TheatreStage.jsx          Theatre: production media frame
    TheatreList.jsx           Theatre: playbill index
    TrainingStage.jsx         Training: workshop-photo slideshow
    TrainingTimeline.jsx      Training: chronological timeline
    StillsFeature.jsx         Stills: featured photo (Ken Burns + counter)
    StillsGrid.jsx            Stills: editorial grid + cinematic lightbox
    AboutPanel.jsx            About: intro player (+ "hear him" unmute) + bio + gallery
    LoopVideo.jsx             ambient loop <video> (robust muted autoplay, no chrome)
    MediaFrame.jsx            shared 16:9-ish frame with corner brackets
    Footer.jsx, VideoModal.jsx, Intro.jsx, ...
  context/CompassContext.jsx  active section/item state
  data/
    content.js                *** SINGLE SOURCE OF TRUTH for all copy + credits ***
    aboutVideos.js            the About showreel loops
  styles/                     theme tokens + GlobalStyle
  assets/
    hero/                     About signature portraits (hero-1..n)
    media/
      about-videos/           About gallery loop clips (loop-1..n)
      stills/                 Stills gallery photos (still-1..n)
      theatre-plays/          Theatre production stills
      training-pics/          Training / workshop photos
      about-me/               (misc)
      *.mp4 / *.jpg           Work trailers + posters (imported in content.js)
```

## Editing content

- **All text, credits, timeline, contact info:** `src/data/content.js`.
- **About showreel loops:** drop `loop-1.mp4`, `loop-2.mp4`, … into
  `src/assets/media/about-videos/` (auto-loaded in order).
- **Stills photos:** drop `still-1.jpg`, `still-2.jpg`, … into
  `src/assets/media/stills/` (labels/focal points set in `content.js`).
- **About signature portraits:** `src/assets/hero/hero-1.jpg` (first = primary),
  framing set in `Slideshow.jsx`.
- **Theatre / Training photos:** `src/assets/media/theatre-plays/` and
  `src/assets/media/training-pics/`.

After any change, run `npm run build` and use `dist/index.html`.

## Notes

- Ambient loop videos autoplay muted with all native controls stripped
  (`LoopVideo.jsx` + `styles/GlobalStyle.js`). For the most reliable Safari
  autoplay of the single self-contained file, serving `dist/` over any static
  host (or the folder-build variant) is more robust than opening via `file://`.
</content>
