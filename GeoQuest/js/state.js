/* ============================================================
   GeoQuest - Estado del jugador v2
   Soporte: tienda, XP boost, partidas perfectas, temporada mensual
   ============================================================ */

const STORAGE_KEY = "geoquest_save_v2";

const DEFAULT_STATE = {
  lang: "en",
  name: "Explorer",
  level: 1,
  xp: 0,
  passXp: 0,
  passTier: 0,
  passMonth: "",        // "YYYY-MM" – mes actual de temporada
  shopMonth: "",        // "YYYY-MM" – mes actual de la tienda
  coins: 0,
  dayStreak: 0,
  lastPlayDate: null,
  sound: true,
  equipped: { bg:"default", theme:"emerald", avatar:"explorer", title:"rookie" },
  unlocked:  { bg:["default"], theme:["emerald"], avatar:["explorer"], title:["rookie"] },
  claimedTiers: [],
  shopOwned:  [],       // ids de items de tienda comprados
  xpBoost:    1,        // multiplicador activo (1 = normal)
  customModes: [],
  achievements: [],
  stats: {
    games: 0,
    correct: 0,
    total: 0,
    bestStreak: 0,
    perfectGames: 0,
    shopBuys: 0
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return deepMerge(structuredClone(DEFAULT_STATE), parsed);
  } catch (e) {
    console.warn("Save corrupt, resetting", e);
    return structuredClone(DEFAULT_STATE);
  }
}

function deepMerge(target, src) {
  for (const k in src) {
    if (src[k] && typeof src[k] === "object" && !Array.isArray(src[k]) && typeof target[k] === "object") {
      deepMerge(target[k], src[k]);
    } else {
      target[k] = src[k];
    }
  }
  return target;
}

let STATE = loadState();

function saveState()  { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch(e){} }
function resetState() { STATE = structuredClone(DEFAULT_STATE); saveState(); }

// ── Nivel global ──────────────────────────────────────────────
function xpForLevel(level) { return 200 + (level - 1) * 100; }

function addXp(amount) {
  const boosted = Math.round(amount * (STATE.xpBoost || 1));
  // reset boost after use
  if (STATE.xpBoost > 1) { STATE.xpBoost = 1; }

  const events = { leveledUp:false, newLevel:STATE.level, passTiers:[] };
  STATE.xp      += boosted;
  STATE.passXp  += boosted;

  // nivel
  let lvl = 1, rem = STATE.xp;
  while (rem >= xpForLevel(lvl)) { rem -= xpForLevel(lvl); lvl++; }
  if (lvl > STATE.level) { events.leveledUp = true; events.newLevel = lvl; }
  STATE.level = lvl;

  // pase
  const newTier = Math.min(REWARDS.SEASON_PASS.length, Math.floor(STATE.passXp / REWARDS.XP_PER_TIER));
  if (newTier > STATE.passTier) {
    for (let t = STATE.passTier + 1; t <= newTier; t++) events.passTiers.push(t);
    STATE.passTier = newTier;
  }
  saveState();
  return events;
}

function xpProgressInLevel() {
  let rem = STATE.xp, lvl = 1;
  while (rem >= xpForLevel(lvl)) { rem -= xpForLevel(lvl); lvl++; }
  return { current: rem, needed: xpForLevel(lvl) };
}

function passProgress() {
  const inTier = STATE.passXp % REWARDS.XP_PER_TIER;
  return { current: inTier, needed: REWARDS.XP_PER_TIER };
}

// ── Reinicio mensual del pase ─────────────────────────────────
function checkSeasonReset() {
  const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  if (STATE.passMonth !== thisMonth) {
    STATE.passMonth    = thisMonth;
    STATE.passXp       = 0;
    STATE.passTier     = 0;
    STATE.claimedTiers = [];
    saveState();
    return true; // nueva temporada
  }
  return false;
}

