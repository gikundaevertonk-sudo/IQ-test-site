(function () {
  // Configuration
  const RING_CIRCUMFERENCE = 553;
  const ASSUMED_MEAN = 0.55;
  const ASSUMED_SD = 0.18;
  const DIFFICULTY_WEIGHT = { 1: 1, 2: 1.5, 3: 2 };

  // Screen elements
  const homeScreen = document.getElementById("screen-home");
  const testInfoScreen = document.getElementById("screen-test-info");
  const testScreen = document.getElementById("screen-test");
  const resultsScreen = document.getElementById("screen-results");

  // Home screen
  const testsGrid = document.getElementById("tests-grid");

  // Test Info screen
  const btnBackInfo = document.getElementById("btn-back-info");
  const btnStartTest = document.getElementById("btn-start-test");

  // Test screen
  const btnBackTest = document.getElementById("btn-back-test");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const timerEl = document.getElementById("timer");
  const categoryTag = document.getElementById("question-category");
  const questionText = document.getElementById("question-text");
  const questionVisual = document.getElementById("question-visual");
  const optionsEl = document.getElementById("options");
  const btnSkip = document.getElementById("btn-skip");
  const btnNext = document.getElementById("btn-next");

  // Results screen
  const btnHome = document.getElementById("btn-home");
  const btnCopy = document.getElementById("btn-copy");
  const btnRetake = document.getElementById("btn-retake");

  // State
  let currentTest = null;
  let questions = [];
  let currentIndex = 0;
  let selectedOption = null;
  let answers = [];
  let timeLeft = 0;
  let timerInterval = null;
  let lastResult = null;

  // Utility functions
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

  // Home screen functions
  function renderHome() {
    testsGrid.innerHTML = "";
    getAllTests().forEach(test => {
      const card = document.createElement("div");
      card.className = "test-card";
      card.style.borderTop = `4px solid ${test.color}`;
      card.innerHTML = `
        <div class="test-icon">${test.icon}</div>
        <h3>${test.title}</h3>
        <p>${test.description}</p>
        <button class="btn btn-small" data-test-id="${test.id}">Take Test</button>
      `;
      card.querySelector("button").addEventListener("click", () => selectTest(test.id));
      testsGrid.appendChild(card);
    });
  }

  function selectTest(testId) {
    currentTest = getTestById(testId);
    showTestInfo();
  }

  // Test Info screen
  function showTestInfo() {
    if (!currentTest) return;

    document.getElementById("info-eyebrow").textContent = "Test Assessment";
    document.getElementById("info-title").textContent = currentTest.title;
    document.getElementById("info-description").textContent = currentTest.description;
    document.getElementById("info-questions").textContent = currentTest.numQuestions;
    document.getElementById("info-duration").textContent = `${Math.ceil(currentTest.timeLimit / 60)} min`;
    document.getElementById("info-categories").textContent = currentTest.categories.join(", ");
    document.getElementById("info-disclaimer").textContent = currentTest.disclaimer;

    homeScreen.classList.add("hidden");
    testInfoScreen.classList.remove("hidden");
  }

  function prepareQuestions() {
    const questionsKey = currentTest.questionsKey;
    const bank = window[questionsKey];

    if (!bank || bank.length < currentTest.numQuestions) {
      alert("Error: Insufficient questions loaded.");
      return false;
    }

    const shuffled = shuffle(bank).slice(0, currentTest.numQuestions);
    questions = shuffled.map((q) => {
      if (!q.text || !q.options || q.options.length < 2 || q.answer === undefined) {
        return null;
      }
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
    }).filter(q => q !== null);

    return questions.length >= currentTest.numQuestions;
  }

  function startTest() {
    if (!prepareQuestions()) {
      return;
    }

    currentIndex = 0;
    answers = [];
    selectedOption = null;
    timeLeft = currentTest.timeLimit;

    testInfoScreen.classList.add("hidden");
    testScreen.classList.remove("hidden");

    renderQuestion();
    startTimer();
  }

  // Timer functions
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

  // Question rendering
  function renderQuestion() {
    selectedOption = null;
    btnNext.disabled = true;
    const q = questions[currentIndex];

    categoryTag.textContent = capitalize(q.category) || "Question";
    questionText.textContent = q.text;

    if (q.visual) {
      questionVisual.textContent = q.visual;
      questionVisual.classList.add("active");
    } else {
      questionVisual.textContent = "";
      questionVisual.classList.remove("active");
    }

    optionsEl.innerHTML = "";
    const optionButtons = [];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.textContent = opt;
      btn.setAttribute("data-option-idx", idx);
      btn.addEventListener("click", () => selectOption(idx, btn));
      optionsEl.appendChild(btn);
      optionButtons.push(btn);
    });

    // Keyboard navigation
    const handleOptionKeydown = (e) => {
      const currentBtn = e.target.closest(".option");
      if (!currentBtn) return;

      const idx = optionButtons.indexOf(currentBtn);
      let nextIdx = idx;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        nextIdx = (idx + 1) % optionButtons.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIdx = (idx - 1 + optionButtons.length) % optionButtons.length;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(idx, currentBtn);
        return;
      }

      optionButtons[nextIdx].focus();
    };

    optionButtons.forEach((btn) => {
      btn.addEventListener("keydown", handleOptionKeydown);
    });

    progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;
    progressLabel.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
    progressFill.parentElement.setAttribute("aria-valuenow", currentIndex);
    progressFill.parentElement.setAttribute("aria-valuemax", questions.length);
    btnNext.textContent = currentIndex === questions.length - 1 ? "Finish" : "Next";

    if (optionButtons.length > 0) {
      optionButtons[0].focus();
    }
  }

  function selectOption(idx, btnEl) {
    selectedOption = idx;
    const allOptions = optionsEl.querySelectorAll(".option");
    allOptions.forEach((el) => el.classList.remove("selected"));
    btnEl.classList.add("selected");
    btnEl.focus();
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

  function goBack(fromInfo = false) {
    clearInterval(timerInterval);
    if (fromInfo) {
      testInfoScreen.classList.add("hidden");
    } else {
      testScreen.classList.add("hidden");
    }
    homeScreen.classList.remove("hidden");
    currentTest = null;
    currentIndex = 0;
    answers = [];
    selectedOption = null;
    timeLeft = 0;
  }

  // Results computation
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
    let score, percentile, band;

    if (currentTest.scoringType === "iq") {
      let z = (rawPercent - ASSUMED_MEAN) / ASSUMED_SD;
      z = Math.max(-3.2, Math.min(3.2, z));
      score = Math.round(100 + 15 * z);
      score = Math.max(55, Math.min(160, score));
      percentile = Math.round(normalCDF(z) * 1000) / 10;
      band = bandFor(score);
    } else {
      score = Math.round(rawPercent * 100);
      percentile = Math.round(normalCDF((rawPercent - ASSUMED_MEAN) / ASSUMED_SD) * 1000) / 10;
      if (score >= 80) band = "Excellent";
      else if (score >= 60) band = "Good";
      else if (score >= 40) band = "Average";
      else band = "Needs Work";
    }

    const categories = Object.keys(catTotals).map((cat) => ({
      category: cat,
      correct: catCorrect[cat] || 0,
      total: catTotals[cat],
      pct: Math.round(((catCorrect[cat] || 0) / catTotals[cat]) * 100),
    }));

    return {
      score,
      percentile,
      band,
      correctCount,
      skippedCount,
      totalQuestions: answers.length,
      categories,
      testTitle: currentTest.title,
    };
  }

  function showResults() {
    const r = computeResults();
    lastResult = r;
    resultsScreen.classList.remove("hidden");

    const scoreNumber = document.getElementById("score-number");
    const scoreCaption = document.getElementById("score-caption");
    const ringFill = document.getElementById("ring-fill");
    const percentileText = document.getElementById("percentile-text");
    const bandText = document.getElementById("band-text");
    const breakdown = document.getElementById("breakdown");
    const resultEyebrow = document.getElementById("result-eyebrow");
    const statCorrect = document.getElementById("stat-correct");
    const statTime = document.getElementById("stat-time");
    const statSkipped = document.getElementById("stat-skipped");

    resultEyebrow.textContent = r.testTitle;
    scoreNumber.textContent = r.score;
    scoreCaption.textContent = currentTest.scoringType === "iq" ? "Estimated IQ" : "Score %";
    percentileText.textContent = `Higher than ${r.percentile}% of participants.`;
    bandText.textContent = `Band: ${r.band}`;

    const maxScore = currentTest.scoringType === "iq" ? 160 : 100;
    const minScore = currentTest.scoringType === "iq" ? 55 : 0;
    const pct = Math.max(0, Math.min(1, (r.score - minScore) / (maxScore - minScore)));
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
        <span class="breakdown-label">${capitalize(c.category)}</span>
        <span class="breakdown-bar-bg"><span class="breakdown-bar-fill" style="width:${c.pct}%"></span></span>
        <span class="breakdown-pct">${c.pct}%</span>
      `;
      breakdown.appendChild(row);
    });

    statCorrect.textContent = `${r.correctCount}/${r.totalQuestions}`;
    const elapsed = currentTest.timeLimit - timeLeft;
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    statTime.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    statSkipped.textContent = String(r.skippedCount);

    btnCopy.textContent = "Copy Result";
  }

  // Event listeners
  btnBackInfo.addEventListener("click", () => goBack(true));
  btnStartTest.addEventListener("click", startTest);
  btnBackTest.addEventListener("click", () => goBack(false));
  btnNext.addEventListener("click", () => goNext(false));
  btnSkip.addEventListener("click", () => goNext(true));
  btnHome.addEventListener("click", () => {
    resultsScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
  });

  btnRetake.addEventListener("click", () => {
    resultsScreen.classList.add("hidden");
    startTest();
  });

  btnCopy.addEventListener("click", () => {
    if (!lastResult) return;
    const text = `I scored ${lastResult.score}${currentTest.scoringType === "iq" ? " IQ" : "%"} on the ${lastResult.testTitle} test (${lastResult.band}, ~${lastResult.percentile}th percentile).`;
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

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (testScreen.classList.contains("hidden")) return;
    if (e.key === "Enter" && !btnNext.disabled) {
      e.preventDefault();
      btnNext.click();
    }
  });

  // Initialize
  renderHome();
})();
