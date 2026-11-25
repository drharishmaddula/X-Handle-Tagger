/*
 * Handle Tagger - popup panel logic.
 * Opens from the toolbar icon or the Alt+Shift+T shortcut.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  let data = HTG.emptyData();

  function show(msg, isError) {
    const el = $("message");
    el.textContent = msg || "";
    el.className = "small " + (isError ? "error" : "muted");
  }

  async function persist() {
    await HTG.saveData(data);
  }

  function currentHandle() {
    return HTG.normalizeHandle($("handle").value);
  }

  function renderHandleStatus() {
    const raw = $("handle").value.trim();
    const status = $("handleStatus");
    if (!raw) {
      status.textContent = "Type a handle or open an X profile.";
    } else if (!currentHandle()) {
      status.textContent = "That doesn't look like a valid handle.";
    } else {
      status.textContent = "Tags apply to @" + currentHandle() + ".";
    }
  }

  function renderChips() {
    const h = currentHandle();
    const tags = h && data.handles[h] ? data.handles[h].tags : [];
    const list = $("labelList");
    list.replaceChildren();

    for (const label of HTG.allLabels(data)) {
      const chip = document.createElement("button");
      chip.className = "chip" + (tags.includes(label.id) ? " on" : "");
      chip.textContent = label.name;
      chip.style.setProperty("--c", label.color);
      chip.disabled = !h;
      chip.addEventListener("click", () => toggleTag(h, label.id));
      list.appendChild(chip);
    }
  }

  async function toggleTag(h, id) {
    if (!h) return;
    const entry = data.handles[h] || { tags: [] };
    const set = new Set(entry.tags);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    if (set.size > 0) {
      data.handles[h] = { tags: [...set], updated: Date.now() };
    } else {
      delete data.handles[h];
    }
    await persist();
    refresh();
    show("Saved.");
  }

  function renderCustom() {
    const box = $("customList");
    box.replaceChildren();
    if (data.customLabels.length === 0) {
      box.textContent = "No custom labels yet.";
      return;
    }
    for (const label of data.customLabels) {
      const row = document.createElement("div");
      row.className = "customRow";

      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = label.color;

      const name = document.createElement("span");
      name.className = "grow";
      name.textContent = label.name;

      const del = document.createElement("button");
      del.className = "dangerBtn";
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteCustomLabel(label.id, label.name));

      row.append(swatch, name, del);
      box.appendChild(row);
    }
  }

  async function deleteCustomLabel(id, name) {
    if (!confirm('Delete the label "' + name + '" from all accounts?')) return;
    data.customLabels = data.customLabels.filter((l) => l.id !== id);
    for (const h of Object.keys(data.handles)) {
      const tags = data.handles[h].tags.filter((t) => t !== id);
      if (tags.length) {
        data.handles[h].tags = tags;
      } else {
        delete data.handles[h];
      }
    }
    await persist();
    refresh();
    show("Label deleted.");
  }

  function renderTagged() {
    const filter = $("search").value.trim().toLowerCase();
    const list = $("taggedList");
    list.replaceChildren();

    const handles = Object.keys(data.handles)
      .sort()
      .filter((h) => !filter || h.includes(filter));

    if (handles.length === 0) {
      const empty = document.createElement("li");
      empty.className = "muted";
      empty.textContent = filter ? "No matches." : "No tagged accounts yet.";
      list.appendChild(empty);
      return;
    }

    for (const h of handles) {
      const li = document.createElement("li");

      const open = document.createElement("button");
      open.className = "link";
      open.textContent = "@" + h;
      open.addEventListener("click", () => {
        $("handle").value = h;
        refresh();
      });

      const tagNames = document.createElement("span");
      tagNames.className = "grow small muted";
      tagNames.textContent = data.handles[h].tags
        .map((id) => (HTG.findLabel(data, id) || {}).name)
        .filter(Boolean)
        .join(", ");

      const remove = document.createElement("button");
      remove.className = "dangerBtn";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => {
        if (!confirm("Remove all tags from @" + h + "?")) return;
        delete data.handles[h];
        await persist();
        refresh();
        show("Removed @" + h + ".");
      });

      li.append(open, tagNames, remove);
      list.appendChild(li);
    }
  }

  function refresh() {
    renderHandleStatus();
    renderChips();
    renderCustom();
    renderTagged();
  }

  // Add a custom label.
  $("addLabel").addEventListener("click", async () => {
    const name = $("newLabelName").value.trim();
    const color = $("newLabelColor").value;
    if (!name) {
      show("Type a label name first.", true);
      return;
    }
    const exists = HTG.allLabels(data).some(
      (l) => l.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      show("A label with that name already exists.", true);
      return;
    }
    data.customLabels.push({
      id: "custom-" + Date.now().toString(36),
      name: name,
      color: color
    });
    await persist();
    $("newLabelName").value = "";
    refresh();
    show("Label added.");
  });

  // Export everything to a .json file.
  $("exportBtn").addEventListener("click", () => {
    const payload = {
      format: "x-handle-tagger",
      version: 1,
      exportedAt: new Date().toISOString(),
      customLabels: data.customLabels,
      handles: data.handles
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "handle-tagger-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    show("Backup file downloaded.");
  });

  // Import a backup file. It merges with what you already have.
  $("importBtn").addEventListener("click", () => $("importFile").click());

  $("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.format !== "x-handle-tagger" || typeof parsed.handles !== "object") {
        throw new Error("this is not a Handle Tagger backup file");
      }

      let newLabels = 0;
      let newHandles = 0;

      for (const label of parsed.customLabels || []) {
        if (!label || !label.id || !label.name || !/^#[0-9a-f]{6}$/i.test(label.color)) continue;
        const name = String(label.name).slice(0, 30);
        const clash = HTG.allLabels(data).some(
          (l) => l.id === String(label.id) || l.name.toLowerCase() === name.toLowerCase()
        );
        if (clash) continue;
        data.customLabels.push({ id: String(label.id), name: name, color: label.color });
        newLabels++;
      }

      for (const [rawHandle, entry] of Object.entries(parsed.handles)) {
        const h = HTG.normalizeHandle(rawHandle);
        if (!h || !entry || !Array.isArray(entry.tags)) continue;
        const known = entry.tags.filter((id) => HTG.findLabel(data, id));
        if (known.length === 0) continue;
        const existing = data.handles[h] ? data.handles[h].tags : [];
        if (!data.handles[h]) newHandles++;
        data.handles[h] = { tags: [...new Set(existing.concat(known))], updated: Date.now() };
      }

      await persist();
      refresh();
      show("Import done: " + newHandles + " new accounts, " + newLabels + " new labels.");
    } catch (err) {
      show("Import failed: " + err.message, true);
    }
    event.target.value = "";
  });

  $("handle").addEventListener("input", refresh);
  $("search").addEventListener("input", renderTagged);

  // Start: load data and fill in the account from the open tab, if it is a profile.
  async function init() {
    data = await HTG.getData();
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const fromTab = tabs[0] ? HTG.handleFromUrl(tabs[0].url || "") : "";
    if (fromTab) $("handle").value = fromTab;
    refresh();
  }

  init();
})();
