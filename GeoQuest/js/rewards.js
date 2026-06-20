/* ============================================================
   GeoQuest - Recompensas y Pase de Temporada v2
   60 tiers · Tienda de monedas · Temporada mensual
   ============================================================ */

// ── FONDOS ──────────────────────────────────────────────────
const BACKGROUNDS = {
  default:     { name:{en:"Midnight",es:"Medianoche"},         css:"linear-gradient(160deg,#0f172a,#1e293b)" },
  ocean:       { name:{en:"Deep Ocean",es:"Océano Profundo"},  css:"linear-gradient(160deg,#0a2540,#1e6091,#168aad)" },
  sunset:      { name:{en:"Sahara Sunset",es:"Atardecer Sáhara"}, css:"linear-gradient(160deg,#7b2d26,#d97706,#fbbf24)" },
  aurora:      { name:{en:"Aurora",es:"Aurora"},               css:"linear-gradient(160deg,#0d1b2a,#1b4332,#2d6a4f,#40916c)" },
  cherry:      { name:{en:"Cherry Blossom",es:"Flor de Cerezo"}, css:"linear-gradient(160deg,#4a044e,#9d174d,#f472b6)" },
  arctic:      { name:{en:"Arctic",es:"Ártico"},               css:"linear-gradient(160deg,#1e3a5f,#3b82f6,#93c5fd)" },
  volcano:     { name:{en:"Volcano",es:"Volcán"},              css:"linear-gradient(160deg,#1a0000,#7f1d1d,#dc2626,#f59e0b)" },
  rainforest:  { name:{en:"Rainforest",es:"Selva"},            css:"linear-gradient(160deg,#052e16,#166534,#22c55e)" },
  galaxy:      { name:{en:"Galaxy",es:"Galaxia"},              css:"linear-gradient(160deg,#0c0a1d,#312e81,#6d28d9,#a21caf)" },
  desert:      { name:{en:"Golden Dunes",es:"Dunas Doradas"},  css:"linear-gradient(160deg,#451a03,#b45309,#fcd34d)" },
  tropical:    { name:{en:"Tropical Reef",es:"Arrecife Tropical"}, css:"linear-gradient(160deg,#042f2e,#0d9488,#5eead4)" },
  royal:       { name:{en:"Royal",es:"Real"},                  css:"linear-gradient(160deg,#1e1b4b,#4338ca,#818cf8,#facc15)" },
  // tier 31-60 & shop exclusives
  nebula:      { name:{en:"Nebula",es:"Nebulosa"},             css:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)" },
  savanna:     { name:{en:"Savanna",es:"Sabana"},              css:"linear-gradient(160deg,#7c4700,#c97d0c,#e8c96b)" },
  neon:        { name:{en:"Neon City",es:"Ciudad Neón"},       css:"linear-gradient(160deg,#0a0a0a,#1a0030,#00f5ff,#ff00c8)" },
  iceage:      { name:{en:"Ice Age",es:"Era de Hielo"},        css:"linear-gradient(160deg,#e0f2fe,#7dd3fc,#0369a1)" },
  deepspace:   { name:{en:"Deep Space",es:"Espacio Profundo"}, css:"linear-gradient(160deg,#000000,#0d0d1a,#1a0050)" },
  lava:        { name:{en:"Lava Flow",es:"Flujo de Lava"},     css:"linear-gradient(160deg,#300000,#8b0000,#ff4500,#ff8c00)" },
  midnight_gold:{ name:{en:"Midnight Gold",es:"Oro Nocturno"}, css:"linear-gradient(160deg,#0a0a00,#1a1a00,#3d3400,#b8860b)" },
  bioluminescent:{ name:{en:"Bioluminescent",es:"Bioluminiscente"}, css:"linear-gradient(160deg,#000d1a,#003366,#006994,#00e5ff)" },
  // shop-only (coin_shop source)
  candy:       { name:{en:"Candy Dream",es:"Sueño de Caramelo"}, css:"linear-gradient(160deg,#ff6b9d,#c44dff,#ff6b35)" },
  matrix:      { name:{en:"Matrix",es:"Matriz"},               css:"linear-gradient(160deg,#000000,#001100,#003300,#00ff00)" },
  cosmic:      { name:{en:"Cosmic Dust",es:"Polvo Cósmico"},   css:"linear-gradient(160deg,#1a0533,#6b21a8,#ec4899,#fb923c)" },
  northern:    { name:{en:"Northern Lights",es:"Luces del Norte"}, css:"linear-gradient(160deg,#0a1628,#0d4f3c,#1aff8c,#0080ff)" }
};

