# Winamp (Webamp) — host site assets

## Tracks

Drop MP3 (or other browser-playable) files into `public/wmp/audio/`, then
register them in `tracks.json`:

```json
{
  "tracks": [
    {
      "url": "/wmp/audio/your-song.mp3",
      "metaData": { "artist": "Artist", "title": "Title" }
    }
  ]
}
```

Empty `tracks` is fine — Webamp will open with an empty playlist and the
user can drag-drop audio in.

## Skins

Optional. Drop `.wsz` skin files into `public/wmp/skins/` and register them
in `skins.json`:

```json
{
  "initial": "/wmp/skins/winamp_classic.wsz",
  "available": [
    { "url": "/wmp/skins/winamp_classic.wsz", "name": "Winamp Classic" }
  ]
}
```

If `skins.json` is missing or `initial` is null, Webamp uses its
bundled default skin.

## Layout presets

Named window layouts are defined in `src/wmp/presets.js`. The current
options:

- **tower** *(default)* — Stacked Sony hi-fi rack: Milkdrop on top, then
  main, equalizer, playlist down the left side. Era-correct component
  stack.
- **bench** — Horizontal: main + EQ on the left, large Milkdrop to the
  right, playlist tucked under it.
- **compact** — Main window only; EQ, playlist, and Milkdrop all start
  closed.
- **visualizer** — Milkdrop dominates, main is shaded (rolled-up title
  bar). EQ + playlist closed.

To switch the default, change `DEFAULT_PRESET` at the bottom of
`src/wmp/presets.js`.

To preview a preset without code changes, append `?wmp=<name>` to any
page URL (e.g. `http://localhost:5175/?wmp=visualizer`) and open the
Music app. The URL param overrides the default.
