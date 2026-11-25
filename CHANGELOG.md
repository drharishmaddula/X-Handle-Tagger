# Changelog — Handle Tagger for X (project)

Each version lives in its own folder under `versions/`. Older folders are never edited or deleted. This file lists every version in one place. Details are in each version's own `CHANGELOG.md`.

## v3.0.0 — 2026-11-25

- Ethos reputation score shown beside each username (for example **Ethos 1650 · Reputable**), colored by level.
- "Not on Ethos" (grey, dashed) for accounts Ethos doesn't list. Those accounts still get your tags and notes.
- "Ethos ?" when a lookup fails. Retried after about 10 minutes.
- Panel and quick-tag menu show the Ethos result.
- New `background.js`: the only part that contacts Ethos. Caches results for 24 hours.
- Privacy: the extension now contacts api.ethos.network. Only the username is sent.
- Not yet confirmed: the Ethos API address and response format. Needs a live test.

## v2.0.0 — 2026-11-25

- Quick-tag: a **+ Tag** button beside each username opens a menu to turn labels on or off.
- Private notes (up to 500 characters) per account, with a grey **note** marker.
- Label counts and a label filter in the panel.
- Backups include notes (format version 2). v1 backups still import.

## v1.0.0 — 2026-11-25

- Colored label badges beside usernames on x.com and twitter.com.
- Four built-in labels: Engagement farmer, Bot-like, Bad faith, Trusted.
- Custom labels with name and color.
- Popup panel: tag accounts, search, remove tags.
- Alt+Shift+T opens the panel for the open profile.
- Export and import of a JSON backup.
- Firefox 109 or later. No network access.
