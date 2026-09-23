import { forwardRef, useCallback } from 'react';

/**
 * Ambient loop <video> that autoplays reliably (incl. Safari) with zero chrome.
 *
 * The key: Safari only autoplays a muted video if the `muted` PROPERTY (not
 * just the attribute React renders) is set before its autoplay gate. So we set
 * `muted`/`defaultMuted` on the DOM node the instant it mounts (via a callback
 * ref, which runs during commit — before paint), then call play() and retry on
 * loadeddata/canplay. The `data-loop` hook + GlobalStyle strip every native
 * control surface. Forwards a ref so callers (e.g. the intro's unmute toggle)
 * can still reach the element.
 */
const LoopVideo = forwardRef(function LoopVideo(
  { src, style, className },
  forwardedRef
) {
  const attach = useCallback(
    (el) => {
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
      if (!el) return;
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      const play = () => {
        try {
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        } catch (e) {
          /* ignore */
        }
      };
      play();
      el.addEventListener('loadeddata', play);
      el.addEventListener('canplay', play);
    },
    [forwardedRef]
  );

  return (
    <video
      ref={attach}
      src={src}
      data-loop=""
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      style={style}
      className={className}
    />
  );
});

export default LoopVideo;
