/* ============================================================
   GeoQuest - Motor de juego v2
   18 tipos de pregunta · Modos oficiales ampliados
   ============================================================ */

(function () {
const GD   = window.GEO_DATA;
const GC   = GD.CONTINENTS;
const fUrl = GD.flagUrl;
const shuf = GD.shuffle;
const rand = GD.randomCountries;
const byCont = GD.countriesByContinent;
const tl   = () => window.I18N_API.t;    // lazy para que i18n esté listo

function t(k) { return window.I18N_API.t(k); }
const L  = () => window.I18N_API.getLang();
const nm = c => c.name[L()];
const cp = c => c.capital[L()];
const cn = code => GC[code][L()];

function pick(pool, n, excl=[]) {
  return shuf(pool.filter(c => !excl.includes(c))).slice(0, n);
}

// ── Tipos base disponibles (usados por el generador) ─────────
const GAME_TYPES = [
  "flags","capitals","flag_to_capital",
  "population","area","continent","capital_hunt",
  "anagram","odd_one_out","bigger_3","pop_rank",
  "flag_color","landlocked","island",
  "language","currency_match","border_count"
];

// ── Modos oficiales (18) ──────────────────────────────────────
const OFFICIAL_MODES = [
  // ── Clásicos ─────────────────────────────────────────────
  { id:"flags",          type:"flags",          icon:"🚩", nameKey:"mode_flags_name",          descKey:"mode_flags_desc",          questions:10, timer:0,  lives:0 },
  { id:"capitals",       type:"capitals",       icon:"🏛️", nameKey:"mode_capitals_name",        descKey:"mode_capitals_desc",        questions:10, timer:0,  lives:0 },
  { id:"flag_to_capital",type:"flag_to_capital",icon:"🏙️", nameKey:"mode_flag_to_capital_name", descKey:"mode_flag_to_capital_desc", questions:10, timer:0,  lives:0 },
  { id:"population",     type:"population",     icon:"👥", nameKey:"mode_population_name",      descKey:"mode_population_desc",      questions:10, timer:0,  lives:0 },
  { id:"area",           type:"area",           icon:"📐", nameKey:"mode_area_name",            descKey:"mode_area_desc",            questions:10, timer:0,  lives:0 },
  { id:"continent",      type:"continent",      icon:"🗺️", nameKey:"mode_continent_name",       descKey:"mode_continent_desc",       questions:10, timer:0,  lives:0 },
  { id:"capital_hunt",   type:"capital_hunt",   icon:"🔎", nameKey:"mode_outline_name",         descKey:"mode_outline_desc",         questions:10, timer:0,  lives:0 },
  // ── Nuevos creativos ──────────────────────────────────────
  { id:"anagram",        type:"anagram",        icon:"🔤", nameKey:"mode_anagram_name",         descKey:"mode_anagram_desc",         questions:10, timer:0,  lives:0 },
  { id:"odd_one_out",    type:"odd_one_out",    icon:"🔍", nameKey:"mode_odd_one_name",         descKey:"mode_odd_one_desc",         questions:10, timer:0,  lives:0 },
  { id:"bigger_3",       type:"bigger_3",       icon:"🏆", nameKey:"mode_bigger3_name",         descKey:"mode_bigger3_desc",         questions:10, timer:0,  lives:0 },
  { id:"pop_rank",       type:"pop_rank",       icon:"📊", nameKey:"mode_poprank_name",         descKey:"mode_poprank_desc",         questions:10, timer:0,  lives:0 },
  { id:"flag_color",     type:"flag_color",     icon:"🎨", nameKey:"mode_flagcolor_name",       descKey:"mode_flagcolor_desc",       questions:10, timer:0,  lives:0 },
  { id:"landlocked",     type:"landlocked",     icon:"🏜️", nameKey:"mode_landlocked_name",      descKey:"mode_landlocked_desc",      questions:10, timer:0,  lives:0 },
  { id:"island",         type:"island",         icon:"🏝️", nameKey:"mode_island_name",          descKey:"mode_island_desc",          questions:10, timer:0,  lives:0 },
  { id:"language",       type:"language",       icon:"🗣️", nameKey:"mode_language_name",        descKey:"mode_language_desc",        questions:10, timer:0,  lives:0 },
  // ── Especiales ────────────────────────────────────────────
  { id:"survival",       type:"mixed",          icon:"💀", nameKey:"mode_survival_name",        descKey:"mode_survival_desc",        questions:999,timer:0,  lives:1 },
  { id:"timeattack",     type:"mixed",          icon:"⏱️", nameKey:"mode_timeattack_name",      descKey:"mode_timeattack_desc",      questions:999,timer:0,  lives:0, totalTime:60 },
  { id:"blitz",          type:"flags",          icon:"⚡", nameKey:"mode_blitz_name",           descKey:"mode_blitz_desc",           questions:20, timer:5,  lives:0 },
  { id:"hardcore",       type:"mixed",          icon:"☠️", nameKey:"mode_hardcore_name",        descKey:"mode_hardcore_desc",        questions:15, timer:8,  lives:3 }
];

// ── Datos extra: idiomas y países sin litoral ─────────────────
// Nombres de idioma en inglés Y español
const COUNTRY_LANGS = {
  fr:{ en:"French",    es:"Francés"     },
  pt:{ en:"Portuguese",es:"Portugués"   },
  de:{ en:"German",    es:"Alemán"      },
  es:{ en:"Spanish",   es:"Español"     },
  it:{ en:"Italian",   es:"Italiano"    },
  nl:{ en:"Dutch",     es:"Neerlandés"  },
  pl:{ en:"Polish",    es:"Polaco"      },
  ru:{ en:"Russian",   es:"Ruso"        },
  ar:{ en:"Arabic",    es:"Árabe"       },
  zh:{ en:"Chinese",   es:"Chino"       },
  ja:{ en:"Japanese",  es:"Japonés"     },
  ko:{ en:"Korean",    es:"Coreano"     },
  hi:{ en:"Hindi",     es:"Hindi"       },
  tr:{ en:"Turkish",   es:"Turco"       },
  vi:{ en:"Vietnamese",es:"Vietnamita"  },
  th:{ en:"Thai",      es:"Tailandés"   },
  id:{ en:"Indonesian",es:"Indonesio"   },
  ms:{ en:"Malay",     es:"Malayo"      },
  sw:{ en:"Swahili",   es:"Suajili"     },
  am:{ en:"Amharic",   es:"Amhárico"    }
};
const LANG_MAP = {
  fr:["fr","be","ch","lu","mc","sn","ml","ne","bf","ci","ga","cm","cd","cg","mg"],
  pt:["br","pt","ao","mz","cv","st","gw","tl"],
  de:["de","at","ch","li"],
  es:["es","mx","ar","co","cl","pe","ve","ec","bo","py","uy","cr","pa","hn","gt","sv","ni","cu","do","pr"],
  ar:["eg","sa","iq","sy","jo","kw","bh","qa","ae","om","ye","ly","tn","dz","ma","sd","mr"],
  zh:["cn","tw"],
  ja:["jp"], ko:["kr","kp"], hi:["in"], tr:["tr"], vi:["vn"], th:["th"],
  id:["id"], ms:["my","bn"], sw:["tz","ke","ug"], am:["et"]
};
// Países sin litoral marítimo (landlocked)
const LANDLOCKED_CODES = new Set([
  "af","am","az","by","bt","bo","bf","bi","cf","td","cz","et","hu",
  "kz","ky","la","ls","li","lu","mw","ml","md","mn","np","ne","mk",
  "py","rw","sm","rs","sk","ss","sz","tj","tm","ug","uz","va","zm","zw","at"
]);
// Países insulares
const ISLAND_CODES = new Set([
  "ag","bs","bb","cv","km","cu","cy","dm","fj","gd","ht","id","jm","ki",
  "mv","mh","mu","fm","nr","nz","pw","pg","ph","kn","lc","vc","ws","sb",
  "sg","lk","tt","tv","vu","gb","ie","is","jp","mt"
]);

// ── Generador principal ───────────────────────────────────────
function generateQuestion(type, pool) {
  const safePick = (type === "mixed")
    ? GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)]
    : type;

  switch (safePick) {
    case "flags":           return qFlags(pool);
    case "capitals":        return qCapitals(pool);
    case "flag_to_capital": return qFlagToCapital(pool);
    case "population":      return qCompare(pool,"population",t("game_higher_pop"));
    case "area":            return qCompare(pool,"area",t("game_bigger_area"));
    case "continent":       return qContinent(pool);
    case "capital_hunt":    return qCapitalHunt(pool);
    case "anagram":         return qAnagram(pool);
    case "odd_one_out":     return qOddOne(pool);
    case "bigger_3":        return qBigger3(pool);
    case "pop_rank":        return qPopRank(pool);
    case "flag_color":      return qFlagColor(pool);
    case "landlocked":      return qLandlocked(pool);
    case "island":          return qIsland(pool);
    case "language":        return qLanguage(pool);
    case "currency_match":  return qFlags(pool); // fallback
    case "border_count":    return qBorderCount(pool);
    default:                return qFlags(pool);
  }
}

