/*
 * Handle Tagger - shared helpers.
 * Loaded by both the X page script (content.js) and the popup (popup.js).
 * Nothing here touches the network.
 */
const HTG = {
  STORAGE_KEY: "htgData",

  // Built-in labels. Users can add their own in the popup.
  PREBUILT_LABELS: [
    { id: "engagement-farmer", name: "Engagement farmer", color: "#e8590c" },
    { id: "bot-like", name: "Bot-like", color: "#868e96" },
    { id: "bad-faith", name: "Bad faith", color: "#c92a2a" },
    { id: "trusted", name: "Trusted", color: "#2b8a3e" }
  ],

  // First path segments on X that are pages, not usernames.
  RESERVED_PATHS: new Set([
    "home", "explore", "notifications", "messages", "search", "settings",
    "i", "compose", "login", "logout", "signup", "tos", "privacy", "lists",
    "bookmarks", "communities", "premium", "jobs", "following", "followers",
    "hashtag", "intent", "share", "account", "help"
  ]),

  emptyData() {
    return { handles: {}, customLabels: [] };
  },

  // Reads everything from browser local storage.
  async getData() {
    const result = await browser.storage.local.get(HTG.STORAGE_KEY);
    const d = result[HTG.STORAGE_KEY];
    if (!d) return HTG.emptyData();
    return {
      handles: d.handles || {},
      customLabels: Array.isArray(d.customLabels) ? d.customLabels : []
    };
  },

  async saveData(data) {
    await browser.storage.local.set({ [HTG.STORAGE_KEY]: data });
  },

  allLabels(data) {
    return HTG.PREBUILT_LABELS.concat(data.customLabels);
  },

  findLabel(data, id) {
    return HTG.allLabels(data).find((label) => label.id === id);
  },

  // "@Some_User" -> "some_user". Returns "" if it is not a valid X handle.
  normalizeHandle(raw) {
    const h = String(raw || "").trim().replace(/^@/, "").toLowerCase();
    return /^[a-z0-9_]{1,15}$/.test(h) ? h : "";
  },

  // "https://x.com/someone/status/123" -> "someone". Returns "" for non-profile pages.
  handleFromUrl(url) {
    try {
      const u = new URL(url);
      if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(u.hostname)) return "";
      const first = u.pathname.split("/").filter(Boolean)[0] || "";
      if (HTG.RESERVED_PATHS.has(first.toLowerCase())) return "";
      return HTG.normalizeHandle(first);
    } catch (e) {
      return "";
    }
  },

  // Picks black or white text so a badge stays readable on its color.
  textColorFor(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 160 ? "#1a1a1a" : "#ffffff";
  }
};