// ── TEMAS ────────────────────────────────────────────────────
const THEMES = {
  emerald:  { name:{en:"Emerald",es:"Esmeralda"},   accent:"#10b981", accent2:"#34d399" },
  ruby:     { name:{en:"Ruby",es:"Rubí"},           accent:"#ef4444", accent2:"#f87171" },
  sapphire: { name:{en:"Sapphire",es:"Zafiro"},     accent:"#3b82f6", accent2:"#60a5fa" },
  amethyst: { name:{en:"Amethyst",es:"Amatista"},   accent:"#a855f7", accent2:"#c084fc" },
  gold:     { name:{en:"Gold",es:"Oro"},            accent:"#f59e0b", accent2:"#fbbf24" },
  rose:     { name:{en:"Rose",es:"Rosa"},           accent:"#ec4899", accent2:"#f472b6" },
  cyan:     { name:{en:"Cyan",es:"Cian"},           accent:"#06b6d4", accent2:"#22d3ee" },
  lime:     { name:{en:"Lime",es:"Lima"},           accent:"#84cc16", accent2:"#a3e635" },
  // tier/shop extras
  lava_t:   { name:{en:"Lava",es:"Lava"},           accent:"#f97316", accent2:"#fb923c" },
  ice_t:    { name:{en:"Ice",es:"Hielo"},           accent:"#e0f2fe", accent2:"#7dd3fc" },
  neon_t:   { name:{en:"Neon",es:"Neón"},           accent:"#00f5ff", accent2:"#ff00c8" },
  silver:   { name:{en:"Silver",es:"Plata"},        accent:"#94a3b8", accent2:"#cbd5e1" }
};

// ── AVATARES ─────────────────────────────────────────────────
const AVATARS = {
  explorer:  { name:{en:"Explorer",es:"Explorador"},   emoji:"🧭" },
  globe:     { name:{en:"Globe",es:"Globo"},           emoji:"🌍" },
  pilot:     { name:{en:"Pilot",es:"Piloto"},          emoji:"✈️" },
  sailor:    { name:{en:"Sailor",es:"Marinero"},       emoji:"⛵" },
  mountain:  { name:{en:"Climber",es:"Montañero"},     emoji:"🏔️" },
  camel:     { name:{en:"Nomad",es:"Nómada"},          emoji:"🐪" },
  astronaut: { name:{en:"Astronaut",es:"Astronauta"},  emoji:"🧑‍🚀" },
  king:      { name:{en:"Monarch",es:"Monarca"},       emoji:"👑" },
  dragon:    { name:{en:"Dragon",es:"Dragón"},         emoji:"🐉" },
  compass:   { name:{en:"Cartographer",es:"Cartógrafo"}, emoji:"🗺️" },
  // tier 31-60 extras
  scientist: { name:{en:"Scientist",es:"Científico"},  emoji:"🔬" },
  ninja:     { name:{en:"Ninja",es:"Ninja"},           emoji:"🥷" },
  wizard:    { name:{en:"Wizard",es:"Mago"},           emoji:"🧙" },
  robot:     { name:{en:"Robot",es:"Robot"},           emoji:"🤖" },
  // shop-only
  phoenix:   { name:{en:"Phoenix",es:"Fénix"},         emoji:"🦅" },
  unicorn:   { name:{en:"Unicorn",es:"Unicornio"},     emoji:"🦄" },
  alien:     { name:{en:"Alien",es:"Alien"},           emoji:"👽" },
  pirate:    { name:{en:"Pirate",es:"Pirata"},         emoji:"🏴‍☠️" }
};

