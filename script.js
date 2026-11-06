(function () {
  // Configuration
  const RING_CIRCUMFERENCE = 553;
  const DIFFICULTY_WEIGHT = { 1: 1, 2: 1.5, 3: 2 };
  // Speed-scored tests allow proportionally more time for harder questions.
  const SPEED_TARGET_FACTOR = { 1: 1, 2: 1.5, 3: 2 };
  const AUTO_ADVANCE_MS = 450; // pause after picking an answer before moving on
  const MAX_HISTORY = 20;
  const HISTORY_SHOWN = 5;
  const KEY_PROGRESS = "itp.progress.v1";
  const KEY_HISTORY = "itp.history.v1";
  const KEY_THEME = "itp.theme.v2";
  const KEY_TAB_SEEN = "itp.sharetab.v1";

  // Screen elements
  const homeScreen = document.getElementById("screen-home");
  const testInfoScreen = document.getElementById("screen-test-info");
  const testScreen = document.getElementById("screen-test");
  const resultsScreen = document.getElementById("screen-results");
  const themeToggle = document.getElementById("theme-toggle");

  // Home screen
  const testsGrid = document.getElementById("tests-grid");
  const resumeBanner = document.getElementById("resume-banner");
  const resumeText = document.getElementById("resume-text");
  const btnResume = document.getElementById("btn-resume");
  const btnDiscard = document.getElementById("btn-discard");

  // Test Info screen
  const btnBackInfo = document.getElementById("btn-back-info");
  const btnStartTest = document.getElementById("btn-start-test");
  const infoHistory = document.getElementById("info-history");
  const infoHistoryList = document.getElementById("info-history-list");
  const btnClearHistory = document.getElementById("btn-clear-history");

  // Test screen
  const btnBackTest = document.getElementById("btn-back-test");
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const timerEl = document.getElementById("timer");
  const questionMap = document.getElementById("question-map");
  const categoryTag = document.getElementById("question-category");
  const questionText = document.getElementById("question-text");
  const questionVisual = document.getElementById("question-visual");
  const optionsEl = document.getElementById("options");
  const btnPrev = document.getElementById("btn-prev");
  const btnSkip = document.getElementById("btn-skip");
  const btnFinish = document.getElementById("btn-finish");

  // Results screen
  const btnHome = document.getElementById("btn-home");
  const btnShare = document.getElementById("btn-share");
  const btnShareLabel = document.getElementById("btn-share-label");
  const btnSaveImage = document.getElementById("btn-save-image");
  const btnSaveLabel = document.getElementById("btn-save-label");
  const btnRetake = document.getElementById("btn-retake");
  const btnShareSite = document.getElementById("btn-share-site");
  const btnShareSiteLabel = document.getElementById("btn-share-site-label");
  const srAnnouncer = document.getElementById("sr-announcer");

  const oneLine = (text) => text.replace(/\s*\n\s*/g, ", ");

  // Screen readers: say what changed. Cleared first so repeating the same text is still read.
  function announce(text) {
    if (!srAnnouncer) return;
    srAnnouncer.textContent = "";
    setTimeout(() => (srAnnouncer.textContent = text), 60);
  }

  // State
  let currentTest = null;
  let questions = [];      // prepared questions: options already shuffled
  let responses = [];      // chosen option index per question, or null
  let timesMs = [];        // time spent on each question
  let studied = [];        // study phase already shown for each question
  let currentIndex = 0;
  let startedAt = 0;
  let endsAt = 0;
  let finishedAt = 0;
  let questionShownAt = 0; // 0 while nothing is being timed (e.g. during a study phase)
  let timerInterval = null;
  let studyInterval = null;
  let autoAdvanceTimer = null;
  let testActive = false;
  let lastResult = null;
  let lastResultTest = null;
  let lastShareUrl = "";
  let viewingShared = false; // results screen is showing someone else's shared link

  // ---------- Utilities ----------
  const store = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
    },
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  function ordinal(n) {
    const v = n % 100;
    if (v >= 11 && v <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  function formatClock(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Error function approximation
  function erf(x) {
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
          a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  function normalCDF(z) {
    return 0.5 * (1 + erf(z / Math.SQRT2));
  }

  function bandFor(iq) {
    if (iq >= 130) return "Very Superior";
    if (iq >= 120) return "Superior";
    if (iq >= 110) return "High Average";
    if (iq >= 90) return "Average";
    if (iq >= 80) return "Low Average";
    if (iq >= 70) return "Borderline";
    return "Low";
  }

  function percentBand(score) {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Work";
  }

  // ---------- Shareable result links ----------
  // A result is packed into the URL hash (#r=...), so links work on any static host
  // and nothing is sent to a server. Anyone can edit a link, so shared results are
  // self-reported: decoding validates ranges and re-derives the band from the score.
  function siteUrl() {
    return window.location.origin + window.location.pathname;
  }

  function toBase64Url(str) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function fromBase64Url(str) {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return atob(b64 + "===".slice((b64.length + 3) % 4));
  }

  function encodeResult(test, r) {
    const pctByCat = {};
    r.categories.forEach((c) => (pctByCat[c.category] = c.pct));
    const payload = {
      v: 1,
      t: test.id,
      s: r.score,
      c: r.correctCount,
      n: r.totalQuestions,
      k: r.skippedCount,
      e: r.elapsedSeconds,
      g: test.categories.map((cat) => (cat in pctByCat ? pctByCat[cat] : -1)),
      d: Math.floor(Date.now() / 1000),
    };
    if (r.percentile !== null) payload.p = r.percentile;
    if (test.speed) {
      payload.a = r.accuracyPct;
      if (r.speedPct !== null) payload.sp = r.speedPct;
      if (r.avgSeconds !== null) payload.av = Math.round(r.avgSeconds * 10);
    }
    return toBase64Url(JSON.stringify(payload));
  }

  function intIn(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max;
  }

  // Returns { test, result, takenAt } or null if the link is malformed.
  function decodeResult(code) {
    let p;
    try {
      p = JSON.parse(fromBase64Url(code));
    } catch (e) {
      return null;
    }
    if (!p || typeof p !== "object" || p.v !== 1 || typeof p.t !== "string") return null;
    const test = getTestById(p.t);
    if (!test) return null;
    const isIq = test.scoringType === "iq";
    if (!intIn(p.s, isIq ? 55 : 0, isIq ? 160 : 100)) return null;
    if (!intIn(p.n, 1, 500) || !intIn(p.c, 0, p.n) || !intIn(p.k, 0, p.n) || !intIn(p.e, 0, 86400)) return null;
    if (!Array.isArray(p.g) || p.g.length !== test.categories.length || !p.g.every((x) => intIn(x, -1, 100))) return null;

    const result = {
      score: p.s,
      percentile: isIq && intIn(p.p, 1, 99) ? p.p : null,
      band: isIq ? bandFor(p.s) : percentBand(p.s),
      correctCount: p.c,
      skippedCount: p.k,
      totalQuestions: p.n,
      categories: test.categories
        .map((cat, i) => ({ category: cat, pct: p.g[i] }))
        .filter((c) => c.pct >= 0),
      testTitle: test.title,
      elapsedSeconds: p.e,
    };
    if (test.speed) {
      result.accuracyPct = intIn(p.a, 0, 100) ? p.a : null;
      result.speedPct = intIn(p.sp, 0, 100) ? p.sp : null;
      result.avgSeconds = intIn(p.av, 0, 36000) ? p.av / 10 : null;
    }
    const takenAt = Number.isInteger(p.d) && p.d > 0 ? new Date(p.d * 1000) : null;
    return { test, result, takenAt };
  }

  function sharedCodeFromHash() {
    const m = window.location.hash.match(/^#r=([A-Za-z0-9_-]+)$/);
    return m ? m[1] : null;
  }

  function clearShareHash() {
    if (window.location.hash) {
      history.replaceState(history.state, "", siteUrl() + window.location.search);
    }
  }

  // Uses the native share sheet where available (mostly phones), otherwise copies.
  // labelEl is the element whose text briefly confirms the copy.
  function shareOrCopy(labelEl, idleLabel, data, onCopied) {
    const copyText = data.text ? `${data.text} ${data.url}` : data.url;
    const flash = (label) => {
      labelEl.textContent = label;
      if (onCopied) onCopied();
      setTimeout(() => (labelEl.textContent = idleLabel), 1800);
    };
    const copy = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(
          () => flash("Link copied!"),
          () => window.prompt("Copy this link:", copyText)
        );
      } else {
        window.prompt("Copy this link:", copyText);
      }
    };
    if (navigator.share) {
      navigator.share(data).catch((err) => {
        // AbortError means the person closed the share sheet; nothing to do.
        if (!err || err.name !== "AbortError") copy();
      });
    } else {
      copy();
    }
  }

  // mode: "push" adds a browser history step (so the phone/browser Back button
  // returns to the previous screen), "replace" swaps the current step.
  function showScreen(screen, mode = "push") {
    [homeScreen, testInfoScreen, testScreen, resultsScreen].forEach((s) => {
      s.classList.toggle("hidden", s !== screen);
    });
    document.body.dataset.screen = screen.id;
    try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
    recordScreen(screen, mode);
  }

  // ---------- Browser history (Back / Forward buttons) ----------
  let restoringHistory = false; // true while redrawing a screen the browser went back to
  let ownResult = null;         // the visitor's latest own result, to show again on Back/Forward

  function screenState(screen) {
    const names = new Map([[homeScreen, "home"], [testInfoScreen, "info"], [testScreen, "test"], [resultsScreen, "results"]]);
    const state = { screen: names.get(screen) };
    if (currentTest && state.screen !== "home") state.testId = currentTest.id;
    if (state.screen === "results" && viewingShared) {
      state.screen = "shared";
      state.code = sharedCodeFromHash();
    }
    return state;
  }

  function recordScreen(screen, mode) {
    if (restoringHistory) return;
    const state = screenState(screen);
    const cur = history.state;
    const same = cur && cur.screen === state.screen && cur.testId === state.testId;
    try {
      if (mode === "replace" || same) history.replaceState(state, "", window.location.href);
      else history.pushState(state, "", window.location.href);
    } catch (e) { /* history unavailable (e.g. some embedded views): screens still work */ }
  }

  function restoreFromHistory(state) {
    restoringHistory = true;
    try {
      const test = state.testId ? getTestById(state.testId) : null;
      if (state.screen === "info" && test) {
        currentTest = test;
        showTestInfo();
      } else if (state.screen === "test") {
        const saved = loadProgress();
        if (saved && saved.test.id === state.testId) resumeTest();
        else goHome();
      } else if (state.screen === "results" && ownResult && ownResult.test.id === state.testId) {
        showOwnResultAgain();
      } else if (state.screen === "shared" && state.code && showSharedResult(state.code)) {
        // shown
      } else {
        goHome();
      }
    } finally {
      restoringHistory = false;
    }
  }

  window.addEventListener("popstate", (e) => {
    const state = e.state;
    if (!state || !state.screen) return; // a pasted #r= link: handled by hashchange
    if (testActive) {
      // Back during a test: stay on the test and ask first, like the on-screen arrow.
      try { history.pushState(screenState(testScreen), "", siteUrl() + window.location.search); } catch (err) { /* ignore */ }
      goBackFromTest({ viaHistory: true });
      return;
    }
    restoreFromHistory(state);
  });

  // ---------- Confirm dialog ----------
  // In-page replacement for window.confirm, which some browsers and in-app
  // web views block or auto-cancel (that made "Finish test" appear to do nothing).
  const confirmDialog = document.getElementById("confirm-dialog");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmOk = document.getElementById("confirm-ok");
  const confirmCancel = document.getElementById("confirm-cancel");

  // Only one question is open at a time. Answering settles it straight away on the
  // click (not on the dialog's "close" event, which Chrome can delay until the next
  // paint), and opening a new question cancels any earlier one that was still open.
  let settleConfirm = null;

  function answerConfirm(value) {
    const settle = settleConfirm;
    settleConfirm = null;
    if (confirmDialog.open) confirmDialog.close();
    if (settle) settle(value);
  }

  function askConfirm(message, { ok = "OK", cancel = "Cancel" } = {}) {
    // A pending answer would otherwise jump the test forward behind the dialog.
    clearTimeout(autoAdvanceTimer);
    if (!confirmDialog || typeof confirmDialog.showModal !== "function") {
      return Promise.resolve(window.confirm(message));
    }
    answerConfirm(false);
    confirmMessage.textContent = message;
    confirmOk.textContent = ok;
    confirmCancel.textContent = cancel;
    return new Promise((resolve) => {
      settleConfirm = resolve;
      confirmDialog.showModal();
      confirmOk.focus();
    });
  }

  if (confirmDialog) {
    confirmOk.addEventListener("click", (e) => { e.preventDefault(); answerConfirm(true); });
    confirmCancel.addEventListener("click", (e) => { e.preventDefault(); answerConfirm(false); });
    // Escape, or anything else that closes the dialog, counts as Cancel.
    confirmDialog.addEventListener("close", () => answerConfirm(false));
    // Clicking the dimmed backdrop counts as Cancel.
    confirmDialog.addEventListener("click", (e) => {
      if (e.target === confirmDialog) answerConfirm(false);
    });
  }

  // ---------- Theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  function initTheme() {
    const savedTheme = store.get(KEY_THEME);
    const theme = savedTheme === "dark" ? "dark" : "light";
    if (!savedTheme) store.set(KEY_THEME, theme);
    applyTheme(theme);
  }

  // ---------- History ----------
  function readHistory() {
    try {
      const data = JSON.parse(store.get(KEY_HISTORY) || "{}");
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function testHistory(testId) {
    const list = readHistory()[testId];
    return Array.isArray(list) ? list : [];
  }

  function addHistory(testId, entry) {
    const all = readHistory();
    const list = Array.isArray(all[testId]) ? all[testId] : [];
    list.push(entry);
    all[testId] = list.slice(-MAX_HISTORY);
    store.set(KEY_HISTORY, JSON.stringify(all));
  }

  function clearHistory(testId) {
    const all = readHistory();
    delete all[testId];
    store.set(KEY_HISTORY, JSON.stringify(all));
  }

  function scoreLabel(test, score) {
    return test.scoringType === "iq" ? String(score) : `${score}%`;
  }

  // ---------- Home screen ----------
  function renderHome() {
    testsGrid.innerHTML = "";
    getAllTests().forEach((test) => {
      const card = el("div", "test-card");
      card.style.setProperty("--accent", test.color);
      card.style.animationDelay = `${testsGrid.children.length * 50}ms`;
      const iconWrap = el("div", "test-icon");
      iconWrap.innerHTML = test.icon;
      card.appendChild(iconWrap);
      card.appendChild(el("h3", "", test.title));
      card.appendChild(el("p", "", test.description));
      card.appendChild(el("p", "test-meta",
        `${test.numQuestions} questions · ${Math.ceil(test.timeLimit / 60)} min`));

      const history = testHistory(test.id);
      if (history.length) {
        const best = Math.max(...history.map((h) => h.score));
        card.appendChild(el("p", "test-best",
          `Best: ${scoreLabel(test, best)} · ${history.length} attempt${history.length === 1 ? "" : "s"}`));
      }

      const btn = el("button", "btn btn-small", "Start assessment");
      btn.type = "button";
      btn.addEventListener("click", () => selectTest(test.id));
      card.appendChild(btn);
      testsGrid.appendChild(card);
    });
    renderResumeBanner();
  }

  function selectTest(testId) {
    currentTest = getTestById(testId);
    showTestInfo();
  }

  // ---------- Test Info screen ----------
  // A short label for how the test is scored, shown above its title.
  function scoringStyle(test) {
    const bank = QUESTION_BANKS[test.id] || [];
    if (test.scoringType === "iq") return "Estimated IQ";
    if (test.speed) return "Accuracy + speed";
    if (bank.some((q) => q.study)) return "Memorise & recall";
    if (bank.some((q) => q.scores)) return "Partial credit for strong answers";
    return "Percentage score";
  }

  function renderInfoHistory() {
    const history = testHistory(currentTest.id);
    infoHistory.classList.toggle("hidden", history.length === 0);
    infoHistoryList.innerHTML = "";
    history.slice(-HISTORY_SHOWN).reverse().forEach((h) => {
      const li = el("li", "history-item");
      li.appendChild(el("span", "history-date", new Date(h.t).toLocaleDateString()));
      li.appendChild(el("span", "history-score", scoreLabel(currentTest, h.score)));
      li.appendChild(el("span", "history-band", h.band));
      infoHistoryList.appendChild(li);
    });
  }

  function showTestInfo() {
    if (!currentTest) return;

    document.getElementById("info-eyebrow").textContent = scoringStyle(currentTest);
    document.getElementById("info-title").textContent = currentTest.title;
    document.getElementById("info-description").textContent = currentTest.description;
    document.getElementById("info-questions").textContent = currentTest.numQuestions;
    document.getElementById("info-duration").textContent = `${Math.ceil(currentTest.timeLimit / 60)} min`;
    document.getElementById("info-categories").textContent = currentTest.categories.join(", ");
    document.getElementById("info-disclaimer").textContent = currentTest.disclaimer;
    renderInfoHistory();

    showScreen(testInfoScreen);
  }

  // ---------- Question selection ----------
  // Draws numQuestions bank indexes, spread evenly across the test's categories.
  function drawIndexes(bank, categories, count) {
    const pools = categories.map((cat) =>
      shuffle(bank.map((_, i) => i).filter((i) => bank[i].category === cat)));
    const picked = [];
    for (let round = 0; picked.length < count; round++) {
      let added = false;
      shuffle(pools).forEach((pool) => {
        if (picked.length < count && round < pool.length) {
          picked.push(pool[round]);
          added = true;
        }
      });
      if (!added) break;
    }
    return shuffle(picked);
  }

  function buildQuestion(bank, bankIndex, order) {
    const q = bank[bankIndex];
    const options = order.map((idx) => q.options[idx]);
    const scores = q.scores ? order.map((idx) => q.scores[idx]) : null;
    const answerIndex = scores ? scores.indexOf(Math.max(...scores)) : order.indexOf(q.answer);
    return {
      bankIndex,
      order,
      category: q.category,
      difficulty: q.difficulty,
      text: q.text,
      visual: q.visual || null,
      study: q.study || null,
      options,
      answerIndex,
      scores,
    };
  }

  // ---------- Saved progress ----------
  function saveProgress() {
    if (!testActive) return;
    store.set(KEY_PROGRESS, JSON.stringify({
      v: 1,
      testId: currentTest.id,
      startedAt,
      endsAt,
      currentIndex,
      refs: questions.map((q) => ({ i: q.bankIndex, o: q.order, t: q.text })),
      responses,
      timesMs,
      studied,
    }));
  }

  function clearProgress() {
    store.remove(KEY_PROGRESS);
  }

  // Returns the saved test if it is still usable, otherwise null.
  function loadProgress() {
    try {
      const raw = store.get(KEY_PROGRESS);
      if (!raw) return null;
      const p = JSON.parse(raw);
      const test = p && getTestById(p.testId);
      const bank = test && QUESTION_BANKS[test.id];
      if (!bank || p.v !== 1 || !Array.isArray(p.refs) || p.refs.length !== test.numQuestions) return null;
      const n = p.refs.length;
      if (![p.responses, p.timesMs, p.studied].every((a) => Array.isArray(a) && a.length === n)) return null;
      if (!Number.isInteger(p.currentIndex) || p.currentIndex < 0 || p.currentIndex >= n) return null;
      const rebuilt = [];
      for (const ref of p.refs) {
        const q = bank[ref.i];
        const validOrder = q && Array.isArray(ref.o) && ref.o.length === q.options.length &&
          [...ref.o].sort((a, b) => a - b).every((v, idx) => v === idx);
        if (!validOrder || q.text !== ref.t) return null;
        rebuilt.push(buildQuestion(bank, ref.i, ref.o));
      }
      return { test, questions: rebuilt, p };
    } catch (e) {
      return null;
    }
  }

  function renderResumeBanner() {
    const saved = loadProgress();
    if (!saved) {
      resumeBanner.classList.add("hidden");
      return;
    }
    const answered = saved.p.responses.filter((r) => r !== null).length;
    const left = Math.max(0, Math.ceil((saved.p.endsAt - Date.now()) / 1000));
    resumeText.textContent = left > 0
      ? `${saved.test.title} in progress: ${answered}/${saved.questions.length} answered, ${formatClock(left)} left.`
      : `${saved.test.title}: time ran out while you were away. Your answers so far are saved.`;
    btnResume.textContent = left > 0 ? "Resume" : "See result";
    resumeBanner.classList.remove("hidden");
  }

  function resumeTest() {
    const saved = loadProgress();
    if (!saved) {
      clearProgress();
      renderHome();
      return;
    }
    currentTest = saved.test;
    questions = saved.questions;
    responses = saved.p.responses;
    timesMs = saved.p.timesMs;
    studied = saved.p.studied;
    currentIndex = saved.p.currentIndex;
    startedAt = saved.p.startedAt;
    endsAt = saved.p.endsAt;
    beginSession();
  }

  // ---------- Starting and running a test ----------
  async function startTest() {
    if (!currentTest) return;
    if (loadProgress() && !(await askConfirm("Starting a new test will discard the test you have in progress. Continue?",
      { ok: "Start new test", cancel: "Keep it" }))) {
      return;
    }

    const bank = QUESTION_BANKS[currentTest.id];
    if (!bank || bank.length < currentTest.numQuestions) {
      window.alert("Error: Insufficient questions loaded.");
      return;
    }

    const indexes = drawIndexes(bank, currentTest.categories, currentTest.numQuestions);
    questions = indexes.map((i) => buildQuestion(bank, i, shuffle(bank[i].options.map((_, idx) => idx))));
    responses = questions.map(() => null);
    timesMs = questions.map(() => 0);
    studied = questions.map(() => false);
    currentIndex = 0;
    startedAt = Date.now();
    endsAt = startedAt + currentTest.timeLimit * 1000;
    beginSession();
  }

  function beginSession() {
    testActive = true;
    lastResult = null;
    finishedAt = 0;
    // Retaking from the results screen replaces that step instead of stacking another.
    showScreen(testScreen, history.state && history.state.screen === "results" ? "replace" : "push");
    buildQuestionMap();
    saveProgress();
    renderQuestion();
    if (Date.now() >= endsAt) {
      finishTest();
      return;
    }
    startTimer();
  }

  // ---------- Timer ----------
  // The timer is derived from timestamps, so it stays accurate in background tabs.
  function remainingSeconds() {
    return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  }

  function startTimer() {
    clearInterval(timerInterval);
    tick();
    timerInterval = setInterval(tick, 250);
  }

  function tick() {
    if (!testActive) return;
    const left = remainingSeconds();
    updateTimerDisplay(left);
    if (left <= 0) finishTest();
  }

  function updateTimerDisplay(seconds) {
    timerEl.textContent = formatClock(seconds);
    timerEl.classList.toggle("low", seconds <= 60);
  }

  function stopTimers() {
    clearTimeout(autoAdvanceTimer);
    clearInterval(timerInterval);
    clearInterval(studyInterval);
    timerInterval = null;
    studyInterval = null;
  }

  // ---------- Question rendering ----------
  function isUnanswered(i) {
    return responses[i] === null || responses[i] === undefined;
  }

  function buildQuestionMap() {
    questionMap.innerHTML = "";
    const show = currentTest.allowNavigation;
    questionMap.classList.toggle("hidden", !show);
    if (!show) return;
    questions.forEach((_, i) => {
      const chip = el("button", "map-chip", String(i + 1));
      chip.type = "button";
      chip.addEventListener("click", () => goTo(i));
      questionMap.appendChild(chip);
    });
  }

  function updateQuestionMap() {
    if (!currentTest.allowNavigation) return;
    Array.from(questionMap.children).forEach((chip, i) => {
      const answered = !isUnanswered(i);
      // Skipped = seen and left blank (any visit adds time), as opposed to not reached yet.
      const skipped = !answered && i !== currentIndex && (timesMs[i] > 0 || studied[i]);
      chip.classList.toggle("answered", answered);
      chip.classList.toggle("skipped", skipped);
      chip.classList.toggle("current", i === currentIndex);
      const status = answered ? "answered" : skipped ? "skipped" : "not seen yet";
      chip.setAttribute("aria-label", `Question ${i + 1}, ${status}`);
      chip.title = `Question ${i + 1}: ${status}`;
      if (i === currentIndex) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
    // On phones the map is one swipeable row: keep the current question in view.
    const current = questionMap.children[currentIndex];
    if (current && questionMap.scrollWidth > questionMap.clientWidth + 1) {
      const target = current.offsetLeft - (questionMap.clientWidth - current.offsetWidth) / 2;
      if (typeof questionMap.scrollTo === "function") {
        try { questionMap.scrollTo({ left: Math.max(0, target), behavior: "smooth" }); } catch (e) { questionMap.scrollLeft = Math.max(0, target); }
      } else {
        questionMap.scrollLeft = Math.max(0, target);
      }
    }
  }

  function renderQuestion() {
    clearInterval(studyInterval);
    clearTimeout(autoAdvanceTimer);
    const q = questions[currentIndex];
    const total = questions.length;

    categoryTag.textContent = capitalize(q.category) || "Question";
    progressLabel.textContent = `Question ${currentIndex + 1} / ${total}`;
    progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
    progressBar.setAttribute("aria-valuemin", "1");
    progressBar.setAttribute("aria-valuemax", String(total));
    progressBar.setAttribute("aria-valuenow", String(currentIndex + 1));
    updateTimerDisplay(remainingSeconds());

    // Previous and Finish are on every test; answering moves forward by itself.
    btnPrev.disabled = currentIndex === 0;
    updateFinishButton();
    updateQuestionMap();

    if (q.study && !studied[currentIndex]) {
      runStudyPhase(q);
    } else {
      showQuestionBody(q);
    }
  }

  function setVisual(content) {
    if (content) {
      questionVisual.textContent = content;
      questionVisual.classList.add("active");
      // Word-based stimuli get a smaller font so they fit on one or two lines.
      questionVisual.classList.toggle("long", content.length > 14 && /[A-Za-z]{3}/.test(content));
    } else {
      questionVisual.textContent = "";
      questionVisual.classList.remove("active", "long");
    }
  }

  // Memory items: show the content alone for a few seconds, then hide it and ask the question.
  function runStudyPhase(q) {
    studied[currentIndex] = true; // a refresh mid-study won't give a second look
    saveProgress();
    questionShownAt = 0;
    optionsEl.innerHTML = "";
    setVisual(q.study.content);
    btnSkip.disabled = true;
    btnFinish.disabled = true; // finishing mid-countdown would end the test on a half-seen item
    btnPrev.disabled = true;

    const studyEnds = Date.now() + q.study.seconds * 1000;
    announce(`Question ${currentIndex + 1} of ${questions.length}. Memorise this, it disappears in ${q.study.seconds} seconds: ${oneLine(q.study.content)}`);
    const renderCountdown = () => {
      const left = Math.max(0, Math.ceil((studyEnds - Date.now()) / 1000));
      questionText.textContent = `Memorise this. It disappears in ${left}s.`;
      return left;
    };
    renderCountdown();
    studyInterval = setInterval(() => {
      if (renderCountdown() <= 0) {
        clearInterval(studyInterval);
        showQuestionBody(q);
      }
    }, 200);
  }

  function showQuestionBody(q) {
    questionText.textContent = q.text;
    announce(`Question ${currentIndex + 1} of ${questions.length}. ${q.text}${q.visual ? ". " + oneLine(q.visual) : ""}`);
    setVisual(q.visual);

    btnSkip.disabled = false;
    btnFinish.disabled = false;
    btnPrev.disabled = currentIndex === 0;

    optionsEl.innerHTML = "";
    const optionButtons = [];
    q.options.forEach((opt, idx) => {
      const btn = el("button", "option", opt);
      btn.type = "button";
      btn.setAttribute("data-option-idx", idx);
      if (responses[currentIndex] === idx) btn.classList.add("selected");
      btn.addEventListener("click", () => selectOption(idx));
      btn.addEventListener("keydown", (e) => {
        const pos = optionButtons.indexOf(btn);
        let nextPos = pos;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          nextPos = (pos + 1) % optionButtons.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          nextPos = (pos - 1 + optionButtons.length) % optionButtons.length;
        } else if (e.key === "Enter" || e.key === " ") {
          // Enter/Space selects, which then auto-advances like a click.
          e.preventDefault();
          selectOption(idx);
          return;
        } else {
          return;
        }
        e.preventDefault();
        optionButtons[nextPos].focus();
      });
      optionsEl.appendChild(btn);
      optionButtons.push(btn);
    });

    const selected = responses[currentIndex];
    (optionButtons[selected !== null && selected !== undefined ? selected : 0] || optionButtons[0]).focus();
    questionShownAt = Date.now();
  }

  // Picking an answer moves on by itself after a short pause, so the choice is visible
  // and a mis-tap can be corrected by tapping another option during the pause.
  // Free-navigation tests also keep Previous and the question map for later changes.
  function selectOption(idx) {
    responses[currentIndex] = idx;
    // Stop this question's clock at the moment of answering, so the pause
    // doesn't count against speed-scored tests.
    leaveQuestion();
    optionsEl.querySelectorAll(".option").forEach((btn, i) => {
      btn.classList.toggle("selected", i === idx);
    });
    optionsEl.querySelectorAll(".option")[idx].focus();
    updateQuestionMap();
    updateFinishButton();
    saveProgress();

    clearTimeout(autoAdvanceTimer);
    const answeredIndex = currentIndex;
    if (answeredIndex < questions.length - 1) {
      autoAdvanceTimer = setTimeout(() => {
        if (testActive && currentIndex === answeredIndex) goNext();
      }, AUTO_ADVANCE_MS);
    } else {
      // Last question: don't end the test on a tap; point at the Finish button instead.
      btnFinish.focus();
    }
  }

  // Adds the time spent on the current question to its total.
  function leaveQuestion() {
    if (questionShownAt) {
      timesMs[currentIndex] += Date.now() - questionShownAt;
      questionShownAt = 0;
    }
  }

  function goTo(index) {
    if (!testActive || index === currentIndex || index < 0 || index >= questions.length) return;
    leaveQuestion();
    currentIndex = index;
    saveProgress();
    renderQuestion();
  }

  // Moves forward. Skip keeps an answer you already gave (so after going back
  // you can move on without changing it); it only leaves unanswered ones blank.
  function goNext() {
    clearTimeout(autoAdvanceTimer);
    leaveQuestion();
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      saveProgress();
      renderQuestion();
    } else {
      requestFinish();
    }
  }

  // On the last question, once it's answered, Finish becomes the highlighted action.
  function updateFinishButton() {
    const ready = currentIndex === questions.length - 1 && !isUnanswered(currentIndex);
    btnFinish.classList.toggle("finish-ready", ready);
  }

  // Offers a chance to review unanswered questions before ending the test.
  async function requestFinish() {
    clearTimeout(autoAdvanceTimer);
    const missing = questions.map((_, i) => i).filter(isUnanswered);
    if (missing.length) {
      const shown = missing.slice(0, 8).map((i) => i + 1).join(", ");
      const list = missing.length > 8 ? `${shown} and ${missing.length - 8} more` : shown;
      const noun = missing.length === 1 ? "question" : "questions";
      const finish = await askConfirm(
        `You have ${missing.length} unanswered ${noun} (${list}). Finish anyway?`,
        { ok: "Finish anyway", cancel: "Review questions" });
      if (!testActive) return; // time ran out while the dialog was open
      if (!finish) {
        goTo(missing[0]);
        return;
      }
    }
    finishTest();
  }

  function finishTest() {
    if (!testActive) return;
    if (confirmDialog && confirmDialog.open) answerConfirm(false);
    leaveQuestion();
    testActive = false;
    stopTimers();
    finishedAt = Math.min(Date.now(), endsAt);
    clearProgress();
    showResults();
  }

  async function goBackFromTest({ viaHistory = false } = {}) {
    if (testActive) {
      const ok = await askConfirm("Leave this test? Your progress is saved and you can resume from the home screen while there is time left.",
        { ok: "Leave test", cancel: "Keep going" });
      if (!ok || !testActive) return;
      leaveQuestion();
      saveProgress();
    }
    testActive = false;
    stopTimers();
    if (viaHistory) {
      // Finish the Back the visitor asked for: return to the screen before the test.
      history.back();
    } else {
      // The test step becomes the home step, so Back from home doesn't reopen the test.
      goHome("replace");
    }
  }

  function goHome(mode = "push") {
    clearShareHash();
    viewingShared = false;
    currentTest = null;
    renderHome();
    showScreen(homeScreen, mode);
  }

  // ---------- Scoring ----------
  // Points for one question: correctness (or partial credit) and, for speed tests, a speed factor.
  function scoreItem(i) {
    const q = questions[i];
    const r = responses[i];
    if (isUnanswered(i)) return { accuracy: 0, points: 0, speedFactor: null, correct: false };

    const accuracy = q.scores ? q.scores[r] : (r === q.answerIndex ? 1 : 0);
    const speed = currentTest.speed;
    if (!speed) return { accuracy, points: accuracy, speedFactor: null, correct: r === q.answerIndex };

    const target = speed.targetSeconds * SPEED_TARGET_FACTOR[q.difficulty];
    const seconds = timesMs[i] / 1000;
    const speedFactor = seconds <= target ? 1 : Math.max(0, 1 - (seconds - target) / target);
    return {
      accuracy,
      points: accuracy * (1 - speed.weight + speed.weight * speedFactor),
      speedFactor,
      correct: r === q.answerIndex,
    };
  }

  function computeResults() {
    let totalWeight = 0, earnedWeight = 0, accuracyWeight = 0;
    let correctCount = 0, skippedCount = 0;
    const speedFactors = [];
    let answeredMs = 0, answeredCount = 0;
    const catPoints = {}, catTotals = {};

    questions.forEach((q, i) => {
      const w = DIFFICULTY_WEIGHT[q.difficulty] || 1;
      const item = scoreItem(i);
      totalWeight += w;
      earnedWeight += w * item.points;
      accuracyWeight += w * item.accuracy;
      if (item.correct) correctCount++;
      if (isUnanswered(i)) {
        skippedCount++;
      } else {
        answeredMs += timesMs[i];
        answeredCount++;
        if (item.correct && item.speedFactor !== null) speedFactors.push(item.speedFactor);
      }
      catTotals[q.category] = (catTotals[q.category] || 0) + 1;
      catPoints[q.category] = (catPoints[q.category] || 0) + item.points;
    });

    const rawPercent = totalWeight > 0 ? earnedWeight / totalWeight : 0;
    let score, percentile = null, band;

    if (currentTest.scoringType === "iq") {
      const { mean, sd } = currentTest.norm;
      let z = (rawPercent - mean) / sd;
      // The spread in tests.js is chosen so a perfect run reaches z = 4 (IQ 160).
      z = Math.max(-3, Math.min(4, z));
      score = Math.max(55, Math.min(160, Math.round(100 + 15 * z)));
      percentile = Math.max(1, Math.min(99, Math.round(normalCDF(z) * 100)));
      band = bandFor(score);
    } else {
      score = Math.round(rawPercent * 100);
      band = percentBand(score);
    }

    const categories = currentTest.categories
      .filter((cat) => catTotals[cat])
      .map((cat) => ({
        category: cat,
        pct: Math.round((catPoints[cat] / catTotals[cat]) * 100),
      }));

    const result = {
      score,
      percentile,
      band,
      correctCount,
      skippedCount,
      totalQuestions: questions.length,
      categories,
      testTitle: currentTest.title,
      elapsedSeconds: Math.round((finishedAt - startedAt) / 1000),
    };

    if (currentTest.speed) {
      result.accuracyPct = Math.round((accuracyWeight / totalWeight) * 100);
      result.avgSeconds = answeredCount ? answeredMs / answeredCount / 1000 : null;
      result.speedPct = speedFactors.length
        ? Math.round((speedFactors.reduce((a, b) => a + b, 0) / speedFactors.length) * 100)
        : null;
    }
    return result;
  }

  // ---------- Results ----------
  function renderReview() {
    const list = document.getElementById("review-list");
    list.innerHTML = "";
    const speedTest = Boolean(currentTest.speed);

    questions.forEach((q, i) => {
      const r = responses[i];
      const skipped = isUnanswered(i);
      const best = r === q.answerIndex;
      const partial = !skipped && !best && q.scores && q.scores[r] > 0;
      const status = skipped ? "skipped" : best ? "correct" : partial ? "partial" : "wrong";
      const badge = {
        skipped: "Skipped",
        correct: q.scores ? "Best answer" : "Correct",
        partial: `Partial credit (${Math.round(q.scores ? q.scores[r] * 100 : 0)}%)`,
        wrong: q.scores ? "Weaker answer" : "Wrong",
      }[status];

      const li = el("li", `review-item ${status}`);
      const head = el("p", "review-q", `${i + 1}. ${q.text}`);
      li.appendChild(head);
      if (q.study) li.appendChild(el("p", "review-visual", `Shown: ${q.study.content.replace(/\s*\n\s*/g, " / ")}`));
      if (q.visual) li.appendChild(el("p", "review-visual", q.visual.replace(/\s*\n\s*/g, " / ")));
      li.appendChild(el("p", "review-visual", `Options: ${q.options.join("  |  ")}`));

      const yours = el("p", "review-line");
      yours.appendChild(el("span", "review-label", "Your answer: "));
      yours.appendChild(document.createTextNode(skipped ? "(none)" : q.options[r]));
      yours.appendChild(el("span", `review-badge ${status}`, badge));
      li.appendChild(yours);

      if (!best) {
        const key = el("p", "review-line");
        key.appendChild(el("span", "review-label", q.scores ? "Best answer: " : "Correct answer: "));
        key.appendChild(document.createTextNode(q.options[q.answerIndex]));
        li.appendChild(key);
      }
      if (speedTest && !skipped) {
        li.appendChild(el("p", "review-line review-time", `Answered in ${(timesMs[i] / 1000).toFixed(1)} s`));
      }
      list.appendChild(li);
    });
  }

  function showResults() {
    const r = computeResults();
    lastResult = r;
    lastResultTest = currentTest;
    lastShareUrl = `${siteUrl()}#r=${encodeResult(currentTest, r)}`;
    viewingShared = false;

    const previous = testHistory(currentTest.id);
    const previousBest = previous.length ? Math.max(...previous.map((h) => h.score)) : null;
    addHistory(currentTest.id, {
      t: Date.now(),
      score: r.score,
      band: r.band,
      correct: r.correctCount,
      total: r.totalQuestions,
      seconds: r.elapsedSeconds,
    });

    renderResult(currentTest, r);

    const historyText = document.getElementById("history-text");
    if (previousBest === null) {
      historyText.textContent = "First attempt recorded.";
    } else if (r.score > previousBest) {
      historyText.textContent = `New personal best (previous best ${scoreLabel(currentTest, previousBest)}).`;
    } else {
      historyText.textContent = `Your best so far: ${scoreLabel(currentTest, Math.max(previousBest, r.score))}.`;
    }

    document.getElementById("review").classList.remove("hidden");
    document.getElementById("review").open = false;
    renderReview();

    btnRetake.textContent = "Retake Test";
    ownResult = { test: currentTest, r, shareUrl: lastShareUrl, historyText: historyText.textContent };
  }

  // Back/Forward onto your own results step: redraw it (a shared link may have replaced it).
  function showOwnResultAgain() {
    currentTest = ownResult.test;
    lastResult = ownResult.r;
    lastResultTest = ownResult.test;
    lastShareUrl = ownResult.shareUrl;
    viewingShared = false;
    renderResult(ownResult.test, ownResult.r);
    document.getElementById("history-text").textContent = ownResult.historyText;
    document.getElementById("review").classList.remove("hidden");
    btnRetake.textContent = "Retake Test";
  }

  // Opens a result someone shared with a #r=... link.
  function showSharedResult(code) {
    const shared = decodeResult(code);
    if (!shared) {
      clearShareHash();
      return false;
    }
    testActive = false;
    stopTimers();
    currentTest = shared.test;
    lastResult = shared.result;
    lastResultTest = shared.test;
    lastShareUrl = `${siteUrl()}#r=${code}`;
    viewingShared = true;

    renderResult(shared.test, shared.result);
    document.getElementById("result-eyebrow").textContent = `Shared result · ${shared.test.title}`;
    document.getElementById("history-text").textContent = shared.takenAt
      ? `Taken on ${shared.takenAt.toLocaleDateString()}. Think you can beat it?`
      : "Think you can beat it?";
    document.getElementById("review").classList.add("hidden");

    btnRetake.textContent = "Take This Test";
    return true;
  }

  function renderResult(test, r) {
    // Results replace the finished test's step, so Back goes to the test's intro.
    showScreen(resultsScreen, "replace");

    const isIq = test.scoringType === "iq";
    const percentileText = document.getElementById("percentile-text");
    const detailText = document.getElementById("detail-text");

    document.getElementById("result-eyebrow").textContent = r.testTitle;
    document.getElementById("score-number").textContent = r.score;
    document.getElementById("score-caption").textContent = isIq ? "Estimated IQ" : "Score %";
    document.getElementById("band-text").textContent = `Band: ${r.band}`;

    if (r.percentile !== null) {
      percentileText.textContent = `Estimated percentile: about ${ordinal(r.percentile)}. This assumes a made-up score distribution, not real participant data.`;
      percentileText.classList.remove("hidden");
    } else {
      percentileText.classList.add("hidden");
    }

    const parts = [];
    if (test.speed) {
      if (r.accuracyPct !== null) parts.push(`Accuracy ${r.accuracyPct}%`);
      if (r.avgSeconds !== null) parts.push(`average ${r.avgSeconds.toFixed(1)} s per answer`);
      if (r.speedPct !== null) parts.push(`speed rating ${r.speedPct}%`);
    }
    detailText.textContent = parts.join(" · ");
    detailText.classList.toggle("hidden", parts.length === 0);

    const maxScore = isIq ? 160 : 100;
    const minScore = isIq ? 55 : 0;
    const pct = Math.max(0, Math.min(1, (r.score - minScore) / (maxScore - minScore)));
    const ringFill = document.getElementById("ring-fill");
    ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - pct));
      });
    });

    const breakdown = document.getElementById("breakdown");
    breakdown.innerHTML = "";
    r.categories.forEach((c) => {
      const row = el("div", "breakdown-row");
      row.appendChild(el("span", "breakdown-label", capitalize(c.category)));
      const bg = el("span", "breakdown-bar-bg");
      const fill = el("span", "breakdown-bar-fill");
      fill.style.width = `${c.pct}%`;
      bg.appendChild(fill);
      row.appendChild(bg);
      row.appendChild(el("span", "breakdown-pct", `${c.pct}%`));
      breakdown.appendChild(row);
    });

    document.getElementById("stat-correct").textContent = `${r.correctCount}/${r.totalQuestions}`;
    document.getElementById("stat-time").textContent = formatClock(r.elapsedSeconds);
    document.getElementById("stat-skipped").textContent = String(r.skippedCount);
    announce(`${r.testTitle} result: ${isIq ? "estimated IQ" : "score"} ${scoreLabel(test, r.score)}, ${r.band}.`);
  }

  // ---------- Result image ----------
  // Draws a 1080x1350 (4:5, fits phone galleries and stories) card in the current theme.
  const IMG_W = 1080, IMG_H = 1350;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function fitFont(ctx, text, weight, size, family, maxWidth) {
    let s = size;
    do {
      ctx.font = `${weight} ${s}px ${family}`;
      s -= 2;
    } while (ctx.measureText(text).width > maxWidth && s > 12);
  }

  async function drawResultCard(test, r) {
    const display = '"Space Grotesk", Georgia, serif';
    const body = '"Inter", "Segoe UI", Roboto, Arial, sans-serif';
    if (document.fonts && document.fonts.load) {
      try {
        await Promise.all([
          document.fonts.load(`700 150px "Space Grotesk"`),
          document.fonts.load(`600 30px "Inter"`),
          document.fonts.load(`500 30px "Inter"`),
        ]);
      } catch (e) { /* fall back to system fonts */ }
    }

    const css = getComputedStyle(document.documentElement);
    const v = (name) => css.getPropertyValue(name).trim();
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const C = {
      bg: v("--bg"),
      card: dark ? "#1d1b19" : "#fbf7ef",
      text: v("--text"),
      muted: v("--text-muted"),
      primary: v("--primary"),
      border: v("--border"),
      track: dark ? "rgba(245,232,208,0.12)" : "rgba(85,65,44,0.10)",
      grad: dark ? ["#b9583e", "#d2764d", "#d8a064"] : ["#99402f", "#b95438", "#ca7847"],
      textGrad: dark ? ["#edaa79", "#e6bd84"] : ["#813b2d", "#bc7443"],
    };

    const canvas = document.createElement("canvas");
    canvas.width = IMG_W;
    canvas.height = IMG_H;
    const ctx = canvas.getContext("2d");
    const cx = IMG_W / 2;
    const spaced = (px) => { if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`; };
    const linear = (x0, x1, stops) => {
      const g = ctx.createLinearGradient(x0, 0, x1, 0);
      stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
      return g;
    };

    // Page + warm glow
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, IMG_W, IMG_H);
    const glow = ctx.createRadialGradient(cx, 330, 40, cx, 330, 720);
    glow.addColorStop(0, dark ? "rgba(228,154,105,0.22)" : "rgba(201,107,69,0.20)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, IMG_W, IMG_H);

    // Card
    const M = 56;
    roundRect(ctx, M, M, IMG_W - 2 * M, IMG_H - 2 * M, 44);
    ctx.fillStyle = C.card;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Eyebrow pill
    spaced(5);
    ctx.font = `600 24px ${body}`;
    const eyebrow = r.testTitle.toUpperCase();
    const ew = ctx.measureText(eyebrow).width + 64;
    roundRect(ctx, cx - ew / 2, 116, ew, 54, 27);
    ctx.fillStyle = dark ? "rgba(228,154,105,0.14)" : "rgba(168,77,55,0.10)";
    ctx.fill();
    ctx.fillStyle = C.primary;
    ctx.fillText(eyebrow, cx + 2.5, 152);
    spaced(0);

    // Score ring
    const isIq = test.scoringType === "iq";
    const ringY = 382, ringR = 158;
    const pct = Math.max(0, Math.min(1, (r.score - (isIq ? 55 : 0)) / (isIq ? 105 : 100)));
    ctx.lineCap = "round";
    ctx.lineWidth = 24;
    ctx.strokeStyle = C.track;
    ctx.beginPath();
    ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
    ctx.stroke();
    if (pct > 0) {
      ctx.strokeStyle = linear(cx - ringR, cx + ringR, C.grad);
      ctx.beginPath();
      ctx.arc(cx, ringY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
      ctx.stroke();
    }

    ctx.font = `700 150px ${display}`;
    spaced(-4);
    ctx.fillStyle = linear(cx - 150, cx + 150, C.textGrad);
    ctx.fillText(String(r.score), cx, ringY + 46);
    spaced(4);
    ctx.font = `600 22px ${body}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(isIq ? "ESTIMATED IQ" : "SCORE %", cx, ringY + 92);
    spaced(0);

    // Band + percentile
    let y = ringY + ringR + 88;
    ctx.font = `700 50px ${display}`;
    ctx.fillStyle = C.text;
    ctx.fillText(r.band, cx, y);
    if (r.percentile !== null) {
      y += 46;
      ctx.font = `500 26px ${body}`;
      ctx.fillStyle = C.muted;
      ctx.fillText(`About the ${ordinal(r.percentile)} percentile (estimate)`, cx, y);
    }

    // Category bars
    y += 66;
    const left = M + 74, right = IMG_W - M - 74;
    const barX = left + 330, barW = right - barX - 110;
    r.categories.forEach((c) => {
      ctx.textAlign = "left";
      fitFont(ctx, capitalize(c.category), 500, 28, body, barX - left - 24);
      ctx.fillStyle = C.muted;
      ctx.fillText(capitalize(c.category), left, y + 10);
      roundRect(ctx, barX, y - 8, barW, 16, 8);
      ctx.fillStyle = C.track;
      ctx.fill();
      if (c.pct > 0) {
        roundRect(ctx, barX, y - 8, Math.max(16, barW * c.pct / 100), 16, 8);
        ctx.fillStyle = linear(barX, barX + barW, C.grad);
        ctx.fill();
      }
      ctx.textAlign = "right";
      ctx.font = `700 28px ${body}`;
      ctx.fillStyle = C.text;
      ctx.fillText(`${c.pct}%`, right, y + 10);
      y += 54;
    });

    // Stats
    y += 18;
    const stats = [
      [`${r.correctCount}/${r.totalQuestions}`, "CORRECT"],
      [formatClock(r.elapsedSeconds), "TIME USED"],
      [String(r.skippedCount), "UNANSWERED"],
    ];
    const gap = 22, boxW = (right - left - gap * 2) / 3, boxH = 116;
    ctx.textAlign = "center";
    stats.forEach(([value, label], i) => {
      const bx = left + i * (boxW + gap);
      roundRect(ctx, bx, y, boxW, boxH, 24);
      ctx.fillStyle = dark ? "rgba(255,255,255,0.03)" : "rgba(85,65,44,0.04)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = C.border;
      ctx.stroke();
      ctx.font = `700 44px ${display}`;
      ctx.fillStyle = C.text;
      ctx.fillText(value, bx + boxW / 2, y + 62);
      spaced(3);
      ctx.font = `600 18px ${body}`;
      ctx.fillStyle = C.muted;
      ctx.fillText(label, bx + boxW / 2, y + 93);
      spaced(0);
    });

    // Footer: invitation + site link
    const footY = IMG_H - M - 140;
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, footY);
    ctx.lineTo(right, footY);
    ctx.stroke();
    ctx.font = `600 30px ${body}`;
    ctx.fillStyle = C.text;
    ctx.fillText("Think you can beat it? Take the test:", cx, footY + 62);
    const link = siteUrl().replace(/^https?:\/\//, "").replace(/\/$/, "");
    fitFont(ctx, link, 700, 32, body, right - left);
    ctx.fillStyle = C.primary;
    ctx.fillText(link, cx, footY + 112);

    return canvas;
  }

  async function saveResultImage(test, r) {
    btnSaveImage.disabled = true;
    btnSaveLabel.textContent = "Drawing...";
    try {
      const canvas = await drawResultCard(test, r);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not create image");
      const fileName = `${test.id}-result-${r.score}.png`;

      // On phones, the share sheet offers "Save image" straight to the photo gallery.
      const file = typeof File === "function" ? new File([blob], fileName, { type: "image/png" }) : null;
      const touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (touch && file && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `${r.testTitle} result` });
          flashSaved("Saved!");
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return;
          // Otherwise fall through to a normal download.
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      flashSaved("Downloaded!");
    } catch (e) {
      flashSaved("Couldn't save");
    } finally {
      btnSaveImage.disabled = false;
      if (btnSaveLabel.textContent === "Drawing...") btnSaveLabel.textContent = "Save image";
    }
  }

  function flashSaved(label) {
    btnSaveLabel.textContent = label;
    popIcon(btnSaveImage);
    setTimeout(() => (btnSaveLabel.textContent = "Save image"), 1800);
  }

  function resultSummary() {
    const r = lastResult;
    const who = viewingShared ? "Someone scored" : "I scored";
    if (lastResultTest.scoringType === "iq") {
      const pct = r.percentile !== null ? `, roughly the ${ordinal(r.percentile)} percentile by an assumed distribution` : "";
      return `${who} an estimated ${r.score} IQ on the ${r.testTitle} test (${r.band}${pct}). Can you beat it?`;
    }
    return `${who} ${r.score}% on the ${r.testTitle} test (${r.band}). Can you beat it?`;
  }

  // ---------- Event listeners ----------
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set(KEY_THEME, next);
  });

  btnResume.addEventListener("click", resumeTest);
  btnDiscard.addEventListener("click", async () => {
    if (await askConfirm("Discard the test you have in progress?", { ok: "Discard", cancel: "Keep it" })) {
      clearProgress();
      renderResumeBanner();
    }
  });

  btnBackInfo.addEventListener("click", goHome);
  btnStartTest.addEventListener("click", startTest);
  btnClearHistory.addEventListener("click", async () => {
    if (currentTest && await askConfirm(`Clear your saved scores for ${currentTest.title}?`, { ok: "Clear scores" })) {
      clearHistory(currentTest.id);
      renderInfoHistory();
    }
  });

  btnBackTest.addEventListener("click", goBackFromTest);
  btnPrev.addEventListener("click", () => goTo(currentIndex - 1));
  btnSkip.addEventListener("click", goNext);
  btnFinish.addEventListener("click", requestFinish);

  btnHome.addEventListener("click", goHome);
  btnRetake.addEventListener("click", () => {
    if (viewingShared) {
      // A visitor from a shared link: show the test's intro rather than starting cold.
      const test = lastResultTest;
      clearShareHash();
      viewingShared = false;
      selectTest(test.id);
    } else {
      startTest();
    }
  });

  function popIcon(button) {
    button.classList.remove("done");
    void button.offsetWidth; // restart the animation
    button.classList.add("done");
  }

  btnShare.addEventListener("click", () => {
    if (!lastResult) return;
    shareOrCopy(btnShareLabel, "Share link", {
      title: `${lastResult.testTitle} result`,
      text: resultSummary(),
      url: lastShareUrl,
    }, () => popIcon(btnShare));
  });

  btnSaveImage.addEventListener("click", () => {
    if (!lastResult) return;
    saveResultImage(lastResultTest, lastResult, viewingShared);
  });

  btnShareSite.addEventListener("click", () => {
    btnShareSite.classList.remove("flying");
    void btnShareSite.offsetWidth;
    btnShareSite.classList.add("flying");
    setTimeout(() => btnShareSite.classList.remove("flying"), 1900);
    shareOrCopy(btnShareSiteLabel, "Pass it on", {
      title: document.title,
      text: "Ten quick self-assessments: memory, reasoning, creativity, focus and more.",
      url: siteUrl(),
    });
  });

  // On first visit, slide the tab's label out briefly so people notice it.
  if (!store.get(KEY_TAB_SEEN)) {
    setTimeout(() => btnShareSite.classList.add("peek"), 1200);
    setTimeout(() => btnShareSite.classList.remove("peek"), 4200);
    store.set(KEY_TAB_SEEN, "1");
  }

  // Opening or pasting a #r=... link while the page is already open.
  window.addEventListener("hashchange", () => {
    if (testActive) return;
    // Back/Forward between screens is handled by popstate; this is only for a pasted link.
    if (history.state && history.state.screen) return;
    const code = sharedCodeFromHash();
    const shown = code ? showSharedResult(code) : false;
    // A broken link, or Back past a shared result: don't leave a stale result up.
    if (!shown && viewingShared) goHome();
  });

  // Catch up immediately when a background tab becomes visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });

  // Initialize
  initTheme();
  renderHome();
  const initialCode = sharedCodeFromHash();
  if (!(initialCode && showSharedResult(initialCode))) recordScreen(homeScreen, "replace");
})();
