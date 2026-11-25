# Handle Tagger for X — v3.0.0

Private labels and notes for X (Twitter) accounts, shown beside each account's **Ethos** reputation score. Your tags and notes stay in your browser. Only the username is sent to Ethos.

## Sections

- What it does
- How it works
- Install in Firefox (temporary, for testing)
- Install permanently (self-distributed, signed)
- Using it
- The Ethos score
- Notes and tags
- Backup and move your data
- Privacy
- Known limits
- Troubleshooting

## What it does

- Shows an **Ethos** badge beside every username on x.com and twitter.com. It shows the score and level, for example **Ethos 1650 · Reputable**.
- Shows **Not on Ethos** for accounts Ethos doesn't list. Those accounts still get your tags and notes.
- Shows your own tag badges, a grey **note** marker, and a **+ Tag** button, as in v2.
- The panel also shows the Ethos result for the account you're viewing.

## How it works

- `background.js` is the only part that contacts Ethos. It looks up each username once, saves the result for 24 hours, and sends nothing else.
- `content.js` runs on X. It shows the Ethos badge, your tags and the note marker beside each name.
- Your tags and notes are kept in Firefox's local storage. Ethos results are kept separately, so exports don't include them.

## Install in Firefox (temporary, for testing)

1. Unzip `handle-tagger-3.0.0.zip` into a folder you can find, for example `Downloads/handle-tagger-3.0.0`.
2. Open Firefox and type `about:debugging#/runtime/this-firefox` in the address bar.
3. Click **Load Temporary Add-on…**
4. Open the unzipped folder and select **manifest.json**.
5. Go to x.com. Ethos badges appear beside names as they load.

Temporary add-ons are removed when Firefox closes. If v2 is loaded temporarily, remove it first (`about:debugging` → **Remove**).

## Install permanently (self-distributed, signed)

1. Create a free account at https://addons.mozilla.org (Firefox Add-on Developer Hub).
2. Click **Submit a New Add-on**.
3. Choose **On your own** (not "On this site"). This keeps it off the public store.
4. Upload `handle-tagger-3.0.0.zip`. Mozilla will ask you to explain that the extension contacts api.ethos.network. Say it looks up each username once, caches the result for 24 hours, and sends nothing else.
5. Mozilla checks and signs it. Download the signed `.xpi` file.
6. Drag the `.xpi` file onto a Firefox window and click **Add**.

The add-on ID is unchanged from v1 and v2, so Firefox treats v3 as an update.

## Using it

- **See a score:** scroll X as normal. Each name gets an Ethos badge once its lookup finishes.
- **Tag an account:** click **+ Tag** beside the name, then click labels. The menu also shows the Ethos result.
- **Note an account:** type in the **Private note** box in the **+ Tag** menu or in the panel.
- **Panel:** click the toolbar icon or press Alt+Shift+T on a profile. The Ethos line under the username shows the result.

Everything else (labels, filter, counts, backup) works as in v2.

## The Ethos score

- Scores run from 0 to 2800. Levels: Untrusted (0–799), Questionable (800–1199), Neutral (1200–1599), Reputable (1600–1999), Exemplary (2000–2800).
- A score measures what Ethos can see on its own network. It is one signal, not a verdict. Read it alongside your own tags and notes.
- **Not on Ethos** means Ethos has no profile for that username. It does not mean the account is bad. You can still tag and note it.
- **Ethos ?** means the lookup failed (for example, you're offline). It retries after about 10 minutes.
- Badge colors: red for Untrusted, orange for Questionable, grey for Neutral, blue for Reputable, green for Exemplary.

## Notes and tags

- Notes are up to 500 characters and visible only to you.
- Tags work as in v2.
- Ethos results are not editable and are not your opinion. Your tags and notes sit alongside them and are never shared.

## Backup and move your data

- **Export** saves your tags, notes and custom labels to a `.json` file. Ethos results are not included, because they're fetched again from Ethos.
- **Import** works as in v2.
- Backups from v1 and v2 import into v3.

## Privacy

- The extension asks for **storage** (to save your tags and notes) and access to **api.ethos.network** (to look up scores).
- It runs only on `x.com` and `twitter.com`.
- The only data sent to Ethos is the X username of each account whose name appears on the page. Each username is looked up once per 24 hours.
- Your tags, notes, custom labels and the list of accounts you tag are never sent.
- Ethos may log the lookups it receives, including your internet address. Ethos's own privacy policy covers that.
- The extension has no analytics and doesn't track what you do.

## Known limits

- **The Ethos address is not yet confirmed.** `background.js` uses `https://api.ethos.network/api/v2`, the address that Ethos's documentation points to. The first live test must confirm it. If it differs, change `ETHOS_BASE` at the top of `background.js` and release a new version.
- **Response format not yet confirmed.** The code looks for a number called `score` in the response. If Ethos returns the score under another name, the badges will show **Ethos ?**. Also, a profile that isn't on Ethos is expected to return a 404 response. If it returns something else, it may show **Ethos ?** instead of **Not on Ethos**.
- Lookups are not sent for accounts that never appear on the page.
- X changes its page layout from time to time. If badges stop appearing, the `data-testid` values in `content.js` may need updating.
- Ethos lookups stop working if Ethos changes or limits its API.

## Troubleshooting

- **All badges say "Ethos ?":** the lookup is failing. Check your internet connection. If it still fails, the Ethos address or response format probably needs updating (see Known limits).
- **Badges say "Not on Ethos" for accounts you know are on Ethos:** the response format or address may not match yet. Same fix as above.
- **Nothing appears on X:** check that the extension is loaded at `about:addons`, then reload the X tab.
- **Ethos badge stays as "Ethos …":** the lookup hasn't finished. Wait a few seconds or scroll slightly.