// ── TÍTULOS ──────────────────────────────────────────────────
const TITLES = {
  rookie:       { name:{en:"Rookie",es:"Novato"} },
  traveler:     { name:{en:"Traveler",es:"Viajero"} },
  navigator:    { name:{en:"Navigator",es:"Navegante"} },
  cartographer: { name:{en:"Cartographer",es:"Cartógrafo"} },
  globetrotter: { name:{en:"Globetrotter",es:"Trotamundos"} },
  geomaster:    { name:{en:"Geo Master",es:"Maestro Geo"} },
  legend:       { name:{en:"World Legend",es:"Leyenda Mundial"} },
  // tier 31-60
  professor:    { name:{en:"Professor",es:"Profesor"} },
  champion:     { name:{en:"Champion",es:"Campeón"} },
  grandmaster:  { name:{en:"Grand Master",es:"Gran Maestro"} },
  // shop-only
  perfectionist:{ name:{en:"Perfectionist",es:"Perfeccionista"} },
  coinlord:     { name:{en:"Coin Lord",es:"Señor de las Monedas"} }
};

// ── PASE DE TEMPORADA: 60 tiers ──────────────────────────────
const XP_PER_TIER = 200;  // 60 * 200 = 12 000 XP para completar la temporada

const SEASON_PASS = [
  // ── Bloque 1 (1-10) ─────────────────────────────────────
  { tier:  1, reward:{type:"coins",  value:75  } },
  { tier:  2, reward:{type:"avatar", value:"globe"      } },
  { tier:  3, reward:{type:"bg",     value:"ocean"      } },
  { tier:  4, reward:{type:"coins",  value:100 } },
  { tier:  5, reward:{type:"theme",  value:"sapphire"   } },
  { tier:  6, reward:{type:"title",  value:"traveler"   } },
  { tier:  7, reward:{type:"avatar", value:"pilot"      } },
  { tier:  8, reward:{type:"bg",     value:"sunset"     } },
  { tier:  9, reward:{type:"coins",  value:150 } },
  { tier: 10, reward:{type:"theme",  value:"gold"       } },
  // ── Bloque 2 (11-20) ────────────────────────────────────
  { tier: 11, reward:{type:"avatar", value:"sailor"     } },
  { tier: 12, reward:{type:"bg",     value:"aurora"     } },
  { tier: 13, reward:{type:"title",  value:"navigator"  } },
  { tier: 14, reward:{type:"coins",  value:200 } },
  { tier: 15, reward:{type:"theme",  value:"ruby"       } },
  { tier: 16, reward:{type:"avatar", value:"mountain"   } },
  { tier: 17, reward:{type:"bg",     value:"cherry"     } },
  { tier: 18, reward:{type:"coins",  value:250 } },
  { tier: 19, reward:{type:"theme",  value:"amethyst"   } },
  { tier: 20, reward:{type:"title",  value:"cartographer"} },
  // ── Bloque 3 (21-30) ────────────────────────────────────
  { tier: 21, reward:{type:"avatar", value:"camel"      } },
  { tier: 22, reward:{type:"bg",     value:"arctic"     } },
  { tier: 23, reward:{type:"theme",  value:"rose"       } },
  { tier: 24, reward:{type:"avatar", value:"astronaut"  } },
  { tier: 25, reward:{type:"bg",     value:"volcano"    } },
  { tier: 26, reward:{type:"coins",  value:300 } },
  { tier: 27, reward:{type:"theme",  value:"cyan"       } },
  { tier: 28, reward:{type:"bg",     value:"galaxy"     } },
  { tier: 29, reward:{type:"avatar", value:"king"       } },
  { tier: 30, reward:{type:"title",  value:"globetrotter"} },
  // ── Bloque 4 (31-40) – NUEVO ─────────────────────────────
  { tier: 31, reward:{type:"coins",  value:350 } },
  { tier: 32, reward:{type:"bg",     value:"nebula"     } },
  { tier: 33, reward:{type:"avatar", value:"scientist"  } },
  { tier: 34, reward:{type:"theme",  value:"lava_t"     } },
  { tier: 35, reward:{type:"bg",     value:"savanna"    } },
  { tier: 36, reward:{type:"title",  value:"professor"  } },
  { tier: 37, reward:{type:"coins",  value:400 } },
  { tier: 38, reward:{type:"avatar", value:"ninja"      } },
  { tier: 39, reward:{type:"bg",     value:"neon"       } },
  { tier: 40, reward:{type:"theme",  value:"ice_t"      } },
  // ── Bloque 5 (41-50) – NUEVO ─────────────────────────────
  { tier: 41, reward:{type:"coins",  value:450 } },
  { tier: 42, reward:{type:"bg",     value:"iceage"     } },
  { tier: 43, reward:{type:"avatar", value:"wizard"     } },
  { tier: 44, reward:{type:"theme",  value:"neon_t"     } },
  { tier: 45, reward:{type:"bg",     value:"deepspace"  } },
  { tier: 46, reward:{type:"title",  value:"champion"   } },
  { tier: 47, reward:{type:"coins",  value:500 } },
  { tier: 48, reward:{type:"avatar", value:"robot"      } },
  { tier: 49, reward:{type:"bg",     value:"lava"       } },
  { tier: 50, reward:{type:"theme",  value:"silver"     } },
  // ── Bloque 6 (51-60) – ÉPICO ────────────────────────────
  { tier: 51, reward:{type:"coins",  value:600 } },
  { tier: 52, reward:{type:"bg",     value:"midnight_gold"} },
  { tier: 53, reward:{type:"avatar", value:"compass"    } },
  { tier: 54, reward:{type:"bg",     value:"bioluminescent"} },
  { tier: 55, reward:{type:"title",  value:"geomaster"  } },
  { tier: 56, reward:{type:"coins",  value:700 } },
  { tier: 57, reward:{type:"bg",     value:"desert"     } },
  { tier: 58, reward:{type:"avatar", value:"dragon"     } },
  { tier: 59, reward:{type:"coins",  value:800 } },
  { tier: 60, reward:{type:"title",  value:"grandmaster"} }
];

