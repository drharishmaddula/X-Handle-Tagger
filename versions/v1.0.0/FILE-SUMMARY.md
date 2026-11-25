# File Summary — Handle Tagger v1.0.0

| File | What it does | Needed in the extension? |
|---|---|---|
| `manifest.json` | Tells Firefox the extension's name, version, the sites it runs on (x.com, twitter.com), its one permission (storage), and the Alt+Shift+T shortcut. | Yes |
| `common.js` | Shared helpers: built-in labels, reading and saving data, checking handles, reading the handle from a page address, choosing text color for badges. | Yes |
| `content.js` | Runs on X. Finds each username, looks up its tags, and adds badges. Updates live when tags change. | Yes |
| `content.css` | Styling for the badges shown on X. | Yes |
| `popup.html` | Layout of the panel that opens from the toolbar icon or shortcut. | Yes |
| `popup.js` | Panel logic: tagging, custom labels, tagged list, export and import. | Yes |
| `popup.css` | Styling for the panel, including dark mode. | Yes |
| `README.md` | Install, usage, privacy and troubleshooting guide. | No (documentation) |
| `CHANGELOG.md` | What changed in this version. | No (documentation) |
| `FILE-SUMMARY.md` | This file. | No (documentation) |