// ── Q1: Adivina el país por su bandera ───────────────────────
function qFlags(pool) {
  const correct = rand(1, pool)[0];
  const opts = shuf([correct, ...pick(pool,3,[correct])]);
  return { kind:"flags", promptText:t("game_which_country"), flag:fUrl(correct.code),
    options:opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(correct) };
}

// ── Q2: Capital del país ──────────────────────────────────────
function qCapitals(pool) {
  const correct = rand(1, pool)[0];
  const opts = shuf([correct, ...pick(pool,3,[correct])]);
  return { kind:"capitals", promptText:`${t("game_capital_of")} ${nm(correct)}?`, flag:fUrl(correct.code),
    options:opts.map(c=>({label:cp(c),country:c})), correctIndex:opts.indexOf(correct) };
}

// ── Q3: Bandera → capital ─────────────────────────────────────
function qFlagToCapital(pool) {
  const correct = rand(1, pool)[0];
  const opts = shuf([correct, ...pick(pool,3,[correct])]);
  return { kind:"flag_to_capital", promptText:t("game_flag_capital"), flag:fUrl(correct.code),
    options:opts.map(c=>({label:cp(c),country:c})), correctIndex:opts.indexOf(correct) };
}

// ── Q4/5: Comparar dos países ────────────────────────────────
function qCompare(pool, metric, promptText) {
  let a,b,tries=0;
  do { [a,b]=rand(2,pool); tries++; } while(a[metric]===b[metric]&&tries<20);
  const opts = shuf([a,b]);
  const win  = (a[metric]>=b[metric])?a:b;
  return { kind:"compare", promptText, metric,
    options:opts.map(c=>({label:nm(c),country:c,twoLine:true})), correctIndex:opts.indexOf(win) };
}