// ── TIENDA DE MONEDAS — CATÁLOGO BASE (todos los ítems posibles) ──
// Cada ítem tiene un id único. Las rotaciones mensuales referencian
// subconjuntos de estos ids.
const COIN_SHOP_ALL = [
  // ── Fondos exclusivos ──────────────────────────────────────
  { id:"shop_candy",    type:"bg",       value:"candy",        price:400, name:{en:"Candy Dream BG",        es:"Fondo Caramelo"} },
  { id:"shop_matrix",   type:"bg",       value:"matrix",       price:350, name:{en:"Matrix BG",             es:"Fondo Matriz"} },
  { id:"shop_cosmic",   type:"bg",       value:"cosmic",       price:500, name:{en:"Cosmic Dust BG",        es:"Fondo Cósmico"} },
  { id:"shop_northern", type:"bg",       value:"northern",     price:450, name:{en:"Northern Lights BG",    es:"Luces del Norte"} },
  // ── Avatares exclusivos ────────────────────────────────────
  { id:"shop_phoenix",  type:"avatar",   value:"phoenix",      price:300, name:{en:"Phoenix Avatar",        es:"Avatar Fénix"} },
  { id:"shop_unicorn",  type:"avatar",   value:"unicorn",      price:350, name:{en:"Unicorn Avatar",        es:"Avatar Unicornio"} },
  { id:"shop_alien",    type:"avatar",   value:"alien",        price:250, name:{en:"Alien Avatar",          es:"Avatar Alien"} },
  { id:"shop_pirate",   type:"avatar",   value:"pirate",       price:275, name:{en:"Pirate Avatar",         es:"Avatar Pirata"} },
  // ── Títulos exclusivos ─────────────────────────────────────
  { id:"shop_perf",     type:"title",    value:"perfectionist",price:500, name:{en:"Perfectionist Title",   es:"Título Perfeccionista"} },
  { id:"shop_coinlord", type:"title",    value:"coinlord",     price:600, name:{en:"Coin Lord Title",       es:"Título Señor Monedas"} },
  // ── Temas exclusivos ────────────────────────────────────────
  { id:"shop_lime",     type:"theme",    value:"lime",         price:200, name:{en:"Lime Theme",            es:"Tema Lima"} },
  // ── Boosts de XP (consumibles) ────────────────────────────
  { id:"shop_xp2",      type:"xp_boost", value:2,             price:150, name:{en:"XP ×2 (1 game)",        es:"XP ×2 (1 partida)"},  consumable:true },
  { id:"shop_xp3",      type:"xp_boost", value:3,             price:350, name:{en:"XP ×3 (1 game)",        es:"XP ×3 (1 partida)"},  consumable:true },
  // ── Escudos (consumibles) ────────────────────────────────────
  { id:"shop_shield",   type:"shield",   value:1,             price:100, name:{en:"Extra Life Shield",     es:"Escudo de Vida Extra"}, consumable:true }
];

