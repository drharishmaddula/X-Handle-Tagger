# Handle Tagger for X

A Firefox extension (Chrome later) for privately labeling X (Twitter) accounts. Labels and notes show as colored badges beside usernames. Your tags and notes stay in your browser. From v3, each account also shows its Ethos reputation score.

Latest version: **v3.0.0**. Install steps are in `versions/v3.0.0/README.md`.

## Sections

- Folder layout and version rules
- Where to start
- File summary
- Changelog

## Folder layout and version rules

```
x-handle-tagger/
  README.md                     this file (project overview)
  CHANGELOG.md                  project-wide changelog (all versions)
  FILE-SUMMARY.md               what each file and folder is for
  README-v1-archive.md          the previous project overview, kept unchanged
  versions/
    v1.0.0/                     first release (code + README, CHANGELOG, FILE-SUMMARY)
    v2.0.0/                     quick tag, notes, filter and counts
    v3.0.0/                     Ethos scores (background.js added)
  dist/
    handle-tagger-1.0.0.zip     installable package for v1.0.0
    handle-tagger-2.0.0.zip     installable package for v2.0.0
    handle-tagger-3.0.0.zip     installable package for v3.0.0
```

Rules followed for every change:

1. The current version folder is never edited.
2. A change starts by copying the latest version folder to a new one, for example `versions/v4.0.0/`.
3. The copy is changed. Both folders are kept.
4. Each version folder has its own README, CHANGELOG and FILE-SUMMARY.
5. Nothing is deleted.
6. A zip for installing is made from each version's code files only (`dist/`).

## Where to start

- To install the latest version: open `versions/v3.0.0/README.md`.
- To see what changed: open `CHANGELOG.md` here, or the one in each version folder.
- To see which file does what: open `FILE-SUMMARY.md` here, or the one in each version folder.

## File summary

| Path | What it is |
|---|---|
| `README.md` | This overview. |
| `CHANGELOG.md` | Project-wide changelog. |
| `FILE-SUMMARY.md` | Project-wide file summary. |
| `README-v1-archive.md` | The first overview, kept as it was. |
| `versions/v1.0.0/` | Version 1.0.0 extension code and docs. |
| `versions/v2.0.0/` | Version 2.0.0 extension code and docs. |
| `versions/v3.0.0/` | Version 3.0.0 extension code and docs. |
| `dist/handle-tagger-1.0.0.zip` | Installable package for v1.0.0. |
| `dist/handle-tagger-2.0.0.zip` | Installable package for v2.0.0. |
| `dist/handle-tagger-3.0.0.zip` | Installable package for v3.0.0. |

Note: the v1 README names the zip `handle-tagger-v1.0.0.zip`, but the file is `handle-tagger-1.0.0.zip`. Use the file in `dist/`.

## Changelog

- **v3.0.0 (2026-11-25):** Ethos scores beside each username, "Not on Ethos" for accounts Ethos doesn't list, Ethos result in the panel and the quick-tag menu. Adds a background script that is the only part that contacts Ethos.
- **v2.0.0 (2026-11-25):** Quick-tag button on X, private notes, label counts and filter in the panel, backups include notes.
- **v1.0.0 (2026-11-25):** First release. Colored label badges beside usernames, four built-in labels, custom labels, export and import, Alt+Shift+T shortcut.

Full details are in `CHANGELOG.md` and in each version's `CHANGELOG.md`.
