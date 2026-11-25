# Changelog — Handle Tagger for X

Each version lives in its own folder under `versions/`. Older folders are never edited or deleted.

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
