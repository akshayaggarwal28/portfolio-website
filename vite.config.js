import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Build target: ONE self-contained index.html with JS, CSS, images, and all
// video (the About loops + Work trailers) inlined as base64 — no server, no
// asset folder needed. Opens by double-click.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Inline assets of any size (default cap is 4 KB) so nothing is left as an
    // external file.
    assetsInlineLimit: 100 * 1024 * 1024,
    chunkSizeWarningLimit: 100000,
  },
});