// ── Q6: ¿Qué continente? ─────────────────────────────────────
function qContinent(pool) {
  const correct = rand(1,pool)[0];
  const cc = correct.continent;
  const all = Object.keys(GC).filter(c=>c!=="AN");
  const wrongs = shuf(all.filter(c=>c!==cc)).slice(0,3);
  const opts = shuf([cc,...wrongs]);
  return { kind:"continent", promptText:`${t("game_which_continent")} ${nm(correct)} ${t("game_in")}`,
    flag:fUrl(correct.code), options:opts.map(code=>({label:cn(code)})), correctIndex:opts.indexOf(cc) };
}

// ── Q7: Capital → país ───────────────────────────────────────
function qCapitalHunt(pool) {
  const correct = rand(1,pool)[0];
  const opts = shuf([correct,...pick(pool,3,[correct])]);
  return { kind:"capital_hunt", promptText:`${t("game_capital_hunt")} (${cp(correct)})`,
    options:opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(correct) };
}

// ── Q8: ANAGRAMA del nombre del país ─────────────────────────
function qAnagram(pool) {
  const correct = rand(1,pool)[0];
  const cname = nm(correct).toUpperCase();
  const anagram = cname.split("").sort(()=>Math.random()-.5).join("");
  const opts = shuf([correct,...pick(pool,3,[correct])]);
  return { kind:"anagram", promptText:t("game_anagram"),
    anagramText: anagram,
    options:opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(correct) };
}

