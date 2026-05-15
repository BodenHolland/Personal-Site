import { useEffect, useRef } from 'react';
import WebampLib from 'webamp';
import { subscribeMaster } from '../crtAudio';
import { PRESETS, DEFAULT_PRESET } from './presets';

// Allow ?wmp=<name> in the URL to override the preset (handy for testing
// without code changes). Falls back to whatever the parent passed in,
// then to DEFAULT_PRESET.
const resolvePreset = (preset) => {
  let name = preset || DEFAULT_PRESET;
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('wmp');
    if (q && PRESETS[q]) name = q;
  }
  return PRESETS[name] || PRESETS[DEFAULT_PRESET];
};

// Mount Webamp directly onto the page (its windows manage their own chrome
// and dragging). When the user closes the main window, `onClose` fires and we
// tell the host to unmount.
//
// Volume routing: Webamp owns its own <audio> element. We can't override its
// volume slider, but we can scale the *output* by wiring an effective master
// gain through the element's `volume` property whenever it changes (via the
// CRT bezel knob or system-tray mute). We multiply Webamp's own slider value
// by our master, so the user's in-Winamp slider still works proportionally.
export default function Webamp({ tracks, skins, initialSkin, onClose, preset }) {
  const containerRef = useRef(null);
  const webampRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let unsubMaster = () => {};
    let audioEl = null;
    let internalVolume = 1; // 0..1, Webamp's own slider value
    let masterScale = 1;    // 0..1, CRT master * !muted

    const applyVolume = () => {
      if (audioEl) audioEl.volume = internalVolume * masterScale;
    };

    const layout = resolvePreset(preset);
    const wa = new WebampLib({
      initialTracks: tracks && tracks.length ? tracks : undefined,
      initialSkin,
      availableSkins: skins,
      enableHotkeys: false,
      zIndex: 100, // sit above the CRT desktop but below modals
      // Milkdrop visualizer (Butterchurn) — lazy-loaded so the main bundle
      // stays smaller until a user actually opens Winamp.
      __butterchurnOptions: {
        importButterchurn: () => import('butterchurn'),
        getPresets: async () => {
          const mod = await import('butterchurn-presets');
          const presets = mod.default || mod;
          return Object.keys(presets).map((name) => ({
            name,
            butterchurnPresetObject: presets[name],
          }));
        },
        butterchurnOpen: layout.butterchurnOpen,
      },
      windowLayout: layout.windowLayout,
    });
    webampRef.current = wa;

    wa.renderWhenReady(containerRef.current).then(() => {
      if (cancelled) return;
      // Dev/debug: expose the instance and a snapshot helper so you can
      // capture the current window layout from the browser console.
      // Usage in DevTools:  copy(__webampSnapshot())
      if (typeof window !== 'undefined') {
        window.__webamp = wa;
        window.__webampSnapshot = () => {
          const s = wa.store.getState();
          const w = s.windows.genWindows;
          // Webamp stores resizable-window size as [extraWidth,
          // extraHeight] sprite-increment units directly — NOT pixels.
          // Pass through verbatim. Emit `size` only when non-zero to
          // keep preset definitions clean.
          const fmt = (key) => {
            const win = w[key];
            if (!win) return null;
            const pos = win.position || { x: 0, y: 0 };
            const out = {
              position: { top: pos.y, left: pos.x },
              closed: !win.open,
            };
            if (win.shade) out.shadeMode = true;
            if (win.size && Array.isArray(win.size)) {
              const [extraWidth, extraHeight] = win.size;
              if (extraWidth || extraHeight) {
                out.size = { extraHeight, extraWidth };
              }
            }
            return out;
          };
          const layout = {
            main: fmt('main'),
            equalizer: fmt('equalizer'),
            playlist: fmt('playlist'),
            milkdrop: fmt('milkdrop'),
          };
          const out = {
            butterchurnOpen: !!(w.milkdrop && w.milkdrop.open),
            windowLayout: layout,
          };
          const code = `export const myLayout = ${JSON.stringify(out, null, 2)};`;
          // eslint-disable-next-line no-console
          console.log(code);
          return code;
        };
      }
      audioEl = containerRef.current?.querySelector('audio')
        || document.querySelector('audio'); // fallback if mounted elsewhere
      if (audioEl) {
        internalVolume = audioEl.volume;
        // Watch the audio element for volume changes Webamp performs itself,
        // then re-apply master scaling on top.
        const onVolChange = () => {
          // The element's current volume = internalVolume * masterScale. To
          // recover the user's intent (internalVolume), divide back out — but
          // only when the change came from Webamp's slider. Cheap heuristic:
          // if the value disagrees with what we just set, treat it as a user
          // change.
          const expected = internalVolume * masterScale;
          if (Math.abs(audioEl.volume - expected) > 1e-3) {
            internalVolume = masterScale > 0 ? audioEl.volume / masterScale : audioEl.volume;
            internalVolume = Math.max(0, Math.min(1, internalVolume));
            applyVolume();
          }
        };
        audioEl.addEventListener('volumechange', onVolChange);
        // Initial apply
        applyVolume();
        // Subscribe to master updates from the CRT bezel knob / mute.
        unsubMaster = subscribeMaster((s) => {
          masterScale = s;
          applyVolume();
        });
      }
    });

    const offClose = wa.onClose(() => { onClose && onClose(); });

    return () => {
      cancelled = true;
      offClose && offClose();
      unsubMaster();
      try { wa.dispose(); } catch { /* ignore */ }
      webampRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount once per open

  return <div ref={containerRef} className="crt-webamp-mount" />;
}
