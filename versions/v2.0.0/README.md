# Handle Tagger for X — v2.0.0

Tag X (Twitter) accounts with private labels and notes. Labels appear as small colored badges beside the username or display name, everywhere on X. Your labels and notes stay in your browser.

## Sections

- What it does
- How it works
- Install in Firefox (temporary, for testing)
- Install permanently (self-distributed, signed)
- Using it
- Quick tag on X
- Notes
- Filter and counts
- Backup and move your labels
- Privacy
- Known limits
- Troubleshooting

## What it does

- Adds colored badges next to usernames on x.com and twitter.com (tweets, replies, profiles, hover cards).
- Adds a **+ Tag** button beside each username so you can tag someone without opening the panel.
- Lets you add a private **note** to any account. A small grey **note** marker shows when an account has one.
- Ships with four labels: **Engagement farmer**, **Bot-like**, **Bad faith**, **Trusted**.
- Lets you create your own labels with a name and color.
- Shows how many accounts use each label, and lets you filter the list by label.
- Opens with **Alt+Shift+T** on an X profile, with that account already filled in.
- Export your labels and notes to a file and import them back.

## How it works

- `content.js` runs only on X. It finds each username on the page and adds the badges, note marker and **+ Tag** button for that account.
- The **+ Tag** menu on X and the panel (`popup.html` / `popup.js`) both save to the same storage, so they always agree.
- Labels and notes are saved with Firefox's built-in local storage. Nothing is sent to any server.

## Install in Firefox (temporary, for testing)

1. Unzip `handle-tagger-2.0.0.zip` into a folder you can find, for example `Downloads/handle-tagger`.
2. Open Firefox and type `about:debugging#/runtime/this-firefox` in the address bar.
3. Click **Load Temporary Add-on…**
4. Open the unzipped folder and select **manifest.json**.
5. Go to x.com. The **+ Tag** buttons appear beside names.

Temporary add-ons are removed when Firefox closes. Use the permanent install below for everyday use.

If you already installed v1 this way, remove it first (`about:debugging` → **Remove**), then load v2. For the permanent install, v2 uses the same add-on ID as v1, so Firefox treats it as an update.

## Install permanently (self-distributed, signed)

1. Create a free account at https://addons.mozilla.org (Firefox Add-on Developer Hub).
2. Click **Submit a New Add-on**.
3. Choose **On your own** (not "On this site"). This keeps it off the public store.
4. Upload `handle-tagger-2.0.0.zip`.
5. Mozilla checks and signs it, usually within minutes. Download the signed `.xpi` file.
6. Drag the `.xpi` file onto a Firefox window and click **Add**.

Keep the add-on ID in `manifest.json` (`browser_specific_settings` → `gecko` → `id`) the same in every future version. Firefox treats a different ID as a different add-on.

## Using it

- **Tag an account:** on X, click **+ Tag** beside the name. Click labels to turn them on or off. Click **Done** or anywhere else to close.
- **Tag from the panel:** open their profile on X (or press Alt+Shift+T), then use the panel.
- **Add a label:** type a name, pick a color, click **Add**.
- **Delete a custom label:** click **Delete** next to it. This removes it from every account.
- **Find a tagged account:** choose a label in the filter, or type in the search box, under **Tagged accounts**.
- **Remove all tags and the note from an account:** click **Remove** in the Tagged accounts list.

## Quick tag on X

- Click **+ Tag** beside a username to open a small menu.
- The menu shows every label. Click one to turn it on or off. It saves right away.
- Type in the **Private note** box to add or change a note. It saves automatically a moment after you stop typing.
- Click **Done**, press Escape, or click anywhere else to close the menu.
- If you click **+ Tag** on the same account again, the menu closes.

## Notes

- Notes can be up to 500 characters.
- A grey **note** marker appears beside the name when a note exists. Hover over it to read the start of the note. Click it to open the menu.
- Notes are only visible to you, in this browser.
- An account with a note but no labels still shows the **note** marker.

## Filter and counts

- The **Tagged accounts** section has a dropdown. Pick a label to see only the accounts that have it.
- Each label in the dropdown shows how many accounts use it, for example "Bot-like (3)".
- The list of custom labels also shows counts.
- The search box and the dropdown work together.

## Backup and move your labels

- **Export:** click **Export**. A `handle-tagger-backup-YYYY-MM-DD.json` file downloads. Keep it safe. It now includes notes.
- **Import:** click **Import** and pick a backup file. Imported tags are added to what you already have, so nothing is removed. If an account already has a note, your note is kept. If it has none, the imported note is used. Custom labels with the same name are skipped.
- Backups from v1 still import. They just have no notes.

Use export/import to move labels to another computer or browser.

## Privacy

- The extension asks for one permission: **storage** (to save your labels and notes).
- It only runs on `x.com` and `twitter.com`. It does not run on any other website.
- It makes no network requests and sends nothing anywhere.
- It does not track what you do.

## Known limits

- X changes its page layout from time to time. If badges or **+ Tag** buttons stop appearing, the username markers in `content.js` (the `data-testid` values) may need updating. That becomes a new version.
- The **+ Tag** menu uses a light or dark look based on the page background. X's theme may not always match, but it stays readable.
- Badges appear on usernames that X loads on the page. Accounts shown only as images will not show badges.
- Labels and notes are per browser profile. Use Export/Import to move them.

## Troubleshooting

- **No badges or + Tag buttons on X:** check that the extension is loaded at `about:addons`, then reload the X tab.
- **The + Tag menu is hidden or cut off:** close it with Escape and reopen it. Zooming the page can also help.
- **Alt+Shift+T does nothing:** another extension may use the same shortcut. Set a different one at `about:addons` → gear icon → **Manage Extension Shortcuts**.
- **Panel shows "not a valid handle":** type the username without spaces. Letters, numbers and underscores only, up to 15 characters.