// ── Q9: ODD ONE OUT – 4 países, 3 del mismo continente ───────
function qOddOne(pool) {
  const refCont = shuf(Object.keys(GC).filter(c=>c!=="AN"))[0];
  const same = shuf(pool.filter(c=>c.continent===refCont));
  const diff = shuf(pool.filter(c=>c.continent!==refCont));
  if (same.length < 3 || diff.length < 1) return qFlags(pool);
  const oddCountry = diff[0];
  const others = same.slice(0,3);
  const opts = shuf([oddCountry,...others]);
  return { kind:"odd_one_out",
    promptText: t("game_odd_one_out"),
    hint: `${t("game_odd_hint")} ${cn(refCont)}`,
    options: opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(oddCountry) };
}

// ── Q10: ¿Cuál es el MAYOR de 3 países? ──────────────────────
function qBigger3(pool) {
  const trio = rand(3,pool);
  const win  = trio.reduce((a,b)=>a.area>b.area?a:b);
  const opts = shuf(trio);
  return { kind:"bigger_3", promptText:t("game_biggest_of_3"),
    options:opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(win) };
}

// ── Q11: Pon 3 países en orden de MAYOR a MENOR población ────
// (implementado como pregunta: ¿cuál tiene MÁS población de estos 3?)
function qPopRank(pool) {
  const trio = rand(3,pool);
  const win  = trio.reduce((a,b)=>a.population>b.population?a:b);
  const opts = shuf(trio);
  return { kind:"pop_rank", promptText:t("game_pop_rank"),
    options:opts.map(c=>({label:nm(c),country:c})), correctIndex:opts.indexOf(win) };
}

// ── Q12: ¿QUÉ COLOR no aparece en esta bandera? ──────────────
// Basado en heurística de colores de banderas por código de país
const FLAG_COLORS = {
  fr:["blue","white","red"], de:["black","red","yellow"], it:["green","white","red"],
  us:["red","white","blue"], gb:["red","white","blue"],   jp:["white","red"],
  cn:["red","yellow"],       br:["green","yellow","blue","white"], in:["orange","white","green","blue"],
  ru:["white","blue","red"], es:["red","yellow"],         au:["red","white","blue"],
  ca:["red","white"],        mx:["green","white","red"],  ar:["blue","white","yellow"],
  za:["red","green","blue","black","white","yellow"],     ng:["green","white"],
  eg:["red","white","black","yellow"], tr:["red","white"],ke:["black","red","green","white"],
  se:["blue","yellow"],      no:["red","white","blue"],   fi:["white","blue"],
  dk:["red","white"],        pl:["white","red"],           ch:["red","white"],
  be:["black","yellow","red"],pt:["red","green","yellow"],nl:["red","white","blue"],
  kr:["red","white","blue","black"],   sa:["green","white"],pk:["green","white"],
  id:["red","white"],         vn:["red","yellow"],          th:["red","white","blue"],
  ph:["blue","red","white","yellow"],  ug:["black","yellow","red","white"],
  gh:["red","yellow","green","black"], sd:["red","white","black","green"]
};
const ALL_COLORS = ["red","white","blue","green","yellow","black","orange","purple"];

function qFlagColor(pool) {
  const candidates = pool.filter(c => FLAG_COLORS[c.code]);
  if (candidates.length < 1) return qFlags(pool);
  const correct = rand(1, candidates)[0];
  const colors  = FLAG_COLORS[correct.code];
  const absent  = shuf(ALL_COLORS.filter(c => !colors.includes(c))).slice(0,1)[0];
  const wrongs  = shuf(colors).slice(0,3);
  const opts    = shuf([absent,...wrongs]).map(col=>({label:t("color_"+col)||col}));
  const ci      = opts.findIndex(o=>o.label===(t("color_"+absent)||absent));
  return { kind:"flag_color", promptText:t("game_flag_color_q"), flag:fUrl(correct.code),
    options:opts, correctIndex: ci };
}

