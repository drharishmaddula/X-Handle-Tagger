/*
 * Handle Tagger - background script.
 * The only part of the extension that talks to Ethos.
 * Looks up each X username once, caches the answer, and only sends the username.
 * Your tags and notes are never sent.
 */

// Ethos API address. Confirm this on the first live test; change it here if it differs.
const ETHOS_BASE = "https://api.ethos.network/api/v2";
const ETHOS_CACHE_KEY = "htgEthosCache";

const DAY_MS = 24 * 60 * 60 * 1000;
const TTL_OK_MS = DAY_MS;         // found or not-on-Ethos: check again after 24 hours
const TTL_ERROR_MS = 10 * 60 * 1000; // errors: try again after 10 minutes
const KEEP_MS = 7 * DAY_MS;       // drop cache entries older than this
const GAP_MS = 300;               // pause between live requests, to be gentle on Ethos

const inflight = new Map();
let chain = Promise.resolve();

// Score levels from the Ethos docs: Untrusted 0-799, Questionable 800-1199,
// Neutral 1200-1599, Reputable 1600-1999, Exemplary 2000-2800.
function levelFor(score) {
  if (score >= 2000) return "Exemplary";
  if (score >= 1600) return "Reputable";
  if (score >= 1200) return "Neutral";
  if (score >= 800) return "Questionable";
  return "Untrusted";
}

function isFresh(entry, now) {
  const ttl = entry.status === "error" ? TTL_ERROR_MS : TTL_OK_MS;
  return now - entry.fetchedAt < ttl;
}

// Looks for a numeric score in the places the Ethos response might put it.
function findScore(body) {
  const candidates = [body, body && body.data, body && body.user, body && body.data && body.data.user];
  for (const c of candidates) {
    if (c && typeof c.score === "number") return c.score;
  }
  return null;
}

async function fetchFromEthos(handle) {
  const now = Date.now();
  let res;
  try {
    res = await fetch(ETHOS_BASE + "/user/by/x/" + encodeURIComponent(handle), {
      headers: { Accept: "application/json" }
    });
  } catch (e) {
    return { status: "error", error: "network error", fetchedAt: now };
  }
  if (res.status === 404) return { status: "none", fetchedAt: now };
  if (!res.ok) return { status: "error", error: "HTTP " + res.status, fetchedAt: now };

  let body;
  try {
    body = await res.json();
  } catch (e) {
    return { status: "error", error: "unreadable response", fetchedAt: now };
  }
  const score = findScore(body);
  if (score === null) return { status: "error", error: "unexpected response", fetchedAt: now };
  return { status: "found", score: score, level: levelFor(score), fetchedAt: now };
}

async function readCache() {
  const result = await browser.storage.local.get(ETHOS_CACHE_KEY);
  return result[ETHOS_CACHE_KEY] || {};
}

// Returns a cached result if fresh, otherwise asks Ethos. One request at a time.
function lookup(handle) {
  if (inflight.has(handle)) return inflight.get(handle);

  const run = async () => {
    const cache = await readCache();
    if (cache[handle] && isFresh(cache[handle], Date.now())) return cache[handle];

    const entry = await fetchFromEthos(handle);

    const latest = await readCache();
    const now = Date.now();
    for (const h of Object.keys(latest)) {
      if (now - latest[h].fetchedAt > KEEP_MS) delete latest[h];
    }
    latest[handle] = entry;
    await browser.storage.local.set({ [ETHOS_CACHE_KEY]: latest });

    await new Promise((resolve) => setTimeout(resolve, GAP_MS));
    return entry;
  };

  const result = chain.then(run).finally(() => inflight.delete(handle));
  inflight.set(handle, result);
  chain = result.catch(() => {});
  return result;
}

browser.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "ethos-lookup") return undefined;
  const handle = String(message.handle || "").toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/.test(handle)) {
    return Promise.resolve({ status: "error", error: "bad handle", fetchedAt: Date.now() });
  }
  return lookup(handle).catch((err) => ({
    status: "error",
    error: String((err && err.message) || err),
    fetchedAt: Date.now()
  }));
});
