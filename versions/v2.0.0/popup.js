/*
 * Handle Tagger - popup panel logic.
 * Opens from the toolbar icon or the Alt+Shift+T shortcut.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  let data = HTG.emptyData();
  let noteTimer = null;

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
    const tags = h ? HTG.getEntry(data, h).tags : [];
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

  function renderNote() {
    const h = currentHandle();
    const box = $("note");
    // Don't overwrite text the user is typing right now.
    if (document.activeElement !== box) {
      box.value = h ? HTG.getEntry(data, h).note : "";
    }
    box.disabled = !h;
  }

  async function toggleTag(h, id) {
    if (!h) return;
    const current = HTG.getEntry(data, h);
    const set = new Set(current.tags);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    HTG.setEntry(data, h, [...set], current.note);
    await persist();
    refresh();
    show("Saved.");
  }

  // Saves the note shortly after typing stops.
  function onNoteInput() {
    clearTimeout(noteTimer);
    $("noteStatus").textContent = "Typing...";
    noteTimer = setTimeout(async () => {
      const h = currentHandle();
      if (!h) return;
      const current = HTG.getEntry(data, h);
      HTG.setEntry(data, h, current.tags, $("note").value);
      await persist();
      $("noteStatus").textContent = "Note saved.";
      renderTagged();
      renderFilter();
    }, 400);
  }

  function renderCustom() {
    const box = $("customList");
    box.replaceChildren();
    if (data.customLabels.length === 0) {
      box.textContent = "No custom labels yet.";
      return;
    }
    const counts = HTG.countByLabel(data);
    for (const label of data.customLabels) {
      const row = document.createElement("div");
      row.className = "customRow";

      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = label.color;

      const name = document.createElement("span");
      name.className = "grow";
      name.textContent = label.name + " (" + (counts[label.id] || 0) + ")";

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
      const current = HTG.getEntry(data, h);
      HTG.setEntry(data, h, current.tags.filter((t) => t !== id), current.note);
    }
    await persist();
    if ($("labelFilter").value === id) $("labelFilter").value = "";
    refresh();
    show("Label deleted.");
  }

  // Dropdown of labels with how many accounts use each one.
  function renderFilter() {
    const select = $("labelFilter");
    const previous = select.value;
    const counts = HTG.countByLabel(data);
    select.replaceChildren();

    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All labels";
    select.appendChild(all);

    for (const label of HTG.allLabels(data)) {
      const opt = document.createElement("option");
      opt.value = label.id;
      opt.textContent = label.name + " (" + (counts[label.id] || 0) + ")";
      select.appendChild(opt);
    }
    // Keep the selection if that label still exists.
    select.value = [...select.options].some((o) => o.value === previous) ? previous : "";
  }

  function renderTagged() {
    const filter = $("search").value.trim().toLowerCase();
    const labelId = $("labelFilter").value;
    const list = $("taggedList");
    list.replaceChildren();

    const handles = Object.keys(data.handles)
      .sort()
      .filter((h) => !filter || h.includes(filter))
      .filter((h) => !labelId || HTG.getEntry(data, h).tags.includes(labelId));

    const labelName = labelId ? (HTG.findLabel(data, labelId) || {}).name : "";
    $("filterSummary").textContent = labelId
      ? handles.length + " account(s) with " + labelName
      : "";

    if (handles.length === 0) {
      const empty = document.createElement("li");
      empty.className = "muted";
      empty.textContent = filter || labelId ? "No matches." : "No tagged accounts yet.";
      list.appendChild(empty);
      return;
    }

    for (const h of handles) {
      const entry = HTG.getEntry(data, h);
      const li = document.createElement("li");

      const open = document.createElement("button");
      open.className = "link";
      open.textContent = "@" + h;
      open.addEventListener("click", () => {
        $("handle").value = h;
        refresh();
      });

      const info = document.createElement("span");
      info.className = "grow small muted";
      const names = entry.tags
        .map((id) => (HTG.findLabel(data, id) || {}).name)
        .filter(Boolean)
        .join(", ");
      info.textContent = names;
      if (entry.note) {
        const note = document.createElement("div");
        note.className = "notePreview";
        note.textContent = entry.note;
        info.appendChild(note);
      }

      const remove = document.createElement("button");
      remove.className = "dangerBtn";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => {
        if (!confirm("Remove all tags and the note for @" + h + "?")) return;
        delete data.handles[h];
        await persist();
        refresh();
        show("Removed @" + h + ".");
      });

      li.append(open, info, remove);
      list.appendChild(li);
    }
  }

  function refresh() {
    renderHandleStatus();
    renderChips();
    renderNote();
    renderCustom();
    renderFilter();
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
      version: 2,
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

  // Reads a chosen file as text. FileReader works in every browser.
  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("could not read the file"));
      reader.readAsText(file);
    });
  }

  // Import a backup file. It merges with what you already have.
  // Accepts version 1 (no notes) and version 2 backups.
  $("importBtn").addEventListener("click", () => $("importFile").click());

  $("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await readFileText(file));
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
        const importedNote = typeof entry.note === "string" ? entry.note : "";
        if (known.length === 0 && !importedNote) continue;

        const current = HTG.getEntry(data, h);
        const isNew = !data.handles[h];
        const tags = [...new Set(current.tags.concat(known))];
        // Keep the note you already wrote; only fill in when it's empty.
        const note = current.note || importedNote;
        HTG.setEntry(data, h, tags, note);
        if (isNew) newHandles++;
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
  $("note").addEventListener("input", onNoteInput);
  $("search").addEventListener("input", renderTagged);
  $("labelFilter").addEventListener("change", renderTagged);

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
