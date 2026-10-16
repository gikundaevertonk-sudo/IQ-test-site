(function () {
  // Configuration
  const RING_CIRCUMFERENCE = 553;
  const DIFFICULTY_WEIGHT = { 1: 1, 2: 1.5, 3: 2 };
  // Speed-scored tests allow proportionally more time for harder questions.
  const SPEED_TARGET_FACTOR = { 1: 1, 2: 1.5, 3: 2 };
  const MAX_HISTORY = 20;
  const HISTORY_SHOWN = 5;
  const KEY_PROGRESS = "itp.progress.v1";
  const KEY_HISTORY = "itp.history.v1";
  const KEY_THEME = "itp.theme";

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
  const btnNext = document.getElementById("btn-next");

  // Results screen
  const btnHome = document.getElementById("btn-home");
  const btnCopy = document.getElementById("btn-copy");
  const btnRetake = document.getElementById("btn-retake");

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
  let testActive = false;
  let lastResult = null;

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

  function showScreen(screen) {
    [homeScreen, testInfoScreen, testScreen, resultsScreen].forEach((s) => {
      s.classList.toggle("hidden", s !== screen);
    });
    window.scrollTo(0, 0);
  }

  // ---------- Theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  function initTheme() {
    applyTheme(store.get(KEY_THEME) === "dark" ? "dark" : "light");
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
      card.appendChild(el("div", "test-icon", test.icon));
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

    document.getElementById("info-eyebrow").textContent = "Test Assessment";
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
      : `${saved.test.title}: time ran out while you were away. Resume to see your result.`;
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
  function startTest() {
    if (!currentTest) return;
    if (loadProgress() && !window.confirm("Starting a new test will discard the test you have in progress. Continue?")) {
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
    showScreen(testScreen);
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
      chip.classList.toggle("answered", answered);
      chip.classList.toggle("current", i === currentIndex);
      chip.setAttribute("aria-label", `Question ${i + 1}, ${answered ? "answered" : "unanswered"}`);
      if (i === currentIndex) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  }

  function renderQuestion() {
    clearInterval(studyInterval);
    const q = questions[currentIndex];
    const total = questions.length;
    const nav = currentTest.allowNavigation;

    categoryTag.textContent = capitalize(q.category) || "Question";
    progressLabel.textContent = `Question ${currentIndex + 1} / ${total}`;
    progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
    progressBar.setAttribute("aria-valuemin", "1");
    progressBar.setAttribute("aria-valuemax", String(total));
    progressBar.setAttribute("aria-valuenow", String(currentIndex + 1));
    updateTimerDisplay(remainingSeconds());

    btnPrev.classList.toggle("hidden", !nav);
    btnFinish.classList.toggle("hidden", !nav);
    btnPrev.disabled = currentIndex === 0;
    btnNext.textContent = currentIndex === total - 1 ? "Finish" : "Next";
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
    btnNext.disabled = true;
    btnSkip.disabled = true;
    btnPrev.disabled = true;

    const studyEnds = Date.now() + q.study.seconds * 1000;
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
    const nav = currentTest.allowNavigation;
    questionText.textContent = q.text;
    setVisual(q.visual);

    btnSkip.disabled = false;
    btnPrev.disabled = !nav || currentIndex === 0;
    btnNext.disabled = isUnanswered(currentIndex);

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
          // Enter/Space only selects; moving on is a separate, deliberate action.
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

  function selectOption(idx) {
    responses[currentIndex] = idx;
    optionsEl.querySelectorAll(".option").forEach((btn, i) => {
      btn.classList.toggle("selected", i === idx);
    });
    optionsEl.querySelectorAll(".option")[idx].focus();
    btnNext.disabled = false;
    updateQuestionMap();
    saveProgress();
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

  function goNext(skip) {
    if (skip) responses[currentIndex] = null;
    leaveQuestion();
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      saveProgress();
      renderQuestion();
    } else {
      requestFinish();
    }
  }

  // Offers a chance to review unanswered questions before ending the test.
  function requestFinish() {
    if (currentTest.allowNavigation) {
      const missing = questions.map((_, i) => i).filter(isUnanswered);
      if (missing.length) {
        const list = missing.map((i) => i + 1).join(", ");
        const noun = missing.length === 1 ? "question" : "questions";
        if (!window.confirm(`You have ${missing.length} unanswered ${noun} (${list}). Finish anyway?\n\nChoose Cancel to go back and review.`)) {
          goTo(missing[0]);
          return;
        }
      }
    }
    finishTest();
  }

  function finishTest() {
    if (!testActive) return;
    leaveQuestion();
    testActive = false;
    stopTimers();
    finishedAt = Math.min(Date.now(), endsAt);
    clearProgress();
    showResults();
  }

  function goBackFromTest() {
    if (testActive) {
      const ok = window.confirm("Leave this test? Your progress is saved and you can resume from the home screen while there is time left.");
      if (!ok) return;
      leaveQuestion();
      saveProgress();
    }
    testActive = false;
    stopTimers();
    goHome();
  }

  function goHome() {
    currentTest = null;
    renderHome();
    showScreen(homeScreen);
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
      z = Math.max(-3.2, Math.min(3.2, z));
      score = Math.max(55, Math.min(160, Math.round(100 + 15 * z)));
      percentile = Math.max(1, Math.min(99, Math.round(normalCDF(z) * 100)));
      band = bandFor(score);
    } else {
      score = Math.round(rawPercent * 100);
      if (score >= 80) band = "Excellent";
      else if (score >= 60) band = "Good";
      else if (score >= 40) band = "Average";
      else band = "Needs Work";
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

    showScreen(resultsScreen);

    const isIq = currentTest.scoringType === "iq";
    const percentileText = document.getElementById("percentile-text");
    const detailText = document.getElementById("detail-text");
    const historyText = document.getElementById("history-text");

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

    if (currentTest.speed) {
      const parts = [`Accuracy ${r.accuracyPct}%`];
      if (r.avgSeconds !== null) parts.push(`average ${r.avgSeconds.toFixed(1)} s per answer`);
      if (r.speedPct !== null) parts.push(`speed rating ${r.speedPct}%`);
      detailText.textContent = parts.join(" · ");
      detailText.classList.remove("hidden");
    } else {
      detailText.classList.add("hidden");
    }

    if (previousBest === null) {
      historyText.textContent = "First attempt recorded.";
    } else if (r.score > previousBest) {
      historyText.textContent = `New personal best (previous best ${scoreLabel(currentTest, previousBest)}).`;
    } else {
      historyText.textContent = `Your best so far: ${scoreLabel(currentTest, Math.max(previousBest, r.score))}.`;
    }

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

    const review = document.getElementById("review");
    review.open = false;
    renderReview();

    btnCopy.textContent = "Copy Result";
  }

  function resultSummary() {
    const r = lastResult;
    if (currentTest && currentTest.scoringType === "iq") {
      return `I scored an estimated ${r.score} IQ on the ${r.testTitle} test (${r.band}, roughly the ${ordinal(r.percentile)} percentile by an assumed distribution).`;
    }
    return `I scored ${r.score}% on the ${r.testTitle} test (${r.band}).`;
  }

  // ---------- Event listeners ----------
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set(KEY_THEME, next);
  });

  btnResume.addEventListener("click", resumeTest);
  btnDiscard.addEventListener("click", () => {
    if (window.confirm("Discard the test you have in progress?")) {
      clearProgress();
      renderResumeBanner();
    }
  });

  btnBackInfo.addEventListener("click", goHome);
  btnStartTest.addEventListener("click", startTest);
  btnClearHistory.addEventListener("click", () => {
    if (currentTest && window.confirm(`Clear your saved scores for ${currentTest.title}?`)) {
      clearHistory(currentTest.id);
      renderInfoHistory();
    }
  });

  btnBackTest.addEventListener("click", goBackFromTest);
  btnPrev.addEventListener("click", () => goTo(currentIndex - 1));
  btnNext.addEventListener("click", () => goNext(false));
  btnSkip.addEventListener("click", () => goNext(true));
  btnFinish.addEventListener("click", requestFinish);

  btnHome.addEventListener("click", goHome);
  btnRetake.addEventListener("click", startTest);

  btnCopy.addEventListener("click", () => {
    if (!lastResult) return;
    const text = resultSummary();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          btnCopy.textContent = "Copied!";
          setTimeout(() => (btnCopy.textContent = "Copy Result"), 1500);
        },
        () => window.prompt("Copy your result:", text)
      );
    } else {
      window.prompt("Copy your result:", text);
    }
  });

  // Catch up immediately when a background tab becomes visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });

  // Initialize
  initTheme();
  renderHome();
})();
