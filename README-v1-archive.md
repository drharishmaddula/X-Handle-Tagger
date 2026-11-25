# Handle Tagger for X

A Firefox extension (Chrome later) that lets you privately label X/Twitter accounts. Labels show as colored badges beside usernames. Everything stays in your browser.

## Sections

- Folder layout and version rules
- Where to start
- File summary
- Changelog

## Folder layout and version rules

```
x-handle-tagger/
  README.md                 this file (overview of the project)
  versions/
    v1.0.0/                 first release (complete extension + docs)
  dist/
    handle-tagger-1.0.0.zip installable package for v1.0.0
```

Rules followed for every change:

1. The current version folder is never edited.
2. A change starts by copying the folder to a new version, for example `versions/v1.0.1/`.
3. The copy is changed. Both folders are kept.
4. Each version has its own README, CHANGELOG and FILE-SUMMARY.
5. Nothing is deleted.

## Where to start

Open `versions/v1.0.0/README.md` for install steps and how to use it.

## File summary

| Path | What it is |
|---|---|
| `versions/v1.0.0/` | The extension, version 1.0.0 (see its FILE-SUMMARY.md) |
| `dist/handle-tagger-1.0.0.zip` | Zipped extension, ready to upload to addons.mozilla.org |
| `README.md` | This overview |

## Changelog

- **v1.0.0 (2026-11-25):** First release. Badges beside usernames on X, four built-in labels, custom labels, export and import, Alt+Shift+T shortcut. Details in `versions/v1.0.0/CHANGELOG.md`.