// ── Reclamar tier del pase ────────────────────────────────────
function claimTier(tier) {
  if (tier > STATE.passTier) return { ok:false };
  if (STATE.claimedTiers.includes(tier)) return { ok:false };
  const def = REWARDS.SEASON_PASS.find(p => p.tier === tier);
  if (!def) return { ok:false };
  const r = def.reward;
  if (r.type === "coins") {
    STATE.coins += r.value;
  } else {
    const bucket = STATE.unlocked[r.type];
    if (bucket && !bucket.includes(r.value)) bucket.push(r.value);
  }
  STATE.claimedTiers.push(tier);
  saveState();
  return { ok:true, reward:r };
}

// ── Reinicio mensual de la tienda ────────────────────────────
function checkShopReset() {
  const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  if (STATE.shopMonth !== thisMonth) {
    STATE.shopMonth = thisMonth;
    saveState();
    return true; // nueva rotación de tienda
  }
  return false;
}

// ── Tienda de monedas ─────────────────────────────────────────
function buyShopItem(itemId) {
  // Busca en el catálogo completo (COIN_SHOP_ALL) para permitir compras
  // independientemente de la rotación activa
  const item = REWARDS.COIN_SHOP_ALL.find(i => i.id === itemId);
  if (!item) return { ok:false, reason:"not_found" };
  if (STATE.coins < item.price) return { ok:false, reason:"no_coins" };

  // consumibles permiten múltiples compras
  if (!item.consumable && STATE.shopOwned.includes(itemId)) return { ok:false, reason:"already_owned" };

  STATE.coins -= item.price;

  if (item.consumable) {
    if (item.type === "xp_boost")  STATE.xpBoost  = Math.max(STATE.xpBoost, item.value);
    if (item.type === "shield")    STATE.stats.shieldStored = (STATE.stats.shieldStored || 0) + 1;
  } else {
    const bucket = STATE.unlocked[item.type];
    if (bucket && !bucket.includes(item.value)) bucket.push(item.value);
    STATE.shopOwned.push(itemId);
  }
  STATE.stats.shopBuys = (STATE.stats.shopBuys || 0) + 1;
  saveState();
  return { ok:true, item };
}

// ── Equipar ───────────────────────────────────────────────────
function equip(type, value) {
  if (STATE.unlocked[type] && STATE.unlocked[type].includes(value)) {
    STATE.equipped[type] = value;
    saveState();
    applyCosmetics();
    return true;
  }
  return false;
}

function applyCosmetics() {
  const bg    = REWARDS.BACKGROUNDS[STATE.equipped.bg]    || REWARDS.BACKGROUNDS.default;
  const theme = REWARDS.THEMES[STATE.equipped.theme]      || REWARDS.THEMES.emerald;
  document.documentElement.style.setProperty("--app-bg",   bg.css);
  document.documentElement.style.setProperty("--accent",   theme.accent);
  document.documentElement.style.setProperty("--accent-2", theme.accent2);
}

// ── Racha diaria ──────────────────────────────────────────────
function registerDailyVisit() {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (STATE.lastPlayDate === today) return;
  STATE.dayStreak = (STATE.lastPlayDate === yesterday) ? STATE.dayStreak + 1 : 1;
  STATE.lastPlayDate = today;
  saveState();
}

// ── Registrar partida ─────────────────────────────────────────
function recordGame({ correct, total, bestStreakThisGame, perfect }) {
  STATE.stats.games      += 1;
  STATE.stats.correct    += correct;
  STATE.stats.total      += total;
  if (bestStreakThisGame > STATE.stats.bestStreak) STATE.stats.bestStreak = bestStreakThisGame;
  if (perfect) STATE.stats.perfectGames = (STATE.stats.perfectGames || 0) + 1;
  saveState();
}

// ── Logros ────────────────────────────────────────────────────
function checkAchievements() {
  const newly = [];
  REWARDS.ACHIEVEMENTS.forEach(a => {
    if (!STATE.achievements.includes(a.id) && a.check(STATE)) {
      STATE.achievements.push(a.id);
      newly.push(a);
    }
  });
  if (newly.length) saveState();
  return newly;
}

window.STATE_API = {
  get: () => STATE,
  save: saveState,
  reset: resetState,
  addXp, xpProgressInLevel, passProgress,
  checkSeasonReset, checkShopReset, claimTier, buyShopItem,
  equip, applyCosmetics,
  registerDailyVisit, recordGame, checkAchievements,
  xpForLevel
};
