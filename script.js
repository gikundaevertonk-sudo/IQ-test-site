(function () {
  const TOTAL_TIME = 20 * 60; // 20 minutes, in seconds
  const RING_CIRCUMFERENCE = 553; // 2 * pi * r(88), matches style.css stroke-dasharray

  // Raw-score distribution assumptions used to map performance -> IQ.
  // MEAN: expected weighted-correct fraction for an "average" test taker.
  // SD: assumed spread of that fraction across the population.
  const ASSUMED_MEAN = 0.55;
  const ASSUMED_SD = 0.18;

  const DIFFICULTY_WEIGHT = { 1: 1, 2: 1.5, 3: 2 };
  const CATEGORY_LABELS = { logical: "Logical", numerical: "Numerical", verbal: "Verbal", spatial: "Spatial" };

  const introScreen = document.getElementById("screen-intro");
  const testScreen = document.getElementById("screen-test");
  const resultsScreen = document.getElementById("screen-results");

  const btnStart = document.getElementById("btn-start");
  const btnNext = document.getElementById("btn-next");
  const btnSkip = document.getElementById("btn-skip");
  const btnRetake = document.getElementById("btn-retake");
  const btnCopy = document.getElementById("btn-copy");

  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const timerEl = document.getElementById("timer");
  const categoryTag = document.getElementById("question-category");
  const questionText = document.getElementById("question-text");
  const questionVisual = document.getElementById("question-visual");
  const optionsEl = document.getElementById("options");

  let questions = [];
  let currentIndex = 0;
  let selectedOption = null;
  let answers = [];
  let timeLeft = TOTAL_TIME;
  let timerInterval = null;
  let lastResult = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

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

  function prepareQuestions() {
    const bank = shuffle(QUESTION_BANK);
    questions = bank.map((q) => {
      const optionOrder = shuffle(q.options.map((_, idx) => idx));
      const options = optionOrder.map((idx) => q.options[idx]);
      const answerIndex = optionOrder.indexOf(q.answer);
      return {
        category: q.category,
        difficulty: q.difficulty,
        text: q.text,
        visual: q.visual || null,
        options,
        answerIndex,
      };
    });
  }

  function startTest() {
    prepareQuestions();
    currentIndex = 0;
    answers = [];
    selectedOption = null;
    timeLeft = TOTAL_TIME;

    introScreen.classList.add("hidden");
    resultsScreen.classList.add("hidden");
    testScreen.classList.remove("hidden");

    renderQuestion();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateTimerDisplay();
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    timerEl.classList.toggle("low", timeLeft <= 60);
  }

  function renderQuestion() {
    selectedOption = null;
    btnNext.disabled = true;
    const q = questions[currentIndex];

    categoryTag.textContent = CATEGORY_LABELS[q.category] || capitalize(q.category);
    questionText.textContent = q.text;

    if (q.visual) {
      questionVisual.textContent = q.visual;
      questionVisual.classList.add("active");
    } else {
      questionVisual.textContent = "";
      questionVisual.classList.remove("active");
    }

    optionsEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.textContent = opt;
      btn.addEventListener("click", () => selectOption(idx, btn));
      optionsEl.appendChild(btn);
    });

    progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;
    progressLabel.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
    btnNext.textContent = currentIndex === questions.length - 1 ? "Finish" : "Next";
  }

  function selectOption(idx, btnEl) {
    selectedOption = idx;
    optionsEl.querySelectorAll(".option").forEach((el) => el.classList.remove("selected"));
    btnEl.classList.add("selected");
    btnNext.disabled = false;
  }

  function recordCurrentAnswer(forceSkip) {
    if (answers.length > currentIndex) return;
    const q = questions[currentIndex];
    const skipped = forceSkip || selectedOption === null;
    const correct = !skipped && selectedOption === q.answerIndex;
    answers.push({ category: q.category, difficulty: q.difficulty, correct, skipped });
  }

  function goNext(skip) {
    recordCurrentAnswer(skip);
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishTest();
    }
  }

  function handleTimeout() {
    clearInterval(timerInterval);
    recordCurrentAnswer(false);
    while (answers.length < questions.length) {
      const q = questions[answers.length];
      answers.push({ category: q.category, difficulty: q.difficulty, correct: false, skipped: true });
    }
    testScreen.classList.add("hidden");
    showResults();
  }

  function finishTest() {
    clearInterval(timerInterval);
    testScreen.classList.add("hidden");
    showResults();
  }

  function computeResults() {
    let totalWeight = 0, earnedWeight = 0, correctCount = 0, skippedCount = 0;
    const catTotals = {}, catCorrect = {};

    answers.forEach((a) => {
      const w = DIFFICULTY_WEIGHT[a.difficulty] || 1;
      totalWeight += w;
      if (a.correct) {
        earnedWeight += w;
        correctCount++;
      }
      if (a.skipped) skippedCount++;
      catTotals[a.category] = (catTotals[a.category] || 0) + 1;
      if (a.correct) catCorrect[a.category] = (catCorrect[a.category] || 0) + 1;
    });

    const rawPercent = totalWeight > 0 ? earnedWeight / totalWeight : 0;

    let z = (rawPercent - ASSUMED_MEAN) / ASSUMED_SD;
    z = Math.max(-3.2, Math.min(3.2, z));

    let iq = Math.round(100 + 15 * z);
    iq = Math.max(55, Math.min(160, iq));

    const percentile = Math.round(normalCDF(z) * 1000) / 10;

    const categories = Object.keys(catTotals).map((cat) => ({
      category: cat,
      correct: catCorrect[cat] || 0,
      total: catTotals[cat],
      pct: Math.round(((catCorrect[cat] || 0) / catTotals[cat]) * 100),
    }));

    return {
      iq,
      percentile,
      correctCount,
      skippedCount,
      totalQuestions: answers.length,
      categories,
    };
  }

  function showResults() {
    const r = computeResults();
    lastResult = r;
    resultsScreen.classList.remove("hidden");

    const scoreNumber = document.getElementById("score-number");
    const ringFill = document.getElementById("ring-fill");
    const percentileText = document.getElementById("percentile-text");
    const bandText = document.getElementById("band-text");
    const breakdown = document.getElementById("breakdown");
    const statCorrect = document.getElementById("stat-correct");
    const statTime = document.getElementById("stat-time");
    const statSkipped = document.getElementById("stat-skipped");

    scoreNumber.textContent = r.iq;
    percentileText.textContent = `Higher than ${r.percentile}% of the modeled population.`;
    bandText.textContent = `Band: ${bandFor(r.iq)}`;

    const pct = Math.max(0, Math.min(1, (r.iq - 55) / (160 - 55)));
    const offset = RING_CIRCUMFERENCE * (1 - pct);
    ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ringFill.style.strokeDashoffset = String(offset);
      });
    });

    breakdown.innerHTML = "";
    r.categories.forEach((c) => {
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `
        <span class="breakdown-label">${CATEGORY_LABELS[c.category] || capitalize(c.category)}</span>
        <span class="breakdown-bar-bg"><span class="breakdown-bar-fill" style="width:${c.pct}%"></span></span>
        <span class="breakdown-pct">${c.pct}%</span>
      `;
      breakdown.appendChild(row);
    });

    statCorrect.textContent = `${r.correctCount}/${r.totalQuestions}`;
    const elapsed = TOTAL_TIME - timeLeft;
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    statTime.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    statSkipped.textContent = String(r.skippedCount);

    btnCopy.textContent = "Copy Result";
  }

  btnStart.addEventListener("click", startTest);
  btnNext.addEventListener("click", () => goNext(false));
  btnSkip.addEventListener("click", () => goNext(true));

  btnRetake.addEventListener("click", () => {
    resultsScreen.classList.add("hidden");
    startTest();
  });

  btnCopy.addEventListener("click", () => {
    if (!lastResult) return;
    const text = `I scored an estimated IQ of ${lastResult.iq} (${bandFor(lastResult.iq)}, ~${lastResult.percentile}th percentile) on this online IQ test.`;
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
})();
