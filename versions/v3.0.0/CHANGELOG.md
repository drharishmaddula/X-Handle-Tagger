# Changelog — Handle Tagger for X

Each version lives in its own folder under `versions/`. Older folders are never edited or deleted.

## v3.0.0 — 2026-11-25

Built by copying v2.0.0 into this folder and changing only the copy.

- **Ethos scores:** each username on X gets an Ethos badge with its score and level (for example **Ethos 1650 · Reputable**), colored by level.
- **Not on Ethos:** accounts Ethos doesn't list show a grey dashed badge instead of a made-up score.
- **Ethos ?:** shown when a lookup fails. Retried after about 10 minutes.
- **Panel:** shows the Ethos result for the account you're viewing.
- **+ Tag menu:** shows the Ethos result above the labels.
- **Background script (`background.js`):** the only part that contacts Ethos. Caches results for 24 hours, keeps only 7 days, and makes one request at a time.
- **Privacy:** the extension now contacts api.ethos.network. Only the username is sent. Tags, notes and labels are never sent.
- **Permissions:** adds access to api.ethos.network only.
- **Backups:** Ethos results are not included in exports. v1 and v2 backups still import.
- **Not yet confirmed:** the Ethos API address (`https://api.ethos.network/api/v2`) and the response format. Both need a live test before this version is considered working.
- Same add-on ID as v1 and v2, so Firefox treats it as an update.

## v2.0.0 — 2026-11-25

Built by copying v1.0.0 into this folder and changing only the copy.

- **Quick tag:** a **+ Tag** button beside each username on X opens a menu to turn labels on or off.
- **Notes:** a private note (up to 500 characters) per account, editable from the X menu or the panel. A grey **note** marker shows when an account has one.
- **Tag counts and filter:** the panel shows how many accounts use each label and lets you filter the list by label.
- **Backup:** export now includes notes (format version 2). Import still accepts v1 backups and keeps an existing note when one is already set.
- **Fix:** backup files are now read with FileReader, which works in every browser.
- Same add-on ID as v1.0.0, so Firefox treats it as an update.

## v1.0.0 — 2026-11-25

First release.

- Badges beside usernames on x.com and twitter.com.
- Four built-in labels: Engagement farmer, Bot-like, Bad faith, Trusted.
- Custom labels with name and color; delete custom labels.
- Popup panel: tag accounts, search tagged accounts, remove tags.
- Keyboard shortcut Alt+Shift+T opens the panel for the open profile.
- Export to a JSON backup file; import merges a backup into current data.
- Labels stored in Firefox local storage. No network access, no tracking.
- Firefox 109 or later.
