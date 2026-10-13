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
    icon: "🧠",
    color: "#4f46e5",
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
    icon: "💾",
    color: "#7c3aed",
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
    icon: "🔍",
    color: "#db2777",
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
    icon: "📚",
    color: "#059669",
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
    icon: "🎨",
    color: "#d97706",
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
    icon: "🧩",
    color: "#0891b2",
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
    icon: "👁️",
    color: "#f59e0b",
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
    icon: "❤️",
    color: "#ec4899",
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
    icon: "⚖️",
    color: "#6366f1",
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
    icon: "⚡",
    color: "#14b8a6",
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
