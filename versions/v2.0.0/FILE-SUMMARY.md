# File Summary — Handle Tagger v2.0.0

| File | What it does | Needed in the extension? |
|---|---|---|
| `manifest.json` | Tells Firefox the extension's name, version (2.0.0), the sites it runs on (x.com, twitter.com), its one permission (storage), and the Alt+Shift+T shortcut. | Yes |
| `common.js` | Shared helpers: built-in labels, reading and saving data, reading and writing a handle's tags and note, label counts, checking handles, reading the handle from a page address, choosing text color for badges. | Yes |
| `content.js` | Runs on X. Finds each username, adds badges, the note marker and the **+ Tag** button, and runs the quick-tag menu. Updates live when data changes. | Yes |
| `content.css` | Styling for the badges, note marker, **+ Tag** button and quick-tag menu on X. | Yes |
| `popup.html` | Layout of the panel: account, labels, note, custom labels, filter and tagged list, backup. | Yes |
| `popup.js` | Panel logic: tagging, notes, label filter and counts, custom labels, tagged list, export and import. | Yes |
| `popup.css` | Styling for the panel, including dark mode. | Yes |
| `README.md` | Install, usage, quick tag, notes, filter, backup, privacy and troubleshooting guide. | No (documentation) |
| `CHANGELOG.md` | What changed in this version. | No (documentation) |
| `FILE-SUMMARY.md` | This file. | No (documentation) |
