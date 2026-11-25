/*
 * Handle Tagger - page script for x.com / twitter.com.
 * Finds each username block on the page and adds colored badges after the name.
 */
(function () {
  "use strict";

  // X marks username blocks with these test ids (tweets, profiles, hover cards).
  const USER_NAME_SELECTOR = '[data-testid="User-Name"], [data-testid="UserName"]';
  const WRAP_CLASS = "htg-wrap";

  let data = HTG.emptyData();
  let scanTimer = null;

  // Reads the @handle from a username block, ignoring the badges we added.
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

    const entry = data.handles[handle];
    const tagIds = entry && Array.isArray(entry.tags) ? entry.tags : [];
    const labels = tagIds.map((id) => HTG.findLabel(data, id)).filter(Boolean);

    if (labels.length === 0) {
      if (wrap) wrap.remove();
      return;
    }

    // Only rebuild the badges when something actually changed.
    const key = handle + "|" + labels.map((l) => l.id + l.name + l.color).join(",");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = WRAP_CLASS;
      container.appendChild(wrap);
    }
    if (wrap.dataset.key === key) return;
    wrap.dataset.key = key;
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

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // When tags change in the popup, update the page right away.
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
