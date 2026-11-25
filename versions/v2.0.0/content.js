/*
 * Handle Tagger - page script for x.com / twitter.com.
 * Adds badges, a note marker and a "+ Tag" button beside each username.
 * Clicking "+ Tag" opens a small menu to set labels and a note for that account.
 */
(function () {
  "use strict";

  // X marks username blocks with these test ids (tweets, profiles, hover cards).
  const USER_NAME_SELECTOR = '[data-testid="User-Name"], [data-testid="UserName"]';
  const WRAP_CLASS = "htg-wrap";
  const MENU_ID = "htg-menu";

  let data = HTG.emptyData();
  let scanTimer = null;
  let noteTimer = null;
  let menuHandle = "";

  // Reads the @handle from a username block, ignoring what we added.
  function extractHandle(container) {
    let text = "";
    for (const node of container.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(WRAP_CLASS)) {
        continue;
      }
      text += node.textContent;
    }
    const match = text.match(/@([A-Za-z0-9_]{1,15})\b/);
    return match ? match[1].toLowerCase() : "";
  }

  function renderContainer(container) {
    const handle = extractHandle(container);
    let wrap = container.querySelector(":scope > ." + WRAP_CLASS);

    if (!handle) {
      if (wrap) wrap.remove();
      return;
    }

    const entry = HTG.getEntry(data, handle);
    const labels = entry.tags.map((id) => HTG.findLabel(data, id)).filter(Boolean);

    // Only rebuild when something visible changed.
    const key = handle + "|" + labels.map((l) => l.id + l.name + l.color).join(",") + "|" + entry.note;
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = WRAP_CLASS;
      wrap.addEventListener("click", onWrapClick);
      container.appendChild(wrap);
    }
    if (wrap.dataset.key === key) return;
    wrap.dataset.key = key;
    wrap.dataset.handle = handle;
    wrap.replaceChildren();

    for (const label of labels) {
      const badge = document.createElement("span");
      badge.className = "htg-badge";
      badge.textContent = label.name;
      badge.style.backgroundColor = label.color;
      badge.style.color = HTG.textColorFor(label.color);
      badge.title = "Handle Tagger: " + label.name;
      wrap.appendChild(badge);
    }

    if (entry.note) {
      const note = document.createElement("span");
      note.className = "htg-badge htg-note htg-action";
      note.textContent = "note";
      note.title = entry.note.slice(0, 200);
      wrap.appendChild(note);
    }

    const tagBtn = document.createElement("button");
    tagBtn.type = "button";
    tagBtn.className = "htg-tagbtn htg-action";
    tagBtn.textContent = "+ Tag";
    tagBtn.title = "Tag @" + handle + " in Handle Tagger";
    wrap.appendChild(tagBtn);
  }

  // Clicks on our controls must not follow the username link or reach X's handlers.
  function onWrapClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const control = event.target.closest(".htg-action");
    if (!control) return;
    const handle = event.currentTarget.dataset.handle;
    if (!handle) return;
    if (menuHandle === handle) {
      closeMenu();
    } else {
      openMenu(handle, control);
    }
  }

  function scanAll() {
    document.querySelectorAll(USER_NAME_SELECTOR).forEach(renderContainer);
  }

  // X updates the page constantly. Wait a moment, then scan once.
  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = setTimeout(() => {
      scanTimer = null;
      scanAll();
    }, 250);
  }

  // ---- Quick-tag menu ----

  function isDarkPage() {
    const bg = getComputedStyle(document.body).backgroundColor || "";
    const parts = bg.match(/\d+(\.\d+)?/g);
    if (!parts || parts.length < 3) return false;
    const [r, g, b] = parts.slice(0, 3).map(Number);
    return 0.299 * r + 0.587 * g + 0.114 * b < 128;
  }

  function closeMenu() {
    const menu = document.getElementById(MENU_ID);
    if (menu) menu.remove();
    menuHandle = "";
    clearTimeout(noteTimer);
  }

  // Writes one account's tags and note, using fresh data so nothing is overwritten.
  async function updateEntry(handle, nextTags, nextNote) {
    const fresh = await HTG.getData();
    HTG.setEntry(fresh, handle, nextTags, nextNote);
    data = fresh;
    await HTG.saveData(fresh);
  }

  function openMenu(handle, anchor) {
    closeMenu();
    menuHandle = handle;
    const entry = HTG.getEntry(data, handle);

    const menu = document.createElement("div");
    menu.id = MENU_ID;
    if (isDarkPage()) menu.classList.add("htg-dark");
    // Keep clicks inside the menu from reaching the page.
    menu.addEventListener("click", (e) => e.stopPropagation());

    const title = document.createElement("div");
    title.className = "htg-menu-title";
    title.textContent = "@" + handle;

    const chips = document.createElement("div");
    chips.className = "htg-menu-chips";
    for (const label of HTG.allLabels(data)) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "htg-chip" + (entry.tags.includes(label.id) ? " on" : "");
      chip.textContent = label.name;
      chip.style.setProperty("--c", label.color);
      chip.addEventListener("click", async () => {
        const current = HTG.getEntry(data, handle);
        const set = new Set(current.tags);
        if (set.has(label.id)) {
          set.delete(label.id);
        } else {
          set.add(label.id);
        }
        await updateEntry(handle, [...set], current.note);
        chip.classList.toggle("on");
      });
      chips.appendChild(chip);
    }

    const noteBox = document.createElement("textarea");
    noteBox.maxLength = HTG.NOTE_MAX;
    noteBox.placeholder = "Private note (only you see this)";
    noteBox.value = entry.note;
    noteBox.addEventListener("input", () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        const current = HTG.getEntry(data, handle);
        updateEntry(handle, current.tags, noteBox.value);
      }, 400);
    });

    const foot = document.createElement("div");
    foot.className = "htg-menu-foot";
    const hint = document.createElement("span");
    hint.textContent = "Saves automatically";
    const done = document.createElement("button");
    done.type = "button";
    done.className = "htg-done";
    done.textContent = "Done";
    done.addEventListener("click", closeMenu);
    foot.append(hint, done);

    menu.append(title, chips, noteBox, foot);
    document.body.appendChild(menu);

    // Place the menu under the anchor, or above it if there's no room below.
    const r = anchor.getBoundingClientRect();
    const width = 260;
    const height = menu.offsetHeight;
    const top = r.bottom + 6 + height > window.innerHeight ? r.top - height - 6 : r.bottom + 6;
    menu.style.top = Math.max(8, top) + "px";
    menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) + "px";
  }

  // Close the menu on outside clicks, Escape, or page scroll.
  document.addEventListener(
    "mousedown",
    (e) => {
      const menu = document.getElementById(MENU_ID);
      if (menu && !menu.contains(e.target) && !e.target.closest(".htg-action")) closeMenu();
    },
    true
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener(
    "scroll",
    (e) => {
      const menu = document.getElementById(MENU_ID);
      if (menu && !menu.contains(e.target)) closeMenu();
    },
    true
  );

  // ---- Start up ----

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // When data changes in the popup, update the page right away.
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[HTG.STORAGE_KEY]) return;
    const next = changes[HTG.STORAGE_KEY].newValue;
    data = next
      ? { handles: next.handles || {}, customLabels: next.customLabels || [] }
      : HTG.emptyData();
    scanAll();
  });

  HTG.getData().then((loaded) => {
    data = loaded;
    scanAll();
  });
})();
