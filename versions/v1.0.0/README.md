# Handle Tagger for X — v1.0.0

Tag X (Twitter) accounts with private labels. Labels appear as small colored badges beside the username or display name, everywhere on X. Your labels stay in your browser.

## Sections

- What it does
- How it works
- Install in Firefox (temporary, for testing)
- Install permanently (self-distributed, signed)
- Using it
- Backup and move your labels
- Privacy
- Known limits
- Troubleshooting

## What it does

- Adds colored badges next to usernames on x.com and twitter.com (tweets, replies, profiles, hover cards).
- Ships with four labels: **Engagement farmer**, **Bot-like**, **Bad faith**, **Trusted**.
- Lets you create your own labels with a name and color.
- Opens with **Alt+Shift+T** on an X profile, with that account already filled in.
- Export your labels to a file and import them back.

## How it works

- `content.js` runs only on X. It finds each username on the page and adds the badges for that account.
- `popup.html` / `popup.js` is the panel you open from the toolbar icon or Alt+Shift+T.
- Labels are saved with Firefox's built-in local storage. Nothing is sent to any server.

## Install in Firefox (temporary, for testing)

1. Unzip `handle-tagger-v1.0.0.zip` into a folder you can find, for example `Downloads/handle-tagger`.
2. Open Firefox and type `about:debugging#/runtime/this-firefox` in the address bar.
3. Click **Load Temporary Add-on…**
4. Open the unzipped folder and select **manifest.json**.
5. Go to x.com. The badges appear once you tag someone.

Temporary add-ons are removed when Firefox closes. Use the permanent install below for everyday use.

## Install permanently (self-distributed, signed)

1. Create a free account at https://addons.mozilla.org (Firefox Add-on Developer Hub).
2. Click **Submit a New Add-on**.
3. Choose **On your own** (not "On this site"). This keeps it off the public store.
4. Upload `handle-tagger-v1.0.0.zip`.
5. Mozilla checks and signs it, usually within minutes. Download the signed `.xpi` file.
6. Drag the `.xpi` file onto a Firefox window and click **Add**.

Keep the add-on ID in `manifest.json` (`browser_specific_settings` → `gecko` → `id`) the same in every future version. Firefox treats a different ID as a different add-on.

## Using it

- **Tag an account:** open their profile on X (or press Alt+Shift+T), then click the labels you want in the panel. Click again to remove a label.
- **Add a label:** type a name, pick a color, click **Add**.
- **Delete a custom label:** click **Delete** next to it in the Custom labels list. This removes it from every account.
- **Find a tagged account:** use the search box under **Tagged accounts**.
- **Remove all tags from an account:** click **Remove** in the Tagged accounts list.

## Backup and move your labels

- **Export:** click **Export**. A `handle-tagger-backup-YYYY-MM-DD.json` file downloads. Keep it safe.
- **Import:** click **Import** and pick a backup file. Imported tags are added to what you already have, so nothing is overwritten. Custom labels with the same name are skipped.

Use export/import to move labels to another computer or browser.

## Privacy

- The extension asks for one permission: **storage** (to save your labels).
- It only runs on `x.com` and `twitter.com`. It does not run on any other website.
- It makes no network requests and sends nothing anywhere.
- It does not track what you do.

## Known limits

- X changes its page layout from time to time. If badges stop appearing, the username markers in `content.js` (the `data-testid` values) may need updating. That becomes a new version.
- Badges appear on usernames that X loads on the page. Accounts shown only as images or inside pop-up images will not show badges.
- Labels are per browser profile. Use Export/Import to move them.

## Troubleshooting

- **No badges on X:** check that the account has at least one label, then reload the X tab.
- **Alt+Shift+T does nothing:** another extension may use the same shortcut. Set a different one at `about:addons` → gear icon → **Manage Extension Shortcuts**.
- **Panel shows "not a valid handle":** type the username without spaces. Letters, numbers and underscores only, up to 15 characters.
