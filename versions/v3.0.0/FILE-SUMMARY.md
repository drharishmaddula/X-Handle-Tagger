# File Summary — Handle Tagger v3.0.0

| File | What it does | Needed in the extension? |
|---|---|---|
| `manifest.json` | Name, version (3.0.0), sites the extension runs on (x.com, twitter.com), permissions (storage), access to api.ethos.network, the background script, and the Alt+Shift+T shortcut. | Yes |
| `background.js` | The only part that contacts Ethos. Looks up each username once, caches the result for 24 hours, and sends only the username. Holds the Ethos API address (`ETHOS_BASE`) to confirm on first test. | Yes |
| `common.js` | Shared helpers: labels, reading and saving data, tags and notes, label counts, Ethos label text and colors, checking handles, reading the handle from a page address. | Yes |
| `content.js` | Runs on X. Adds the Ethos badge, your tag badges, the note marker and the **+ Tag** button beside each username, and runs the quick-tag menu. | Yes |
| `content.css` | Styling for the badges, Ethos badge, note marker, **+ Tag** button and quick-tag menu on X. | Yes |
| `popup.html` | Layout of the panel, including the Ethos line under the username. | Yes |
| `popup.js` | Panel logic: tagging, notes, Ethos line, label filter and counts, custom labels, tagged list, export and import. | Yes |
| `popup.css` | Styling for the panel, including dark mode. | Yes |
| `README.md` | Install, usage, Ethos score explanation, privacy and troubleshooting guide. | No (documentation) |
| `CHANGELOG.md` | What changed in this version. | No (documentation) |
| `FILE-SUMMARY.md` | This file. | No (documentation) |