// ── ROTACIONES MENSUALES DE LA TIENDA ─────────────────────────
// 6 catálogos que rotan cíclicamente mes a mes (mes % 6).
// Cada catálogo incluye: 2 fondos, 2 avatares, 1 título, 1 tema
// + los consumibles (siempre presentes).
// Los consumibles se añaden automáticamente en getMonthlyShop().
const COIN_SHOP_ROTATIONS = [
  // ── Rotación 0 (ene, jul …) ───────────────────────────────
  ["shop_candy", "shop_cosmic", "shop_phoenix", "shop_unicorn", "shop_perf",     "shop_lime"],
  // ── Rotación 1 (feb, ago …) ───────────────────────────────
  ["shop_matrix","shop_northern","shop_alien",  "shop_pirate",  "shop_coinlord", "shop_lime"],
  // ── Rotación 2 (mar, sep …) ───────────────────────────────
  ["shop_candy", "shop_northern","shop_phoenix","shop_alien",   "shop_perf",     "shop_lime"],
  // ── Rotación 3 (abr, oct …) ───────────────────────────────
  ["shop_cosmic","shop_matrix",  "shop_unicorn","shop_pirate",  "shop_coinlord", "shop_lime"],
  // ── Rotación 4 (may, nov …) ───────────────────────────────
  ["shop_northern","shop_candy", "shop_alien",  "shop_unicorn", "shop_perf",     "shop_lime"],
  // ── Rotación 5 (jun, dic …) ───────────────────────────────
  ["shop_cosmic","shop_matrix",  "shop_phoenix","shop_pirate",  "shop_coinlord", "shop_lime"]
];

// Consumibles siempre disponibles en cualquier rotación
const COIN_SHOP_CONSUMABLES = ["shop_xp2","shop_xp3","shop_shield"];

/**
 * Devuelve el catálogo de la tienda para el mes dado.
 * @param {string} monthStr  "YYYY-MM"  — si se omite usa el mes actual
 * @returns {Array}  Array de objetos ítem listos para renderizar
 */
function getMonthlyShop(monthStr) {
  const ms   = monthStr || new Date().toISOString().slice(0, 7);
  const [, mm] = ms.split("-");
  const idx  = (parseInt(mm, 10) - 1) % COIN_SHOP_ROTATIONS.length; // 0-5
  const ids  = [...COIN_SHOP_ROTATIONS[idx], ...COIN_SHOP_CONSUMABLES];
  return ids.map(id => COIN_SHOP_ALL.find(i => i.id === id)).filter(Boolean);
}

// Alias de compatibilidad — apunta al catálogo del mes actual
const COIN_SHOP = getMonthlyShop();

