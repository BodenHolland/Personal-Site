// Audio helpers for the CRT — Boden's chosen palette.
//
// Click sounds: Henry-derived mouse + keyboard variants.
// Boden's bespoke sounds: power-on, monitor button click, ambient loop, shutdown.
// Game audio (internet archive iframes) plays natively inside its own iframe.

const KEY_VARIANTS = [1, 2, 3, 4, 5, 6].map(
  (n) => `/crt/audio/keyboard/key_${n}.mp3`
);
const MOUSE_DOWN = '/crt/audio/mouse/mouse_down.mp3';
const MOUSE_UP = '/crt/audio/mouse/mouse_up.mp3';
const POWER_ON = '/crt/audio/power_on.mp3';
const POWER_OFF = '/crt/audio/poweroff.mp3';
const MONITOR_CLICK = '/crt/audio/monitor_click.mp3';
const AMBIENT = '/crt/audio/ambient.mp3';
const SHUTDOWN = '/crt/audio/shutdown.mp3';

const cache = {};
const pool = []; // round-robin pool to avoid GC churn

// Master controls — adjustable from the CRT bezel volume knob and the
// on-screen speaker mute icon. Effective volume = masterVolume * (muted ? 0 : 1).
let masterVolume = 1;
let muted = false;
const effectiveScale = () => (muted ? 0 : masterVolume);

export const setMasterVolume = (v) => {
  masterVolume = Math.max(0, Math.min(1, v));
  if (ambientNode) ambientNode.volume = ambientBaseVolume * effectiveScale();
};
export const setMuted = (m) => {
  muted = !!m;
  if (ambientNode) {
    ambientNode.volume = ambientBaseVolume * effectiveScale();
    // Don't pause/play — keep the loop position; volume of 0 is enough.
  }
};
export const isMuted = () => muted;

const preload = (src) => {
  if (cache[src]) return cache[src];
  const a = new Audio(src);
  a.preload = 'auto';
  cache[src] = a;
  return a;
};

// Eagerly warm cache once when this module is imported.
[
  ...KEY_VARIANTS,
  MOUSE_DOWN,
  MOUSE_UP,
  POWER_ON,
  POWER_OFF,
  MONITOR_CLICK,
  AMBIENT,
  SHUTDOWN,
].forEach(preload);

const playFresh = (src, volume = 1) => {
  // Clone the audio so simultaneous clicks don't cut each other off.
  // Recycle from a small pool to keep memory bounded.
  const scaled = volume * effectiveScale();
  if (scaled <= 0) return null; // muted or master at zero — skip entirely
  let node = pool.pop();
  if (!node) node = new Audio();
  node.src = src;
  node.currentTime = 0;
  node.volume = scaled;
  node.loop = false;
  node.play().catch(() => {});
  const reclaim = () => {
    node.removeEventListener('ended', reclaim);
    if (pool.length < 8) pool.push(node);
  };
  node.addEventListener('ended', reclaim);
  return node;
};

// One-shot sounds.
export const playMouseDown = () => playFresh(MOUSE_DOWN, 0.6);
export const playMouseUp = () => playFresh(MOUSE_UP, 0.6);
export const playKeyboard = () => {
  const variant = KEY_VARIANTS[Math.floor(Math.random() * KEY_VARIANTS.length)];
  playFresh(variant, 0.5);
};
export const playPowerOn = () => playFresh(POWER_ON, 0.7);
export const playPowerOff = () => playFresh(POWER_OFF, 0.85);
export const playMonitorClick = () => playFresh(MONITOR_CLICK, 0.65);
export const playShutdown = () => playFresh(SHUTDOWN, 0.7);

// Looping ambient — singleton, so toggling it on/off doesn't stack.
let ambientNode = null;
let ambientBaseVolume = 0.35;
export const startAmbient = (volume = 0.35) => {
  ambientBaseVolume = volume;
  if (ambientNode && !ambientNode.paused) return ambientNode;
  if (!ambientNode) {
    ambientNode = new Audio(AMBIENT);
    ambientNode.loop = true;
    ambientNode.preload = 'auto';
  }
  ambientNode.volume = ambientBaseVolume * effectiveScale();
  ambientNode.currentTime = 0;
  ambientNode.play().catch(() => {});
  return ambientNode;
};
export const stopAmbient = ({ fade = 400 } = {}) => {
  if (!ambientNode) return;
  if (fade <= 0) {
    ambientNode.pause();
    return;
  }
  const start = ambientNode.volume;
  const steps = 12;
  const interval = fade / steps;
  let i = 0;
  const id = setInterval(() => {
    i += 1;
    const remaining = Math.max(0, start * (1 - i / steps));
    if (ambientNode) ambientNode.volume = remaining;
    if (i >= steps) {
      clearInterval(id);
      if (ambientNode) ambientNode.pause();
    }
  }, interval);
};
