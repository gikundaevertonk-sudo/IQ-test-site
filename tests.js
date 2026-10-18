// Test definitions for the Intelligence Test Platform.
//
// Each key MUST equal the test's `id`; the question bank for a test lives in
// QUESTION_BANKS[id] (see questions.js). `node scripts/check.js` verifies this.
//
// Optional per-test settings:
//   norm            { mean, sd } assumed score distribution; only tests with one show a percentile estimate
//   speed           { targetSeconds, weight } scores response time as well as accuracy
//   allowNavigation false for tests that must be answered in order (Previous / question map hidden)
const TESTS = {
  "iq": {
    id: "iq",
    title: "Intelligence (IQ)",
    description: "Measure your general cognitive ability through logic, numerical reasoning, verbal comprehension, and spatial visualization.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12c-6-6-16-2-16 6-7 1-9 10-4 15-3 7 2 14 10 14 2 5 6 7 10 7V12Zm0 0c6-6 16-2 16 6 7 1 9 10 4 15 3 7-2 14-10 14-2 5-6 7-10 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 20c-3 2-4 5-2 8m-5 5c4 0 6 3 6 7m4-23c3 2 4 5 3 9m12-6c3 2 4 5 2 8m5 5c-4 0-6 3-6 7m-4-23c-3 2-4 5-3 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    color: "#a84d37",
    numQuestions: 30,
    timeLimit: 1200, // 20 minutes
    categories: ["Logical", "Numerical", "Verbal", "Spatial"],
    scoringType: "iq",
    norm: { mean: 0.55, sd: 0.18 },
    allowNavigation: true,
    disclaimer: "This is a self-assessment tool, not a clinical IQ test. The IQ figure is an estimate that assumes a made-up score distribution."
  },
  "memory": {
    id: "memory",
    title: "Memory",
    description: "Study short items for a few seconds, then recall them after they disappear. Covers short-term, working, and visual memory.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="18" width="28" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M24 18V12h16v6M24 30h16M24 36h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    color: "#796b58",
    numQuestions: 15,
    timeLimit: 480, // 8 minutes
    categories: ["Short-term", "Working", "Visual"],
    scoringType: "percentage",
    allowNavigation: false,
    disclaimer: "Each item is shown once for a few seconds. Long-term memory can't be measured in a single sitting, so it isn't included."
  },
  "critical-thinking": {
    id: "critical-thinking",
    title: "Critical Thinking",
    description: "Evaluate your ability to analyze information, identify assumptions, and make logical conclusions.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="27" cy="27" r="13" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m36 36 10 10M23 23h8M21 28h12M23 33h8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    color: "#9a5945",
    numQuestions: 20,
    timeLimit: 900, // 15 minutes
    categories: ["Analysis", "Inference", "Evaluation"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Tests your analytical and reasoning capabilities."
  },
  "learning": {
    id: "learning",
    title: "Learning Ability",
    description: "Learn a new rule from a few examples, then apply it. Measures how quickly you pick up unfamiliar patterns.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 22c-6-4-13-5-20-2v25c7-3 14-2 20 2 6-4 13-5 20-2V20c-7-3-14-2-20 2Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 22v25M18 27c4-1 8 0 11 2m17-2c-4-1-8 0-11 2" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>',
    color: "#687b5e",
    numQuestions: 20,
    timeLimit: 720, // 12 minutes
    categories: ["Pattern Recognition", "Adaptation", "Application"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Assesses your capacity to learn new concepts."
  },
  "creativity": {
    id: "creativity",
    title: "Creativity",
    description: "Word-association puzzles plus originality-graded questions on divergent thinking and flexible problem framing.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12c2.5 12.5 5.5 15.5 18 18-12.5 2.5-15.5 5.5-18 18-2.5-12.5-5.5-15.5-18-18 12.5-2.5 15.5-5.5 18-18Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M49 10v10m-5-5h10" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>',
    color: "#b67b3f",
    numQuestions: 15,
    timeLimit: 600, // 10 minutes
    categories: ["Divergent Thinking", "Originality", "Flexibility"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Creativity is hard to measure. Word-association items have one answer; the others give partial credit for more original options, which is a judgment call."
  },
  "problem-solving": {
    id: "problem-solving",
    title: "Problem-Solving Ability",
    description: "Work through concrete puzzles and diagnosis problems: find the real problem, generate a workable solution, and check it.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 18h10c-1-4 1-7 4-7s5 3 4 7h10v10c4-1 7 1 7 4s-3 5-7 4v10H36c1 4-1 7-4 7s-5-3-4-7H18V36c-4 1-7-1-7-4s3-5 7-4V18Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    color: "#5d7780",
    numQuestions: 18,
    timeLimit: 840, // 14 minutes
    categories: ["Problem Identification", "Solution Generation", "Evaluation"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Evaluates problem-solving skills and strategies."
  },
  "attention": {
    id: "attention",
    title: "Attention and Focus",
    description: "Count, scan, and filter carefully. Both accuracy and how quickly you answer count towards your score.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 32c4-9 11-14 18-14s14 5 18 14c-4 9-11 14-18 14s-14-5-18-14Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    color: "#a6813e",
    numQuestions: 20,
    timeLimit: 600, // 10 minutes
    categories: ["Sustained Attention", "Selective Attention", "Divided Attention"],
    scoringType: "percentage",
    speed: { targetSeconds: 15, weight: 0.4 },
    allowNavigation: false,
    disclaimer: "Correct answers earn 60% of an item's points for accuracy and up to 40% for speed."
  },
  "emotional": {
    id: "emotional",
    title: "Emotional Intelligence",
    description: "Respond to realistic scenarios. Options earn full or partial credit depending on how well they read and manage the emotions involved.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 50s-17-10-17-22c0-5 4-9 9-9 5 0 8 3 8 6 0-3 3-6 8-6 5 0 9 4 9 9 0 12-17 22-17 22Z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    color: "#ad5d5a",
    numQuestions: 20,
    timeLimit: 840, // 14 minutes
    categories: ["Self-Awareness", "Empathy", "Relationship Management"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Scenario answers are scored against a reasonable-judgment key. Real emotional intelligence is better measured by people than by quizzes."
  },
  "decision-making": {
    id: "decision-making",
    title: "Decision-Making",
    description: "Expected-value problems, common decision traps, and judgment scenarios with incomplete information.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12v39M19 21h26M32 16l-13 5m13-5 13 5M19 21l-8 16m8-16 8 16m18-16-8 16m8-16 8 16M8 38c2 5 6 7 11 7s9-2 11-7m6 0c2 5 6 7 11 7s9-2 11-7M22 51h20m-10-3v3m-13 5h26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    color: "#82745e",
    numQuestions: 20,
    timeLimit: 780, // 13 minutes
    categories: ["Risk Assessment", "Logic", "Judgment"],
    scoringType: "percentage",
    allowNavigation: true,
    disclaimer: "Judgment scenarios give partial credit for defensible-but-not-best choices."
  },
  "processing-speed": {
    id: "processing-speed",
    title: "Processing Speed",
    description: "Rapid comparisons and quick arithmetic. Every answer is timed, and faster correct answers score higher.",
    icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M34 12 18 34h10l-4 18 18-24h-9l4-16Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    color: "#5f8074",
    numQuestions: 30,
    timeLimit: 300, // 5 minutes
    categories: ["Perceptual Speed", "Quick Decisions", "Rapid Processing"],
    scoringType: "percentage",
    speed: { targetSeconds: 5, weight: 0.4 },
    allowNavigation: false,
    disclaimer: "Correct answers earn 60% of an item's points for accuracy and up to 40% for speed. Device and input lag affect timing."
  }
};

// Get test by ID
function getTestById(testId) {
  return TESTS[testId];
}

// Get all tests as array
function getAllTests() {
  return Object.values(TESTS);
}