// ── LOGROS ───────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id:"first_game",   name:{en:"First Steps",es:"Primeros Pasos"},           desc:{en:"Play your first game",es:"Juega tu primera partida"},               icon:"🎯", check:s=>s.stats.games>=1 },
  { id:"streak_5",     name:{en:"On Fire",es:"En Racha"},                     desc:{en:"Get a 5-answer streak",es:"Consigue una racha de 5 aciertos"},       icon:"🔥", check:s=>s.stats.bestStreak>=5 },
  { id:"streak_15",    name:{en:"Unstoppable",es:"Imparable"},                desc:{en:"Get a 15-answer streak",es:"Racha de 15 aciertos"},                  icon:"⚡", check:s=>s.stats.bestStreak>=15 },
  { id:"streak_30",    name:{en:"Legendary",es:"Legendario"},                 desc:{en:"Get a 30-answer streak",es:"Racha de 30 aciertos"},                  icon:"🌟", check:s=>s.stats.bestStreak>=30 },
  { id:"correct_50",   name:{en:"Quick Learner",es:"Aprendiz Veloz"},         desc:{en:"Answer 50 correctly",es:"Acierta 50 respuestas"},                    icon:"📚", check:s=>s.stats.correct>=50 },
  { id:"correct_250",  name:{en:"Geography Buff",es:"Aficionado Geo"},        desc:{en:"Answer 250 correctly",es:"Acierta 250 respuestas"},                  icon:"🌐", check:s=>s.stats.correct>=250 },
  { id:"correct_1000", name:{en:"Geo God",es:"Dios de la Geografía"},         desc:{en:"Answer 1000 correctly",es:"Acierta 1000 respuestas"},                icon:"🏆", check:s=>s.stats.correct>=1000 },
  { id:"games_25",     name:{en:"Dedicated",es:"Dedicado"},                   desc:{en:"Play 25 games",es:"Juega 25 partidas"},                              icon:"🎮", check:s=>s.stats.games>=25 },
  { id:"games_100",    name:{en:"Veteran",es:"Veterano"},                     desc:{en:"Play 100 games",es:"Juega 100 partidas"},                            icon:"🎖️", check:s=>s.stats.games>=100 },
  { id:"level_10",     name:{en:"Double Digits",es:"Dos Cifras"},             desc:{en:"Reach level 10",es:"Alcanza el nivel 10"},                           icon:"🏅", check:s=>s.level>=10 },
  { id:"level_25",     name:{en:"Quarter Century",es:"Cuarto de Siglo"},      desc:{en:"Reach level 25",es:"Alcanza el nivel 25"},                           icon:"💎", check:s=>s.level>=25 },
  { id:"tier_15",      name:{en:"Halfway There",es:"A Mitad de Camino"},      desc:{en:"Reach pass tier 15",es:"Nivel 15 del pase"},                         icon:"🎗️", check:s=>s.passTier>=15 },
  { id:"tier_30",      name:{en:"Season Half",es:"Mitad de Temporada"},       desc:{en:"Reach pass tier 30",es:"Nivel 30 del pase"},                         icon:"🥈", check:s=>s.passTier>=30 },
  { id:"tier_60",      name:{en:"Season Champion",es:"Campeón de Temporada"}, desc:{en:"Complete the season pass",es:"Completa el pase de temporada"},       icon:"🏆", check:s=>s.passTier>=60 },
  { id:"perfect_1",    name:{en:"Flawless",es:"Impecable"},                   desc:{en:"Finish a game with no mistakes",es:"Termina una partida sin errores"},icon:"✨", check:s=>s.stats.perfectGames>=1 },
  { id:"perfect_10",   name:{en:"Perfect Ten",es:"Diez Perfectas"},           desc:{en:"Finish 10 perfect games",es:"10 partidas perfectas"},                icon:"💯", check:s=>s.stats.perfectGames>=10 },
  { id:"custom_mode",  name:{en:"Game Designer",es:"Diseñador de Juegos"},    desc:{en:"Create a custom mode",es:"Crea un modo personalizado"},              icon:"🛠️", check:s=>s.customModes&&s.customModes.length>=1 },
  { id:"spender",      name:{en:"Big Spender",es:"Gran Gastador"},            desc:{en:"Buy something from the shop",es:"Compra algo en la tienda"},         icon:"🛒", check:s=>s.stats.shopBuys>=1 },
  { id:"all_bg",       name:{en:"Collector",es:"Coleccionista"},              desc:{en:"Unlock 8 backgrounds",es:"Desbloquea 8 fondos"},                     icon:"🖼️", check:s=>s.unlocked.bg.length>=8 },
  { id:"streak_day_7", name:{en:"Weekly Warrior",es:"Guerrero Semanal"},      desc:{en:"7-day login streak",es:"7 días seguidos jugando"},                   icon:"📅", check:s=>s.dayStreak>=7 }
];

window.REWARDS = {
  BACKGROUNDS, THEMES, AVATARS, TITLES, SEASON_PASS, ACHIEVEMENTS,
  COIN_SHOP_ALL, COIN_SHOP_ROTATIONS, COIN_SHOP_CONSUMABLES,
  getMonthlyShop,
  COIN_SHOP,   // alias mes actual — se usa sólo en buyShopItem para buscar por id
  XP_PER_TIER
};
