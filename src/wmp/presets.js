// Named layout presets for the Music app (Webamp).
//
// Each preset is a `windowLayout` config + a `butterchurnOpen` flag.
// To change the default, swap the `DEFAULT_PRESET` export at the bottom.
// To switch at runtime for testing, append ?wmp=<name> to the URL
// (handled by Webamp.jsx).

// Tower — the default. Stacked Sony hi-fi rack, captured from Boden's
// hand-tuned layout (offset right + down to sit centered inside the
// BOTEK CRT desktop).
//   Milkdrop (visualizer)  — top
//   Main    (transport)
//   Equalizer
//   Playlist               — bottom
export const tower = {
  butterchurnOpen: true,
  windowLayout: {
    milkdrop:  { position: { top: 221, left: 639 }, size: { extraHeight: 1, extraWidth: 0 } },
    main:      { position: { top: 366, left: 639 } },
    equalizer: { position: { top: 482, left: 639 } },
    playlist:  { position: { top: 598, left: 639 } },
  },
};

// Bench — horizontal: main + EQ in the left column, big Milkdrop to
// the right, playlist tucked under Milkdrop.
export const bench = {
  butterchurnOpen: true,
  windowLayout: {
    main:      { position: { top: 0,   left: 0 } },
    equalizer: { position: { top: 116, left: 0 } },
    milkdrop:  { position: { top: 0,   left: 275 }, size: { extraHeight: 8, extraWidth: 10 } },
    playlist:  { position: { top: 280, left: 275 }, size: { extraHeight: 0, extraWidth: 10 } },
  },
};

// Compact — main window only. Equalizer + playlist + Milkdrop start
// closed. Tiny footprint, just the transport controls.
export const compact = {
  butterchurnOpen: false,
  windowLayout: {
    main:      { position: { top: 0, left: 0 } },
    equalizer: { position: { top: 116, left: 0 }, closed: true },
    playlist:  { position: { top: 232, left: 0 }, closed: true },
    milkdrop:  { position: { top: 0,   left: 275 }, closed: true },
  },
};

// Visualizer — Milkdrop dominates; main is shaded (rolled-up title bar).
// Closes EQ and playlist by default. Good for "set it and stare."
export const visualizer = {
  butterchurnOpen: true,
  windowLayout: {
    main:      { position: { top: 0, left: 0 }, shadeMode: true },
    equalizer: { position: { top: 14, left: 0 }, closed: true },
    playlist:  { position: { top: 28, left: 0 }, closed: true },
    milkdrop:  { position: { top: 0, left: 275 }, size: { extraHeight: 16, extraWidth: 12 } },
  },
};

export const PRESETS = { tower, bench, compact, visualizer };
export const DEFAULT_PRESET = 'tower';