// ── Q13: ¿Es este país SIN LITORAL (landlocked)? ─────────────
function qLandlocked(pool) {
  const isLL = Math.random() > 0.5;
  const candidates = pool.filter(c => LANDLOCKED_CODES.has(c.code) === isLL);
  if (!candidates.length) return qFlags(pool);
  const correct = rand(1, candidates)[0];
  const opts = shuf([
    { label: t("yes"), val: true  },
    { label: t("no"),  val: false }
  ]);
  return { kind:"landlocked", promptText:`${t("game_landlocked_q")} ${nm(correct)}?`,
    flag: fUrl(correct.code), options: opts, correctIndex: opts.findIndex(o=>o.val===isLL) };
}

// ── Q14: ¿Es este país una ISLA? ────────────────────────────
function qIsland(pool) {
  const isIsl = Math.random() > 0.5;
  const candidates = pool.filter(c => ISLAND_CODES.has(c.code) === isIsl);
  if (!candidates.length) return qFlags(pool);
  const correct = rand(1, candidates)[0];
  const opts = shuf([
    { label: t("yes"), val: true  },
    { label: t("no"),  val: false }
  ]);
  return { kind:"island", promptText:`${t("game_island_q")} ${nm(correct)}?`,
    flag: fUrl(correct.code), options: opts, correctIndex: opts.findIndex(o=>o.val===isIsl) };
}

// ── Q15: ¿Qué idioma se habla en este país? ─────────────────
function qLanguage(pool) {
  const langCodes = Object.keys(LANG_MAP);
  const langCode  = shuf(langCodes)[0];
  // Nombre del idioma en el idioma activo del juego (en/es)
  const langObj   = COUNTRY_LANGS[langCode];
  const langName  = langObj ? langObj[L()] || langObj.en : langCode;
  const speakers  = LANG_MAP[langCode];
  const cands     = pool.filter(c=>speakers.includes(c.code));
  if (!cands.length) return qFlags(pool);
  const correct   = rand(1, cands)[0];
  // 3 distractores: idiomas distintos, también localizados
  const wrongLangs = shuf(langCodes.filter(l=>l!==langCode)).slice(0,3);
  const wrongNames = wrongLangs.map(l => {
    const o = COUNTRY_LANGS[l];
    return o ? (o[L()] || o.en) : l;
  });
  const opts = shuf([langName, ...wrongNames]).map(l=>({label:l}));
  const ci = opts.findIndex(o=>o.label===langName);
  return { kind:"language", promptText:`${t("game_language_q")} ${nm(correct)}?`,
    flag: fUrl(correct.code), options: opts, correctIndex: ci };
}

// ── Q17: ¿Cuántas fronteras tiene este país? (aprox.) ────────
const BORDER_COUNT = {
  cn:14,ru:14,br:10,de:9,fr:8,at:8,tr:8,pl:7,me:5,rs:8,
  by:5,ua:7,kz:5,af:6,cd:9,et:6,tz:8,ng:4,sd:7,
  us:2,ca:2,mx:3,ar:5,co:5,
  gb:0,jp:0,au:0,nz:0,id:3,my:3,
  va:1,mc:1,sm:3,li:2
};

function qBorderCount(pool) {
  const cands = pool.filter(c=>BORDER_COUNT[c.code]!==undefined);
  if (cands.length < 1) return qFlags(pool);
  const correct = rand(1,cands)[0];
  const realN   = BORDER_COUNT[correct.code];
  const wrongNs = shuf([0,1,2,3,4,5,6,7,8,9,10,14].filter(n=>n!==realN)).slice(0,3);
  const opts    = shuf([realN,...wrongNs]).map(n=>({label:String(n)}));
  const ci      = opts.findIndex(o=>o.label===String(realN));
  return { kind:"border_count", promptText:`${t("game_border_q")} ${nm(correct)}?`,
    flag: fUrl(correct.code), options: opts, correctIndex: ci };
}

window.GAME = {
  OFFICIAL_MODES, GAME_TYPES,
  generateQuestion,
  helpers: { name:nm, cap:cp, continentName:cn, countriesByContinent:byCont, flagUrl:fUrl }
};
})();
