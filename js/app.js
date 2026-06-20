/* ============================================================
   GeoQuest - App v2
   Tienda de monedas · Modos mejorados · Builder avanzado
   Pase 60 tiers · Reinicio mensual
   ============================================================ */

(function () {
  const { t, setLang, applyTranslations, getLang } = window.I18N_API;
  const S  = window.STATE_API;
  const R  = window.REWARDS;
  const { OFFICIAL_MODES, generateQuestion, helpers } = window.GAME;
  const { flagUrl } = helpers;

  // ─── Init ────────────────────────────────────────────────────
  function init() {
    const st = S.get();
    setLang(st.lang);
    S.applyCosmetics();
    S.registerDailyVisit();
    const newSeason = S.checkSeasonReset();
    const newShop   = S.checkShopReset();
    applyTranslations(document);
    bindNav();
    renderTopbar();
    navTo("home");
    if (newSeason) setTimeout(() => toast("🎉", t("pass_new_season"), "gold"), 800);
    if (newShop)   setTimeout(() => toast("🛒", t("shop_new_rotation"), "gold"), 1200);
    const xBoost = S.get().xpBoost;
    if (xBoost > 1) setTimeout(() => toast("⚡", `${t("xp_boost_applied")}${xBoost} ${t("xp_boost_end")}`), 600);
    setTimeout(() => notifyAchievements(S.checkAchievements()), 400);
  }

  // ─── Helpers ─────────────────────────────────────────────────
  const $ = s => document.querySelector(s);
  const lang  = () => getLang();
  const locN  = obj => obj[lang()] || obj.en;
  const fmtN  = n => new Intl.NumberFormat(lang()==="es"?"es-ES":"en-US").format(n);
  const escH  = s => String(s).replace(/[&<>"']/g,m=>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

  function sound(type) {
    if (!S.get().sound) return;
    try {
      const ctx = sound._ctx || (sound._ctx = new (window.AudioContext||window.webkitAudioContext)());
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type==="correct")  { o.frequency.setValueAtTime(660,now); o.frequency.setValueAtTime(880,now+.08); }
      else if (type==="wrong"){ o.frequency.setValueAtTime(220,now); o.frequency.setValueAtTime(160,now+.1); }
      else if (type==="reward"){ o.frequency.setValueAtTime(523,now); o.frequency.setValueAtTime(784,now+.1); o.frequency.setValueAtTime(1046,now+.2); }
      else { o.frequency.setValueAtTime(440,now); }
      g.gain.setValueAtTime(.08,now);
      g.gain.exponentialRampToValueAtTime(.0001,now+.3);
      o.start(now); o.stop(now+.35);
    } catch(e){}
  }

  // ─── Topbar ──────────────────────────────────────────────────
  function renderTopbar() {
    const st = S.get();
    const av = R.AVATARS[st.equipped.avatar] || R.AVATARS.explorer;
    const ti = R.TITLES[st.equipped.title]   || R.TITLES.rookie;
    $("#topAvatar").textContent = av.emoji;
    $("#topName").textContent   = st.name;
    $("#topTitle").textContent  = locN(ti.name);
    $("#topCoins").textContent  = fmtN(st.coins);
    $("#topLevel").textContent  = `${t("home_level")} ${st.level}`;
  }

  // ─── Navigation ──────────────────────────────────────────────
  let currentScreen = "home";
  function bindNav() {
    document.querySelectorAll(".nav-btn").forEach(b =>
      b.addEventListener("click", () => {
        const tgt = b.getAttribute("data-nav");
        if (tgt === "quickplay") { startQuickPlay(); return; }
        navTo(tgt);
      }));
  }
  function setActiveNav(screen) {
    document.querySelectorAll(".nav-btn").forEach(b =>
      b.classList.toggle("active", b.getAttribute("data-nav") === screen));
  }
  function navTo(screen) {
    currentScreen = screen;
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = $(`#screen-${screen}`);
    if (el) el.classList.add("active");
    setActiveNav(["home","play","pass","shop"].includes(screen) ? screen : "");
    const R = {home:renderHome, play:renderPlay, pass:renderPass,
               shop:renderLocker, profile:renderProfile, builder:renderBuilder,
               coinshop:renderCoinShop};
    if (R[screen]) R[screen]();
    renderTopbar();
    el && (el.scrollTop = 0);
  }

  // ═══════════════════════════════════════════════════════════
  //  HOME
  // ═══════════════════════════════════════════════════════════
  function renderHome() {
    const st   = S.get();
    const lp   = S.xpProgressInLevel();
    const acc  = st.stats.total ? Math.round(st.stats.correct/st.stats.total*100) : 0;
    const el   = $("#screen-home");
    const xb   = st.xpBoost > 1 ? `<div class="boost-pill">⚡ ${t("shop_boost_active")}${st.xpBoost}</div>` : "";
    el.innerHTML = `
      <section class="hero">
        <h1>${t("appName")}</h1><p class="tagline">${t("tagline")}</p>
        ${xb}
        <div class="levelbar-wrap">
          <div class="levelbar-meta">
            <span>${t("home_level")} ${st.level}</span>
            <span>${fmtN(lp.current)} / ${fmtN(lp.needed)} ${t("home_xp")}</span>
          </div>
          <div class="bar"><span style="width:${(lp.current/lp.needed*100).toFixed(1)}%"></span></div>
        </div>
        <div class="chips-row">
          <div class="chip-stat"><div class="num">${st.dayStreak}🔥</div><div class="lbl">${t("home_streak")}</div></div>
          <div class="chip-stat"><div class="num">${fmtN(st.stats.games)}</div><div class="lbl">${t("stat_games")}</div></div>
          <div class="chip-stat"><div class="num">${acc}%</div><div class="lbl">${t("stat_accuracy")}</div></div>
        </div>
      </section>
      <div style="display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:16px">
        <button class="bigbtn bigbtn-col" id="homeQuick">
          <span><i class="fa-solid fa-bolt"></i> ${t("home_quickplay")}</span>
          <span class="sub">${t("home_quickplay_desc")}</span>
        </button>
        <button class="bigbtn" id="goShopBtn" style="flex:0 0 60px;font-size:22px;padding:0;box-shadow:none;background:var(--surface-2);color:var(--gold);border:1px solid var(--border)">🛒</button>
      </div>
      <article class="daily-card" id="dailyCard">
        <span class="icon">📅</span>
        <div><h3>${t("home_daily")}</h3><p>${t("home_daily_desc")}</p></div>
        <span class="go"><i class="fa-solid fa-chevron-right"></i></span>
      </article>
      <h2 class="section-title">⭐ ${t("home_modes")}</h2>
      <div class="mode-grid" id="homeModes"></div>
      <h2 class="section-title">📊 ${t("home_stats")}</h2>
      <div class="chips-row">
        <div class="chip-stat"><div class="num">${fmtN(st.stats.correct)}</div><div class="lbl">${t("stat_correct")}</div></div>
        <div class="chip-stat"><div class="num">${st.stats.bestStreak}</div><div class="lbl">${t("stat_best")}</div></div>
        <div class="chip-stat"><div class="num">${st.stats.perfectGames||0}</div><div class="lbl">💯 Perfect</div></div>
      </div><div class="spacer-sm"></div>`;
    const feat = OFFICIAL_MODES.slice(0,4);
    el.querySelector("#homeModes").innerHTML = feat.map(modeCardHTML).join("");
    el.querySelectorAll("[data-mode]").forEach(c =>
      c.addEventListener("click", () => openRegionPicker(c.getAttribute("data-mode"))));
    el.querySelector("#homeQuick").addEventListener("click", startQuickPlay);
    el.querySelector("#goShopBtn").addEventListener("click", () => navTo("coinshop"));
    el.querySelector("#dailyCard").addEventListener("click", startDaily);
  }

  function modeCardHTML(m) {
    const special = ["survival","timeattack","blitz","hardcore"].includes(m.id);
    const tag = m.id==="survival"?"♾️":m.id==="timeattack"?"60s":m.id==="blitz"?"⚡20":m.id==="hardcore"?"☠️":"";
    return `<button class="mode-card${special?" special":""}" data-mode="${m.id}">
      ${tag?`<span class="tag">${tag}</span>`:""}
      <span class="m-icon">${m.icon}</span>
      <h3>${t(m.nameKey)}</h3><p>${t(m.descKey)}</p>
    </button>`;
  }

  // ═══════════════════════════════════════════════════════════
  //  PLAY
  // ═══════════════════════════════════════════════════════════
  function renderPlay() {
    const st = S.get();
    const el = $("#screen-play");
    // group official modes into rows: classic (7) + creative (8) + special (4) [+ extras]
    const classics  = OFFICIAL_MODES.filter(m=>["flags","capitals","flag_to_capital","population","area","continent","capital_hunt"].includes(m.id));
    const creative  = OFFICIAL_MODES.filter(m=>["anagram","odd_one_out","bigger_3","pop_rank","flag_color","landlocked","island","language"].includes(m.id));
    const special   = OFFICIAL_MODES.filter(m=>["survival","timeattack","blitz","hardcore"].includes(m.id));

    el.innerHTML = `
      <h2 class="section-title">🗂️ ${t("modes_official")}</h2>
      <p class="mode-sub">🏛️ ${lang()==="es"?"Clásicos":"Classics"}</p>
      <div class="mode-grid">${classics.map(modeCardHTML).join("")}</div>
      <p class="mode-sub" style="margin-top:14px">🎲 ${lang()==="es"?"Creativos":"Creative"}</p>
      <div class="mode-grid">${creative.map(modeCardHTML).join("")}</div>
      <p class="mode-sub" style="margin-top:14px">🔥 ${lang()==="es"?"Especiales":"Special"}</p>
      <div class="mode-grid">${special.map(modeCardHTML).join("")}</div>
      <h2 class="section-title">🛠️ ${t("modes_custom")} <span class="count">${st.customModes.length}</span></h2>
      <div class="mode-grid" id="customModes"></div>
      <div class="spacer-sm"></div>`;

    el.querySelectorAll("[data-mode]").forEach(c =>
      c.addEventListener("click", () => {
        const id = c.getAttribute("data-mode");
        const m = OFFICIAL_MODES.find(x=>x.id===id);
        if (m.type==="mixed"||m.id==="blitz"||m.id==="hardcore") startGame(buildSession(m,"ALL"));
        else openRegionPicker(id);
      }));

    const custEl = el.querySelector("#customModes");
    const customCards = st.customModes.map(m=>`
      <div class="mode-card custom-card" data-custom="${m.id}">
        <button class="del-x" data-del="${m.id}"><i class="fa-solid fa-xmark"></i></button>
        <span class="m-icon">${baseTypeIcon(m.type)}</span>
        <h3>${escH(m.name)}</h3>
        <p>${customSummary(m)}</p>
        ${m.xpMult>1?`<span class="tag">XP ×${m.xpMult}</span>`:""}
      </div>`).join("");
    custEl.innerHTML = customCards + `
      <button class="mode-card create-card" id="createModeBtn">
        <span class="m-icon" style="color:var(--accent)"><i class="fa-solid fa-plus"></i></span>
        <h3>${t("create_mode")}</h3>
      </button>`;

    custEl.querySelectorAll("[data-custom]").forEach(c =>
      c.addEventListener("click", e => {
        if (e.target.closest("[data-del]")) return;
        startGame(buildCustomSession(st.customModes.find(x=>x.id===c.getAttribute("data-custom"))));
      }));
    custEl.querySelectorAll("[data-del]").forEach(b =>
      b.addEventListener("click", e => { e.stopPropagation(); deleteCustomMode(b.getAttribute("data-del")); }));
    el.querySelector("#createModeBtn").addEventListener("click", () => navTo("builder"));
  }

  function baseTypeIcon(type) {
    const m = OFFICIAL_MODES.find(x=>x.type===type);
    return m ? m.icon : "🎲";
  }
  function customSummary(m) {
    const cont = m.continent==="ALL" ? t("region_all") : locN(window.GEO_DATA.CONTINENTS[m.continent]);
    const tv = m.timer ? `⏱${m.timer}s` : "";
    const lv = m.lives ? `❤️${m.lives}` : "";
    return `${cont} · ${m.questions}Q ${tv} ${lv}`.trim();
  }

  // ═══════════════════════════════════════════════════════════
  //  REGION PICKER
  // ═══════════════════════════════════════════════════════════
  function openRegionPicker(modeId) {
    const m = OFFICIAL_MODES.find(x=>x.id===modeId);
    const cs = window.GEO_DATA.CONTINENTS;
    const order = ["ALL","EU","AS","AF","NA","SA","OC"];
    const btns = order.map(code => {
      const lbl = code==="ALL" ? `🌍 ${t("region_all")}` : `${cEmo(code)} ${locN(cs[code])}`;
      return `<button class="opt" data-region="${code}">${lbl}</button>`;
    }).join("");
    showModal(`<div class="m-big">${m.icon}</div>
      <h3>${t(m.nameKey)}</h3><p>${t("select_continent")}</p>
      <div class="options" style="max-height:46vh;overflow:auto">${btns}</div>
      <div class="m-actions" style="margin-top:14px">
        <button class="btn-ghost" id="rCnl">${t("cancel")}</button>
      </div>`);
    document.querySelectorAll("[data-region]").forEach(b =>
      b.addEventListener("click", () => { closeModal(); startGame(buildSession(m, b.getAttribute("data-region"))); }));
    $("#rCnl").addEventListener("click", closeModal);
  }
  function cEmo(code) { return {EU:"🇪🇺",AS:"🌏",AF:"🌍",NA:"🌎",SA:"🌎",OC:"🏝️"}[code]||"🗺️"; }

  // ═══════════════════════════════════════════════════════════
  //  SESSION BUILDERS
  // ═══════════════════════════════════════════════════════════
  function buildSession(mode, region) {
    const pool = window.GEO_DATA.countriesByContinent(region);
    return { title:t(mode.nameKey), type:mode.type,
      pool: pool.length>=4?pool:window.GEO_DATA.COUNTRIES,
      questions:mode.questions, timer:mode.timer||0,
      lives:mode.lives||0, totalTime:mode.totalTime||0, xpMult:1 };
  }
  function buildCustomSession(m) {
    const pool = window.GEO_DATA.countriesByContinent(m.continent);
    return { title:m.name, type:m.shuffle?("mixed_custom|"+m.types.join("|")):m.type,
      pool:pool.length>=4?pool:window.GEO_DATA.COUNTRIES,
      questions:m.questions, timer:m.timer||0,
      lives:m.lives||0, totalTime:0, xpMult:m.xpMult||1 };
  }
  function startQuickPlay() {
    const m = OFFICIAL_MODES[Math.floor(Math.random()*13)];
    startGame(buildSession(m,"ALL"));
  }
  function startDaily() {
    const day  = new Date().toISOString().slice(0,10);
    const seed = [...day].reduce((a,c)=>a+c.charCodeAt(0),0);
    const m = OFFICIAL_MODES[seed % 14];
    const s = buildSession(m,"ALL");
    s.title = t("home_daily"); s.questions = 15;
    startGame(s);
  }

  // ═══════════════════════════════════════════════════════════
  //  GAME LOOP
  // ═══════════════════════════════════════════════════════════
  let G = null;

  function startGame(session) {
    // Si la sesión tiene un tipo custom mixto, extraer la lista
    let typeList = null;
    if (session.type && session.type.startsWith("mixed_custom|")) {
      typeList = session.type.split("|").slice(1);
    }
    G = { ...session, idx:0, score:0, correct:0, answered:0,
      streak:0, bestStreak:0, livesLeft:session.lives||0,
      timerInt:null, globalInt:null, globalLeft:session.totalTime||0,
      typeList, errors:0 };

    // mostrar boost activo
    const xb = S.get().xpBoost;
    if (xb > 1) toast("⚡", `${t("xp_boost_applied")}${xb} ${t("xp_boost_end")}`);

    navTo("game");
    if (G.totalTime) startGlobalTimer();
    nextQuestion();
  }

  function startGlobalTimer() {
    G.globalInt = setInterval(() => {
      G.globalLeft--;
      const bar = $("#globalTimer"); if (bar) bar.style.width=(G.globalLeft/G.totalTime*100)+"%";
      const lab = $("#gTimeLabel"); if (lab) lab.textContent=G.globalLeft+"s";
      if (G.globalLeft<=0) { clearInterval(G.globalInt); endGame(); }
    }, 1000);
  }

  function pickType() {
    if (G.typeList && G.typeList.length) return G.typeList[Math.floor(Math.random()*G.typeList.length)];
    return G.type;
  }

  function nextQuestion() {
    if (G.totalTime===0 && G.idx>=G.questions) return endGame();
    if (G.lives>0 && G.livesLeft<=0) return endGame();
    const typ = pickType();
    G.q = generateQuestion(typ, G.pool);
    G.locked = false;
    renderGame();
    if (G.timer>0) startQTimer();
  }

  function startQTimer() {
    let left = G.timer;
    const bar = $("#qTimer");
    if (bar) { bar.style.transition="none"; bar.style.width="100%"; }
    requestAnimationFrame(()=>{
      if(bar){bar.style.transition=`width ${G.timer}s linear`;bar.style.width="0%";}
    });
    clearInterval(G.timerInt);
    G.timerInt = setInterval(()=>{
      left--;
      if(left<=0){clearInterval(G.timerInt);if(!G.locked)timeoutAnswer();}
    },1000);
  }

  function renderGame() {
    const q = G.q;
    const el = $("#screen-game");
    const showLives  = G.lives > 0;
    const showTimer  = G.timer > 0;
    const showGlobal = G.totalTime > 0;
    const total = G.totalTime?"∞":G.questions;

    let questionExtra = "";
    if (q.kind === "anagram") {
      questionExtra = `<div class="anagram-box">${escH(q.anagramText)}</div>`;
    }
    if (q.kind === "odd_one_out" && q.hint) {
      questionExtra = `<div class="hint-pill">${escH(q.hint)}</div>`;
    }

    el.innerHTML = `
      <header class="game-head">
        <button class="quit" id="quitGame"><i class="fa-solid fa-xmark"></i></button>
        <div class="game-stats">
          <div class="gstat"><div class="v">${fmtN(G.score)}</div><div class="l">${t("game_score")}</div></div>
          <div class="gstat"><div class="v${G.streak>=3?" streak-on":""}">${G.streak}🔥</div><div class="l">${t("game_streak")}</div></div>
          ${showLives?`<div class="gstat"><div class="v">${"❤️".repeat(Math.max(0,G.livesLeft))||"💀"}</div><div class="l">${t("game_lives")}</div></div>`:""}
          ${showGlobal?`<div class="gstat"><div class="v" id="gTimeLabel">${G.globalLeft}s</div><div class="l">${t("game_timeleft")}</div></div>`:""}
        </div>
      </header>
      ${showGlobal?`<div class="timerbar"><span id="globalTimer" style="width:${(G.globalLeft/G.totalTime*100)}%"></span></div>`:
        `<div class="qprogress"><span style="width:${(G.idx/G.questions*100)}%"></span></div>`}
      ${showTimer?`<div class="timerbar"><span id="qTimer"></span></div>`:""}
      <div class="qcard">
        ${q.flag?`<img class="qflag" src="${q.flag}" alt="flag" loading="eager">`:""}
        <div class="qprompt">${escH(q.promptText)}</div>
        ${questionExtra}
      </div>
      <div class="options" id="opts"></div>
      <div id="feedbackSlot"></div>`;

    const optsEl = el.querySelector("#opts");
    optsEl.innerHTML = q.options.map((o,i)=>{
      // ⚠️ Para preguntas de comparación (población/área) NO mostramos
      // el dato numérico hasta que el usuario haya respondido.
      // El span.opt-sub se crea vacío y se rellena en revealOptions().
      const sub = (q.kind==="compare") ? `<span class="opt-sub"></span>` : "";
      return `<button class="opt" data-opt="${i}">
        <span>${escH(o.label)}</span>
        ${sub}
      </button>`;
    }).join("");
    optsEl.querySelectorAll("[data-opt]").forEach(b =>
      b.addEventListener("click", ()=>answer(parseInt(b.getAttribute("data-opt")))));
    el.querySelector("#quitGame").addEventListener("click", confirmQuit);
  }

  function answer(i) {
    if (G.locked) return;
    G.locked = true;
    clearInterval(G.timerInt);
    const correct = i === G.q.correctIndex;
    G.answered++;
    revealOptions(i);
    if (correct) {
      sound("correct");
      G.correct++; G.streak++;
      G.bestStreak = Math.max(G.bestStreak, G.streak);
      const bonus = Math.min(G.streak, 10) * 5;
      G.score += 100 + bonus;
    } else {
      sound("wrong");
      G.streak = 0; G.errors++;
      if (G.lives>0) G.livesLeft--;
    }
    showFeedback(correct);
    if (G.totalTime===0) G.idx++;
    setTimeout(()=>{ if (currentScreen==="game") nextQuestion(); }, correct?750:1500);
  }

  function timeoutAnswer() {
    if (G.locked) return;
    G.locked = true; G.answered++; G.errors++;
    revealOptions(-1); sound("wrong"); G.streak = 0;
    if (G.lives>0) G.livesLeft--;
    showFeedback(false);
    if (G.totalTime===0) G.idx++;
    setTimeout(()=>{ if(currentScreen==="game") nextQuestion(); }, 1500);
  }

  function revealOptions(picked) {
    const q = G.q;
    document.querySelectorAll("#opts .opt").forEach((b,i)=>{
      b.disabled = true;
      if (q.kind==="compare" && q.options[i]?.country) {
        // Rellena el span.opt-sub que se creó vacío en renderGame()
        let sub = b.querySelector(".opt-sub");
        if (!sub) { sub = document.createElement("span"); sub.className="opt-sub"; b.appendChild(sub); }
        sub.textContent = compareReveal(G.type, q.options[i].country, q);
      }
      if (i===q.correctIndex) b.classList.add("correct");
      else if (i===picked)    b.classList.add("wrong");
    });
  }

  function compareReveal(type, country, q) {
    if (!country) return "";
    const isPop = q.promptText===t("game_higher_pop")||q.promptText===t("game_pop_rank")||q.kind==="pop_rank";
    return isPop ? fmtN(country.population) : fmtN(country.area)+" km²";
  }

  function showFeedback(correct) {
    const slot = $("#feedbackSlot"); if (!slot) return;
    const c = G.q.options[G.q.correctIndex];
    slot.innerHTML = `<div class="feedback-banner ${correct?"good":"bad"}">
      ${correct?"✅ "+t("game_correct"):"❌ "+t("game_wrong")}
      ${!correct?`<div style="font-size:13px;margin-top:4px">${t("game_the_answer_was")}: ${escH(c.label)}</div>`:""}
    </div>`;
  }

  function confirmQuit() {
    showModal(`<div class="m-big">🚪</div><h3>${t("game_quit")}?</h3>
      <div class="m-actions">
        <button class="btn-ghost" id="qCnl">${t("cancel")}</button>
        <button class="btn-primary" id="qCnf">${t("yes")}</button>
      </div>`);
    $("#qCnl").addEventListener("click", closeModal);
    $("#qCnf").addEventListener("click", ()=>{ closeModal(); cleanupGame(); navTo("play"); });
  }

  function cleanupGame() {
    clearInterval(G&&G.timerInt); clearInterval(G&&G.globalInt);
  }

  function endGame() {
    cleanupGame();
    const total  = G.answered || 1;
    const acc    = Math.round(G.correct/total*100);
    const perfect = G.errors === 0 && G.answered >= 5; // al menos 5 preguntas para ser perfecta
    const baseXp = G.correct * 12 + Math.floor(G.score/50);
    const xpEarned = Math.round(baseXp * (G.xpMult||1));

    S.recordGame({ correct:G.correct, total:G.answered, bestStreakThisGame:G.bestStreak, perfect });
    const xpEvents = S.addXp(xpEarned);

    // Bonus por partida perfecta
    if (perfect) {
      S.get().coins += 25; S.save();
    }
    const newAch = S.checkAchievements();
    renderResult({ acc, xpEarned, xpEvents, newAch, perfect });
    navTo("result");

    setTimeout(()=>{
      if (xpEvents.leveledUp) { sound("reward"); toast("🆙",`${t("level_up")} ${t("home_level")} ${xpEvents.newLevel}`,"gold"); }
      if (perfect) { sound("reward"); confettiBurst(); toast("💯",t("perfect_bonus"),"gold"); }
      xpEvents.passTiers.forEach((tier,k)=>{
        setTimeout(()=>{ toast("🎁",`${t("reward_unlocked")} (${t("pass_tier")} ${tier})`,"gold"); },600*(k+1));
      });
      notifyAchievements(newAch, 400+xpEvents.passTiers.length*600);
    }, 500);
  }

  function renderResult({ acc, xpEarned, xpEvents, newAch, perfect }) {
    const el = $("#screen-result");
    const emoji = perfect?"💯":acc>=80?"🏆":acc>=50?"🎉":"🌍";
    const ss = G.lives>0?`<p class="muted">${t("result_survived")} ${G.answered} ${t("result_rounds")}</p>`:"";
    const pb = perfect?`<div class="perfect-banner">✨ ${t("result_perfect")}</div>`:"";
    const bst= G.xpMult>1?`<div class="boost-pill">⚡ ${t("result_boost_active")}</div>`:"";
    el.innerHTML = `
      <div class="result-wrap">
        <div class="result-emoji">${emoji}</div>
        <h2>${t("result_title")}</h2>${ss}
        <div class="result-score-big">${fmtN(G.score)}</div>
        <div class="muted" style="font-size:13px">${t("result_score")}</div>
        ${pb}${bst}
        <div class="result-grid">
          <div class="chip-stat"><div class="num">${G.correct}/${G.answered}</div><div class="lbl">${t("result_correct")}</div></div>
          <div class="chip-stat"><div class="num">${acc}%</div><div class="lbl">${t("result_accuracy")}</div></div>
          <div class="chip-stat"><div class="num">${G.bestStreak}🔥</div><div class="lbl">${t("stat_best")}</div></div>
        </div>
        <div class="xp-pop">+${fmtN(xpEarned)} ${t("home_xp")} ${xpEvents.leveledUp?"· 🆙":""}</div>
        <div class="result-actions">
          <button class="bigbtn" id="playAgain"><i class="fa-solid fa-rotate-right"></i> ${t("result_playagain")}</button>
          <button class="back-btn" id="resHome" style="justify-content:center;padding:14px"><i class="fa-solid fa-house"></i> ${t("result_home")}</button>
        </div>
      </div>`;
    const ls = {...G};
    el.querySelector("#playAgain").addEventListener("click",()=>startGame({
      title:ls.title,type:ls.type,pool:ls.pool,questions:ls.questions,
      timer:ls.timer,lives:ls.lives,totalTime:ls.totalTime,xpMult:ls.xpMult,
      typeList:ls.typeList
    }));
    el.querySelector("#resHome").addEventListener("click",()=>navTo("home"));
  }

  // ═══════════════════════════════════════════════════════════
  //  SEASON PASS
  // ═══════════════════════════════════════════════════════════
  function renderPass() {
    const st  = S.get();
    const prog= S.passProgress();
    const el  = $("#screen-pass");
    // fecha de fin del mes
    const now  = new Date();
    const endM = new Date(now.getFullYear(), now.getMonth()+1, 1);
    const endStr = endM.toLocaleDateString(lang()==="es"?"es-ES":"en-US",{day:"numeric",month:"long"});

    const rows = R.SEASON_PASS.map(p=>{
      const claimed   = st.claimedTiers.includes(p.tier);
      const reached   = st.passTier >= p.tier;
      const claimable = reached && !claimed;
      const r = p.reward;
      let preview="", rname="", rtype="";
      if (r.type==="coins") { preview=`<span style="font-size:18px">🪙</span>`; rname=`${r.value} ${t("pass_reward_coins")}`; rtype=t("pass_reward_coins"); }
      else if (r.type==="bg")     { const b=R.BACKGROUNDS[r.value]; preview=`<span style="width:100%;height:100%;border-radius:8px;background:${b.css};display:block"></span>`; rname=locN(b.name); rtype=t("pass_reward_bg"); }
      else if (r.type==="theme")  { const th=R.THEMES[r.value]; preview=`<span style="width:100%;height:100%;border-radius:8px;background:linear-gradient(135deg,${th.accent},${th.accent2});display:block"></span>`; rname=locN(th.name); rtype=t("pass_reward_theme"); }
      else if (r.type==="avatar") { const a=R.AVATARS[r.value]; preview=a.emoji; rname=locN(a.name); rtype=t("pass_reward_avatar"); }
      else if (r.type==="title")  { const ti=R.TITLES[r.value]; preview="🎗️"; rname=locN(ti.name); rtype=t("pass_reward_title"); }

      // milestone badges
      const isMilestone = p.tier%10===0;
      return `<div class="tier-row${claimable?" claimable":""}${reached?"":" locked"}${isMilestone?" milestone":""}">
        <div class="tier-num${isMilestone?" tier-gold":""}">${p.tier}</div>
        <div class="tier-preview">${preview}</div>
        <div class="tier-info"><div class="tier-reward-name">${rname}</div><div class="tier-reward-type">${rtype}</div></div>
        <button class="tier-btn ${claimed?"claimed":claimable?"claim":"locked"}" data-claim="${p.tier}" ${claimable?"":"disabled"}>
          ${claimed?"✓ "+t("pass_claimed"):claimable?t("pass_claim"):"🔒"}
        </button>
      </div>`;
    }).join("");

    el.innerHTML = `
      <header class="pass-head">
        <div class="season-name">${t("pass_season")} · ${now.toLocaleString(lang()==="es"?"es-ES":"en-US",{month:"long",year:"numeric"})}</div>
        <h2>${t("pass_title")}</h2>
        <div class="levelbar-wrap">
          <div class="levelbar-meta">
            <span>${t("pass_tier")} ${st.passTier}/60</span>
            <span>${fmtN(prog.current)} / ${fmtN(prog.needed)} XP</span>
          </div>
          <div class="bar"><span style="width:${(prog.current/prog.needed*100)}%"></span></div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-top:5px">
            <span>${t("pass_xp_to_next")}: ${fmtN(prog.needed-prog.current)}</span>
            <span>🗓️ ${t("pass_resets")} ${endStr}</span>
          </div>
        </div>
      </header>
      <div class="pass-track">${rows}</div>
      <div class="spacer-sm"></div>`;

    el.querySelectorAll("[data-claim]").forEach(b=>
      b.addEventListener("click",()=>{
        const res = S.claimTier(parseInt(b.getAttribute("data-claim")));
        if (res.ok) {
          sound("reward"); confettiBurst();
          const r = res.reward;
          const lbl = r.type==="coins"?`+${r.value} ${t("pass_reward_coins")}`:
            r.type==="bg"?locN(R.BACKGROUNDS[r.value].name):
            r.type==="theme"?locN(R.THEMES[r.value].name):
            r.type==="avatar"?locN(R.AVATARS[r.value].name):locN(R.TITLES[r.value].name);
          toast("🎁",`${t("reward_unlocked")}: ${lbl}`,"gold");
          renderPass(); renderTopbar();
          notifyAchievements(S.checkAchievements());
        }
      }));
  }

  // ═══════════════════════════════════════════════════════════
  //  LOCKER
  // ═══════════════════════════════════════════════════════════
  let lockerTab = "bg";
  function renderLocker() {
    const el = $("#screen-shop");
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
        <h2 class="section-title" style="margin:0">👕 ${t("locker_title")}</h2>
        <button class="btn-coin-shop" id="goShopLink">🛒 ${t("shop_title")}</button>
      </div>
      <p class="muted" style="font-size:13px;margin:4px 2px 0">${t("locker_desc")}</p>
      <div class="locker-tabs">
        <button class="locker-tab${lockerTab==="bg"?" active":""}" data-tab="bg">${t("locker_backgrounds")}</button>
        <button class="locker-tab${lockerTab==="theme"?" active":""}" data-tab="theme">${t("locker_themes")}</button>
        <button class="locker-tab${lockerTab==="avatar"?" active":""}" data-tab="avatar">${t("locker_avatars")}</button>
        <button class="locker-tab${lockerTab==="title"?" active":""}" data-tab="title">${t("locker_titles")}</button>
      </div>
      <div class="locker-grid" id="lockerGrid"></div>
      <div class="spacer-sm"></div>`;
    el.querySelectorAll("[data-tab]").forEach(b=>
      b.addEventListener("click",()=>{ lockerTab=b.getAttribute("data-tab"); renderLocker(); }));
    el.querySelector("#goShopLink").addEventListener("click",()=>navTo("coinshop"));
    renderLockerGrid();
  }

  function renderLockerGrid() {
    const st = S.get();
    const cats = { bg:R.BACKGROUNDS, theme:R.THEMES, avatar:R.AVATARS, title:R.TITLES };
    const cat  = cats[lockerTab];
    $("#lockerGrid").innerHTML = Object.keys(cat).map(key=>{
      const item    = cat[key];
      const unl     = st.unlocked[lockerTab].includes(key);
      const equipped= st.equipped[lockerTab]===key;
      let preview   = "";
      if (lockerTab==="bg")    preview=`<span style="width:100%;height:100%;background:${item.css};display:block"></span>`;
      else if (lockerTab==="theme") preview=`<span style="width:100%;height:100%;background:linear-gradient(135deg,${item.accent},${item.accent2});display:block"></span>`;
      else if (lockerTab==="avatar") preview=item.emoji;
      else preview="🎗️";
      return `<div class="locker-item${equipped?" equipped":""}${unl?"":""}" data-item="${key}" style="${unl?"":"opacity:.45;pointer-events:none"}">
        <div class="preview">${preview}${!unl?`<span class="lock-overlay">🔒</span>`:""}</div>
        <div class="li-body"><div class="li-name">${locN(item.name)}</div>
          <div class="li-state">${equipped?"✓ "+t("locker_equipped"):unl?t("locker_equip"):t("locker_locked_hint")}</div>
        </div>
      </div>`;
    }).join("");
    $("#lockerGrid").querySelectorAll("[data-item]").forEach(it=>
      it.addEventListener("click",()=>{
        const key=it.getAttribute("data-item");
        S.equip(lockerTab,key); sound("click"||"correct");
        renderLockerGrid(); renderTopbar();
      }));
  }

  // ─── Helper: fecha de reset de la tienda ────────────────────
  function getShopResetDate() {
    const now  = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return next.toLocaleDateString(lang() === "es" ? "es-ES" : "en-US",
      { day:"numeric", month:"long", year:"numeric" });
  }

  // ═══════════════════════════════════════════════════════════
  //  COIN SHOP  (catálogo rotativo mensual)
  // ═══════════════════════════════════════════════════════════
  function renderCoinShop() {
    const st       = S.get();
    const el       = $("#screen-coinshop");
    const monthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const catalog  = R.getMonthlyShop(monthStr);           // catálogo del mes

    const sections = [
      { key:"bg",     title:t("shop_section_bg"),           items:catalog.filter(i=>i.type==="bg") },
      { key:"avatar", title:t("shop_section_avatar"),        items:catalog.filter(i=>i.type==="avatar") },
      { key:"title",  title:t("shop_section_title_items"),   items:catalog.filter(i=>i.type==="title") },
      { key:"theme",  title:t("shop_section_theme"),         items:catalog.filter(i=>i.type==="theme") },
      { key:"boost",  title:t("shop_section_boost"),         items:catalog.filter(i=>["xp_boost","shield"].includes(i.type)) }
    ].filter(sec => sec.items.length > 0);

    const boostLine  = st.xpBoost>1
      ? `<div class="boost-pill">⚡ ${t("shop_boost_active")}${st.xpBoost}</div>` : "";
    const shieldLine = (st.stats.shieldStored||0)>0
      ? `<div class="boost-pill" style="background:rgba(59,130,246,.2);border-color:#3b82f6">🛡️ ${t("shop_shield_count")} ${st.stats.shieldStored}</div>` : "";

    // Banner de reinicio mensual
    const resetBanner = `<div class="shop-reset-banner">🗓️ ${t("shop_resets")} ${getShopResetDate()}</div>`;

    const sectHTML = sections.map(sec=>`
      <h3 class="section-title" style="font-size:15px;margin-top:16px">${sec.title}</h3>
      <div class="shop-grid">${sec.items.map(item=>{
        const owned = !item.consumable && (st.shopOwned.includes(item.id)||st.unlocked[item.type]?.includes(item.value));
        const canBuy= st.coins >= item.price && !owned;
        let preview="";
        if (item.type==="bg")          { const b=R.BACKGROUNDS[item.value]; preview=`<span style="width:100%;height:100%;background:${b.css};display:block;border-radius:10px 10px 0 0"></span>`; }
        else if (item.type==="avatar")  preview=`<span style="font-size:36px">${R.AVATARS[item.value]?.emoji||"?"}</span>`;
        else if (item.type==="theme")   { const th=R.THEMES[item.value]; preview=`<span style="width:100%;height:100%;background:linear-gradient(135deg,${th.accent},${th.accent2});display:block;border-radius:10px 10px 0 0"></span>`; }
        else if (item.type==="xp_boost") preview=`<span style="font-size:36px">⚡×${item.value}</span>`;
        else if (item.type==="shield")   preview=`<span style="font-size:36px">🛡️</span>`;
        else                            preview=`<span style="font-size:36px">🎗️</span>`;
        return `<div class="shop-card${owned?" owned":""}">
          <div class="shop-preview">${preview}</div>
          <div class="shop-body">
            <div class="shop-name">${locN(item.name)}</div>
            ${item.consumable?`<div class="shop-consumable">${t("shop_consumable")}</div>`:""}
            <button class="shop-buy-btn${owned?" owned":canBuy?"":" disabled"}" data-shopitem="${item.id}" ${owned||!canBuy?"disabled":""}>
              ${owned?t("shop_owned"):`🪙 ${item.price}`}
            </button>
          </div>
        </div>`;
      }).join("")}</div>`).join("");

    el.innerHTML = `
      <button class="back-btn" id="shopBack"><i class="fa-solid fa-chevron-left"></i> ${t("locker_title")}</button>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2 class="section-title" style="margin:0">🛒 ${t("shop_title")}</h2>
        <span class="coin-pill"><i class="fa-solid fa-coins"></i> ${fmtN(st.coins)}</span>
      </div>
      <p class="muted" style="font-size:13px;margin:2px 2px 0">${t("shop_desc")}</p>
      ${resetBanner}
      ${boostLine}${shieldLine}
      ${sectHTML}
      <div class="spacer-sm"></div>`;

    el.querySelector("#shopBack").addEventListener("click",()=>navTo("shop"));
    el.querySelectorAll("[data-shopitem]").forEach(b=>
      b.addEventListener("click",()=>{
        const itemId = b.getAttribute("data-shopitem");
        // Busca en catálogo completo para el modal de confirmación
        const item   = R.COIN_SHOP_ALL.find(i=>i.id===itemId);
        showModal(`<div class="m-big">${item.type==="avatar"?R.AVATARS[item.value]?.emoji||"🛒":"🛒"}</div>
          <h3>${locN(item.name)}</h3>
          <p>${t("shop_confirm_buy")} <strong>🪙 ${item.price}</strong></p>
          <div class="m-actions">
            <button class="btn-ghost" id="sCnl">${t("cancel")}</button>
            <button class="btn-primary" id="sCnf">${t("shop_buy")}</button>
          </div>`);
        $("#sCnl").addEventListener("click",closeModal);
        $("#sCnf").addEventListener("click",()=>{
          closeModal();
          const res = S.buyShopItem(itemId);
          if (res.ok) {
            sound("reward"); confettiBurst();
            toast("🛒",`${t("reward_unlocked")}: ${locN(item.name)}`,"gold");
            notifyAchievements(S.checkAchievements());
            renderCoinShop(); renderTopbar();
          } else {
            toast("🪙", t("shop_no_coins"));
          }
        });
      }));
  }

  // ═══════════════════════════════════════════════════════════
  //  PROFILE
  // ═══════════════════════════════════════════════════════════
  function renderProfile() {
    const st = S.get();
    const el = $("#screen-profile");
    const achHtml = R.ACHIEVEMENTS.map(a=>{
      const unl = st.achievements.includes(a.id);
      return `<div class="ach${unl?" unlocked":" locked"}">
        <span class="a-icon">${unl?a.icon:"🔒"}</span>
        <div><div class="a-name">${locN(a.name)}</div><div class="a-desc">${locN(a.desc)}</div></div>
      </div>`;
    }).join("");
    el.innerHTML = `
      <button class="back-btn" id="profBack"><i class="fa-solid fa-chevron-left"></i> ${t("nav_home")}</button>
      <h2 class="section-title">⚙️ ${t("profile_title")}</h2>
      <div class="card">
        <div class="profile-row"><label>${t("profile_name")}</label>
          <input type="text" id="nameInp" value="${escH(st.name)}" maxlength="16">
        </div>
        <div class="profile-row"><label>${t("profile_language")}</label>
          <div class="lang-toggle">
            <button data-lang="en" class="${lang()==="en"?"active":""}">EN</button>
            <button data-lang="es" class="${lang()==="es"?"active":""}">ES</button>
          </div>
        </div>
        <div class="profile-row"><label>${t("profile_sound")}</label>
          <label class="switch"><input type="checkbox" id="sndTog"${st.sound?" checked":""}><span class="slider"></span></label>
        </div>
      </div>
      <h2 class="section-title">🏅 ${t("profile_achievements")} <span class="count">${st.achievements.length}/${R.ACHIEVEMENTS.length}</span></h2>
      <div class="ach-grid">${achHtml}</div>
      <button class="danger-btn" id="resetBtn"><i class="fa-solid fa-trash"></i> ${t("profile_reset")}</button>
      <div class="spacer-sm"></div>`;
    el.querySelector("#profBack").addEventListener("click",()=>navTo("home"));
    el.querySelector("#nameInp").addEventListener("change",e=>{ S.get().name=e.target.value.trim()||"Explorer"; S.save(); renderTopbar(); });
    el.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{
      const l=b.getAttribute("data-lang"); setLang(l); S.get().lang=l; S.save();
      applyTranslations(document); renderProfile(); renderTopbar();
    }));
    el.querySelector("#sndTog").addEventListener("change",e=>{ S.get().sound=e.target.checked; S.save(); });
    el.querySelector("#resetBtn").addEventListener("click",()=>{
      showModal(`<div class="m-big">⚠️</div><h3>${t("profile_reset")}</h3>
        <p>${t("profile_reset_confirm")}</p>
        <div class="m-actions">
          <button class="btn-ghost" id="rCnl">${t("cancel")}</button>
          <button class="btn-primary" id="rCnf" style="background:var(--bad);color:#fff">${t("yes")}</button>
        </div>`);
      $("#rCnl").addEventListener("click",closeModal);
      $("#rCnf").addEventListener("click",()=>{ S.reset(); closeModal(); setLang(S.get().lang); S.applyCosmetics(); applyTranslations(document); navTo("home"); });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  CUSTOM BUILDER (avanzado)
  // ═══════════════════════════════════════════════════════════
  function renderBuilder() {
    const el = $("#screen-builder");
    const cs = window.GEO_DATA.CONTINENTS;
    const typeOpts = [
      ["flags","mode_flags_name"],["capitals","mode_capitals_name"],["flag_to_capital","mode_flag_to_capital_name"],
      ["population","mode_population_name"],["area","mode_area_name"],["continent","mode_continent_name"],
      ["capital_hunt","mode_outline_name"],["anagram","mode_anagram_name"],["odd_one_out","mode_odd_one_name"],
      ["bigger_3","mode_bigger3_name"],["pop_rank","mode_poprank_name"],["flag_color","mode_flagcolor_name"],
      ["landlocked","mode_landlocked_name"],["island","mode_island_name"],
      ["language","mode_language_name"],["mixed","mode_survival_name"]
    ].map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join("");
    const contOpts = `<option value="ALL">${t("builder_all_continents")}</option>`+
      Object.keys(cs).filter(c=>c!=="AN").map(c=>`<option value="${c}">${locN(cs[c])}</option>`).join("");
    const diffPresets = [
      {id:"easy",   q:8,  timer:0, lives:0, xm:1.0},
      {id:"normal", q:12, timer:0, lives:0, xm:1.2},
      {id:"hard",   q:15, timer:10,lives:3, xm:1.5}
    ];

    el.innerHTML = `
      <button class="back-btn" id="bBack"><i class="fa-solid fa-chevron-left"></i> ${t("nav_play")}</button>
      <h2 class="section-title">🛠️ ${t("builder_title")}</h2>
      <div class="card">
        <!-- Nombre -->
        <div class="builder-field"><label>${t("builder_name")}</label>
          <input type="text" id="bName" placeholder="${t("builder_name")}" maxlength="24"></div>
        <!-- Preset -->
        <div class="builder-field"><label>${t("builder_difficulty")}</label>
          <div class="diff-row" id="diffRow">
            ${diffPresets.map(d=>`<button class="diff-btn" data-diff="${d.id}">${t("builder_diff_"+d.id)}</button>`).join("")}
            <button class="diff-btn active" data-diff="custom">${t("builder_diff_custom")}</button>
          </div>
        </div>
        <!-- Tipo base -->
        <div class="builder-field"><label>${t("builder_base")}</label>
          <select id="bType">${typeOpts}</select></div>
        <!-- Multi-tipo -->
        <div class="builder-field">
          <label>${t("builder_shuffle_types")}</label>
          <label class="switch"><input type="checkbox" id="bShuffle"><span class="slider"></span></label>
        </div>
        <div id="typePickerWrap" style="display:none">
          <div class="builder-field"><label style="font-size:12px;color:var(--text-dim)">${lang()==="es"?"Elige los tipos a mezclar:":"Select types to shuffle:"}</label>
          <div class="type-pills" id="typePills">
            ${[["flags","🚩"],["capitals","🏛️"],["flag_to_capital","🏙️"],["anagram","🔤"],["continent","🗺️"],["capital_hunt","🔎"],["odd_one_out","🔍"],["bigger_3","🏆"],["pop_rank","📊"],["landlocked","🏜️"],["island","🏝️"],["language","🗣️"]].map(([v,ic])=>
              `<button class="type-pill" data-type="${v}">${ic} ${t("mode_"+v+"_name")||v}</button>`).join("")}
          </div></div>
        </div>
        <!-- Continente -->
        <div class="builder-field"><label>${t("builder_continent")}</label>
          <select id="bCont">${contOpts}</select></div>
        <!-- Preguntas -->
        <div class="builder-field"><label>${t("builder_questions")}: <span class="range-val" id="bQV">10</span></label>
          <input type="range" id="bQ" min="5" max="40" value="10"></div>
        <!-- Timer -->
        <div class="builder-field"><label>${t("builder_timer")}: <span class="range-val" id="bTV">0</span>s</label>
          <input type="range" id="bT" min="0" max="30" value="0"></div>
        <!-- Vidas -->
        <div class="builder-field"><label>${t("builder_lives")}: <span class="range-val" id="bLV">0</span></label>
          <input type="range" id="bL" min="0" max="10" value="0"></div>
        <button class="bigbtn" id="bSave"><i class="fa-solid fa-floppy-disk"></i> ${t("builder_save")}</button>
      </div>
      <div class="spacer-sm"></div>`;

    el.querySelector("#bBack").addEventListener("click",()=>navTo("play"));

    // range sync
    const syncRange = (id,out,fmt) => {
      const inp = el.querySelector(id), outEl = el.querySelector(out);
      inp.addEventListener("input",()=>outEl.textContent = fmt ? fmt(inp.value) : inp.value);
    };
    syncRange("#bQ","#bQV"); syncRange("#bT","#bTV"); syncRange("#bL","#bLV");

    // presets
    el.querySelectorAll("[data-diff]").forEach(b=>b.addEventListener("click",()=>{
      el.querySelectorAll("[data-diff]").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const id = b.getAttribute("data-diff");
      const p  = diffPresets.find(d=>d.id===id);
      if (p) {
        el.querySelector("#bQ").value=p.q; el.querySelector("#bQV").textContent=p.q;
        el.querySelector("#bT").value=p.timer; el.querySelector("#bTV").textContent=p.timer;
        el.querySelector("#bL").value=p.lives; el.querySelector("#bLV").textContent=p.lives;
      }
    }));

    // shuffle toggle
    const shuffleCb = el.querySelector("#bShuffle");
    const typPickWrap = el.querySelector("#typePickerWrap");
    shuffleCb.addEventListener("change",()=>{ typPickWrap.style.display = shuffleCb.checked?"block":"none"; });

    // type pills toggle
    el.querySelectorAll(".type-pill").forEach(p=>p.addEventListener("click",()=>p.classList.toggle("active")));

    // save
    el.querySelector("#bSave").addEventListener("click",()=>{
      const name = el.querySelector("#bName").value.trim();
      if (!name) { toast("✏️",t("builder_name")); return; }
      const shuffle = shuffleCb.checked;
      let selectedTypes = [...el.querySelectorAll(".type-pill.active")].map(p=>p.getAttribute("data-type"));
      if (shuffle && selectedTypes.length < 2) selectedTypes = ["flags","capitals","continent"];
      const mode = {
        id:"c"+Date.now(), name,
        type: shuffle ? "mixed_custom" : el.querySelector("#bType").value,
        types: selectedTypes,
        shuffle,
        continent: el.querySelector("#bCont").value,
        questions: parseInt(el.querySelector("#bQ").value),
        timer:     parseInt(el.querySelector("#bT").value),
        lives:     parseInt(el.querySelector("#bL").value),
        xpMult:    1
      };
      S.get().customModes.push(mode); S.save();
      sound("reward"); toast("✅",t("builder_save"));
      notifyAchievements(S.checkAchievements());
      navTo("play");
    });
  }

  function deleteCustomMode(id) {
    const st = S.get();
    st.customModes = st.customModes.filter(m=>m.id!==id);
    S.save(); renderPlay();
  }

  // ═══════════════════════════════════════════════════════════
  //  TOASTS / MODAL / CONFETTI
  // ═══════════════════════════════════════════════════════════
  function toast(icon, text, cls="") {
    const layer = $("#toastLayer");
    const el = document.createElement("div");
    el.className = "toast " + cls;
    el.innerHTML = `<span class="t-icon">${icon}</span><span>${escH(text)}</span>`;
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 3100);
  }

  function notifyAchievements(list, baseDelay=0) {
    (list||[]).forEach((a,i)=>{
      setTimeout(()=>{ sound("reward"); toast(a.icon,`${t("achievement_unlocked")} ${locN(a.name)}`,"gold"); },baseDelay+i*700);
    });
  }

  function showModal(html) { $("#modalBox").innerHTML=html; $("#modalOverlay").hidden=false; }
  function closeModal()    { $("#modalOverlay").hidden=true; }
  $("#modalOverlay").addEventListener("click",e=>{ if(e.target.id==="modalOverlay")closeModal(); });

  function confettiBurst() {
    const cols=["#fbbf24","#10b981","#3b82f6","#ef4444","#a855f7","#ec4899","#06b6d4"];
    for(let i=0;i<32;i++){
      const c=document.createElement("div"); c.className="confetti";
      c.style.background=cols[i%cols.length];
      c.style.left=(50+(Math.random()-.5)*30)+"%";
      c.style.top="40%"; document.body.appendChild(c);
      const dx=(Math.random()-.5)*320, dy=-160-Math.random()*220;
      c.animate([{transform:"translate(0,0) rotate(0)",opacity:1},
        {transform:`translate(${dx}px,${dy}px) rotate(${Math.random()*720}deg)`,opacity:1,offset:.3},
        {transform:`translate(${dx*1.5}px,${dy+520}px) rotate(${Math.random()*720}deg)`,opacity:0}],
        {duration:1400+Math.random()*600,easing:"cubic-bezier(.2,.6,.4,1)"}).onfinish=()=>c.remove();
    }
  }

  // click topbar → profile
  document.getElementById("topbar").addEventListener("click",()=>navTo("profile"));

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();
