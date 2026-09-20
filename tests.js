// Test definitions for the Intelligence Test Platform
const TESTS = {
  iq: {
    id: "iq",
    title: "Intelligence (IQ)",
    description: "Measure your general cognitive ability through logic, numerical reasoning, verbal comprehension, and spatial visualization.",
    icon: "🧠",
    color: "#4f46e5",
    numQuestions: 30,
    timeLimit: 1200, // 20 minutes
    categories: ["Logical", "Numerical", "Verbal", "Spatial"],
    scoringType: "iq",
    questionsKey: "QUESTION_BANK",
    disclaimer: "This is a self-assessment tool, not a clinical IQ test."
  },
  memory: {
    id: "memory",
    title: "Memory",
    description: "Assess your ability to recall and retain information including short-term memory, long-term memory, and working memory.",
    icon: "🧠💾",
    color: "#7c3aed",
    numQuestions: 20,
    timeLimit: 600, // 10 minutes
    categories: ["Short-term", "Long-term", "Working"],
    scoringType: "percentage",
    questionsKey: "MEMORY_QUESTIONS",
    disclaimer: "This test evaluates memory capacity and recall."
  },
  criticalThinking: {
    id: "critical-thinking",
    title: "Critical Thinking",
    description: "Evaluate your ability to analyze information, identify assumptions, and make logical conclusions.",
    icon: "🔍",
    color: "#db2777",
    numQuestions: 25,
    timeLimit: 900, // 15 minutes
    categories: ["Analysis", "Inference", "Evaluation"],
    scoringType: "percentage",
    questionsKey: "CRITICAL_THINKING_QUESTIONS",
    disclaimer: "Tests your analytical and reasoning capabilities."
  },
  learning: {
    id: "learning",
    title: "Learning Ability",
    description: "Measure how quickly you can acquire and apply new knowledge and skills.",
    icon: "📚",
    color: "#059669",
    numQuestions: 24,
    timeLimit: 720, // 12 minutes
    categories: ["Pattern Recognition", "Adaptation", "Application"],
    scoringType: "percentage",
    questionsKey: "LEARNING_QUESTIONS",
    disclaimer: "Assesses your capacity to learn new concepts."
  },
  creativity: {
    id: "creativity",
    title: "Creativity",
    description: "Explore your creative thinking through divergent thinking, originality, and innovative problem-solving.",
    icon: "🎨",
    color: "#d97706",
    numQuestions: 20,
    timeLimit: 900, // 15 minutes
    categories: ["Divergent Thinking", "Originality", "Flexibility"],
    scoringType: "percentage",
    questionsKey: "CREATIVITY_QUESTIONS",
    disclaimer: "Measures creative and lateral thinking abilities."
  },
  problemSolving: {
    id: "problem-solving",
    title: "Problem-Solving Ability",
    description: "Test your capacity to identify problems, generate solutions, and evaluate their effectiveness.",
    icon: "🧩",
    color: "#0891b2",
    numQuestions: 22,
    timeLimit: 840, // 14 minutes
    categories: ["Problem Identification", "Solution Generation", "Evaluation"],
    scoringType: "percentage",
    questionsKey: "PROBLEM_SOLVING_QUESTIONS",
    disclaimer: "Evaluates problem-solving skills and strategies."
  },
  attention: {
    id: "attention",
    title: "Attention and Focus",
    description: "Measure your ability to concentrate, sustain attention, and filter distractions.",
    icon: "👁️",
    color: "#f59e0b",
    numQuestions: 30,
    timeLimit: 600, // 10 minutes (faster paced)
    categories: ["Sustained Attention", "Selective Attention", "Divided Attention"],
    scoringType: "percentage",
    questionsKey: "ATTENTION_QUESTIONS",
    disclaimer: "Tests concentration and attentional capacity."
  },
  emotional: {
    id: "emotional",
    title: "Emotional Intelligence",
    description: "Assess your ability to recognize, understand, and manage emotions in yourself and others.",
    icon: "❤️",
    color: "#ec4899",
    numQuestions: 28,
    timeLimit: 840, // 14 minutes
    categories: ["Self-Awareness", "Empathy", "Relationship Management"],
    scoringType: "percentage",
    questionsKey: "EMOTIONAL_QUESTIONS",
    disclaimer: "Measures emotional awareness and intelligence."
  },
  decisionMaking: {
    id: "decision-making",
    title: "Decision-Making",
    description: "Evaluate your ability to make sound decisions under uncertainty and with incomplete information.",
    icon: "⚖️",
    color: "#6366f1",
    numQuestions: 23,
    timeLimit: 780, // 13 minutes
    categories: ["Risk Assessment", "Logic", "Judgment"],
    scoringType: "percentage",
    questionsKey: "DECISION_MAKING_QUESTIONS",
    disclaimer: "Assesses decision-making strategies and judgment."
  },
  processingSpeed: {
    id: "processing-speed",
    title: "Processing Speed",
    description: "Measure how quickly you can perceive, process, and respond to information.",
    icon: "⚡",
    color: "#14b8a6",
    numQuestions: 40,
    timeLimit: 480, // 8 minutes (fast paced with more questions)
    categories: ["Perceptual Speed", "Reaction Time", "Rapid Processing"],
    scoringType: "percentage",
    questionsKey: "PROCESSING_SPEED_QUESTIONS",
    disclaimer: "Tests speed of mental processing."
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
