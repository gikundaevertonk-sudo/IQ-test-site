// Question banks for every test on the platform.
//
// Question shapes (validated by `node scripts/check.js`):
//   Standard  { category, difficulty: 1-3, text, options: [...], answer: <option index>, visual?: "..." }
//   Scored    same, but `scores: [0..1 per option]` replaces `answer` (exactly one option scores 1).
//             Used for scenario questions where weaker-but-defensible options earn partial credit.
//   Study     add `study: { content: "...", seconds: n }` to show content alone for n seconds,
//             then hide it before the question and options appear (Memory test).
//
// `category` must match one of the test's `categories` in tests.js. Options are shuffled at run
// time, so the position of the correct option in these arrays does not matter.
//
// Banks are exposed through QUESTION_BANKS, keyed by test id.

// ============================================================
// IQ (Logical, Numerical, Verbal, Spatial)
// ============================================================
const IQ_QUESTIONS = [

  // ---------- NUMERICAL ----------
  { category: "Numerical", difficulty: 1,
    text: "What number comes next in the sequence? 2, 4, 6, 8, ?",
    options: ["9", "10", "12", "16"], answer: 1 },

  { category: "Numerical", difficulty: 1,
    text: "What number comes next? 1, 3, 5, 7, 9, ?",
    options: ["10", "11", "13", "12"], answer: 1 },

  { category: "Numerical", difficulty: 1,
    text: "What is 15% of 240?",
    options: ["32", "36", "40", "24"], answer: 1 },

  { category: "Numerical", difficulty: 2,
    text: "What number comes next? 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "30"], answer: 2 },

  { category: "Numerical", difficulty: 2,
    text: "Find the missing number: 5, 10, 20, 40, ?, 160",
    options: ["60", "70", "80", "100"], answer: 2 },

  { category: "Numerical", difficulty: 2,
    text: "What number comes next? 1, 4, 9, 16, 25, ?",
    options: ["30", "36", "35", "49"], answer: 1 },

  { category: "Numerical", difficulty: 2,
    text: "What number comes next? 1, 2, 4, 7, 11, ?",
    options: ["15", "16", "17", "18"], answer: 1 },

  { category: "Numerical", difficulty: 2,
    text: "A train travels 60 km in 45 minutes. At the same speed, how far does it travel in 2 hours?",
    options: ["120 km", "150 km", "160 km", "180 km"], answer: 2 },

  { category: "Numerical", difficulty: 2,
    text: "What number comes next? 2, 6, 18, 54, ?",
    options: ["108", "148", "162", "216"], answer: 2 },

  { category: "Numerical", difficulty: 3,
    text: "What number comes next? 2, 3, 5, 8, 13, ?",
    options: ["18", "20", "21", "24"], answer: 2 },

  { category: "Numerical", difficulty: 3,
    text: "Find the missing number: 7, 14, 28, 56, ?",
    options: ["84", "98", "112", "102"], answer: 2 },

  { category: "Numerical", difficulty: 3,
    text: "What number comes next? 100, 95, 85, 70, 50, ?",
    options: ["20", "25", "30", "35"], answer: 1 },

  { category: "Numerical", difficulty: 3,
    text: "What number comes next? 3, 5, 9, 17, 33, ?",
    options: ["49", "57", "65", "66"], answer: 2 },

  { category: "Numerical", difficulty: 3,
    text: "What number comes next? 2, 10, 4, 20, 8, 40, ?",
    options: ["16", "32", "60", "80"], answer: 0 },

  // ---------- LOGICAL ----------
  { category: "Logical", difficulty: 1,
    text: "All cats are animals. Some animals are pets. Which statement is certainly true?",
    options: [
      "All cats are pets",
      "Every cat is an animal",
      "No cats are pets",
      "All pets are cats"
    ], answer: 1 },

  { category: "Logical", difficulty: 1,
    text: "If today is Monday, what day will it be in 10 days?",
    options: ["Wednesday", "Thursday", "Friday", "Saturday"], answer: 1 },

  { category: "Logical", difficulty: 1,
    text: "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
    options: ["8", "9", "17", "0"], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "Sarah is taller than Mia. Mia is taller than Ken. Who is the shortest?",
    options: ["Sarah", "Mia", "Ken", "Cannot be determined"], answer: 2 },

  { category: "Logical", difficulty: 2,
    text: "A is the brother of B. B is the sister of C. What is A to C?",
    options: ["Sister", "Brother", "Cousin", "Cannot be determined"], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "If some Bloops are Razzies and all Razzies are Lazzies, which must be true?",
    options: [
      "All Bloops are Lazzies",
      "Some Bloops are Lazzies",
      "No Bloops are Lazzies",
      "All Lazzies are Bloops"
    ], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "All Zorks are Blips, and no Blips are Flems. Which must be true?",
    options: [
      "Some Zorks are Flems",
      "No Zorks are Flems",
      "All Flems are Zorks",
      "All Blips are Zorks"
    ], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "Anna finished before Ben. Cara finished after Ben. Dev finished before Anna. Who finished second?",
    options: ["Dev", "Anna", "Ben", "Cara"], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "Which statement is the logical opposite of \"All the lights are on\"?",
    options: [
      "No lights are on",
      "Some light is off",
      "All lights are off",
      "Most lights are on"
    ], answer: 1 },

  { category: "Logical", difficulty: 2,
    text: "If it rains, the match is cancelled. The match was not cancelled. What follows?",
    options: ["It rained", "It did not rain", "The match was moved", "Cannot be determined"], answer: 1 },

  { category: "Logical", difficulty: 3,
    text: "Five friends sit in a row. Alex sits left of Ben. Ben sits left of Cara. Cara sits left of Dan. Dan sits left of Eve. Who sits in the middle?",
    options: ["Alex", "Ben", "Cara", "Dan"], answer: 2 },

  { category: "Logical", difficulty: 3,
    text: "If it is true that \"No engineers dislike puzzles\" and \"Tom dislikes puzzles\", what must be true?",
    options: [
      "Tom is an engineer",
      "Tom is not an engineer",
      "All engineers like Tom",
      "Cannot be determined"
    ], answer: 1 },

  { category: "Logical", difficulty: 3,
    text: "Three boxes are labeled \"Apples\", \"Oranges\" and \"Mixed\", but every label is wrong. You take one fruit from the box labeled \"Mixed\" and it is an apple. What does that box contain?",
    options: ["Mixed fruit", "Only apples", "Only oranges", "Cannot be determined"], answer: 1 },

  // ---------- VERBAL ----------
  { category: "Verbal", difficulty: 1,
    text: "Hot is to Cold as Up is to ___",
    options: ["Down", "Sideways", "High", "Top"], answer: 0 },

  { category: "Verbal", difficulty: 1,
    text: "Book is to Read as Song is to ___",
    options: ["Sing", "Listen", "Write", "Play"], answer: 1 },

  { category: "Verbal", difficulty: 1,
    text: "Puppy is to Dog as Calf is to ___",
    options: ["Cow", "Horse", "Pig", "Sheep"], answer: 0 },

  { category: "Verbal", difficulty: 2,
    text: "Which word does not belong with the others?",
    options: ["Apple", "Banana", "Carrot", "Grape"], answer: 2 },

  { category: "Verbal", difficulty: 2,
    text: "Doctor is to Hospital as Teacher is to ___",
    options: ["Student", "Book", "School", "Lesson"], answer: 2 },

  { category: "Verbal", difficulty: 2,
    text: "Which word means the opposite of 'Abundant'?",
    options: ["Plentiful", "Scarce", "Massive", "Generous"], answer: 1 },

  { category: "Verbal", difficulty: 2,
    text: "Which word does not belong with the others?",
    options: ["Violin", "Cello", "Trumpet", "Harp"], answer: 2 },

  { category: "Verbal", difficulty: 2,
    text: "Choose the word that best completes the sentence: \"Despite her ___ appearance, she was actually very strong.\"",
    options: ["robust", "frail", "imposing", "sturdy"], answer: 1 },

  { category: "Verbal", difficulty: 3,
    text: "Which word is most nearly opposite to 'Meticulous'?",
    options: ["Careful", "Careless", "Curious", "Cautious"], answer: 1 },

  { category: "Verbal", difficulty: 3,
    text: "PENSIVE is to THOUGHTFUL as JUBILANT is to ___",
    options: ["Sad", "Joyful", "Angry", "Calm"], answer: 1 },

  { category: "Verbal", difficulty: 3,
    text: "Which word does not belong with the others?",
    options: ["Whisper", "Murmur", "Shout", "Mutter"], answer: 2 },

  { category: "Verbal", difficulty: 3,
    text: "Which word is closest in meaning to 'Ephemeral'?",
    options: ["Lasting", "Fleeting", "Ancient", "Fragile"], answer: 1 },

  // ---------- SPATIAL / PATTERN ----------
  { category: "Spatial", difficulty: 1,
    text: "Which shape comes next in the pattern?",
    visual: "🔵 🔴 🔵 🔴 🔵 ?",
    options: ["🔵", "🔴", "🟡", "🟢"], answer: 1 },

  { category: "Spatial", difficulty: 1,
    text: "Which shape comes next in the pattern?",
    visual: "⬛ ⬜ ⬛ ⬜ ⬛ ?",
    options: ["⬛", "⬜", "🔺", "🔵"], answer: 1 },

  { category: "Spatial", difficulty: 1,
    text: "A standard die has opposite faces that add up to 7. If 2 is on top, what is on the bottom?",
    options: ["3", "4", "5", "6"], answer: 2 },

  { category: "Spatial", difficulty: 2,
    text: "Which shape comes next in the pattern?",
    visual: "🔺 🔺 🔻 🔺 🔺 🔻 🔺 🔺 ?",
    options: ["🔺", "🔻", "🔵", "⬛"], answer: 1 },

  { category: "Spatial", difficulty: 2,
    text: "Which figure completes the sequence?",
    visual: "◻️ ◼️ ◻️◻️ ◼️◼️ ◻️◻️◻️ ◼️◼️◼️ ?",
    options: ["◻️◻️◻️◻️", "◼️◼️◼️◼️", "◻️", "◼️"], answer: 0 },

  { category: "Spatial", difficulty: 2,
    text: "Which shape does not belong with the others?",
    visual: "🔷 🔷 🔶 🔷 🔷",
    options: ["1st", "3rd", "4th", "5th"], answer: 1 },

  { category: "Spatial", difficulty: 2,
    text: "If you rotate the letter \"b\" by 180° in the plane of the page (turn it upside down), which letter do you get?",
    options: ["d", "p", "q", "b"], answer: 2 },

  { category: "Spatial", difficulty: 2,
    text: "How many faces does a triangular prism have?",
    options: ["4", "5", "6", "8"], answer: 1 },

  { category: "Spatial", difficulty: 2,
    text: "You are facing north. You turn right 90°, then turn left 180°. Which direction are you facing now?",
    options: ["North", "South", "East", "West"], answer: 3 },

  { category: "Spatial", difficulty: 3,
    text: "A cube is painted red on all sides, then cut into 27 equal smaller cubes. How many small cubes have exactly 2 red faces?",
    options: ["8", "12", "6", "24"], answer: 1 },

  { category: "Spatial", difficulty: 3,
    text: "Which shape comes next in the pattern?",
    visual: "🔺 🔵🔵 🔺🔺🔺 🔵🔵🔵🔵 🔺🔺🔺🔺🔺 ?",
    options: ["🔵×6", "🔺×6", "🔵×5", "🔺×5"], answer: 0 },

  { category: "Spatial", difficulty: 3,
    text: "A square sheet of paper is folded in half, then in half again (a smaller square with 4 layers). A hole is punched through the centre of the folded square. How many holes are in the sheet when it is unfolded?",
    options: ["1", "2", "4", "8"], answer: 2 },
];

// ============================================================
// MEMORY (Short-term, Working, Visual): each item is studied, hidden, then asked
// ============================================================
const MEMORY_QUESTIONS = [

  // ---------- SHORT-TERM ----------
  { category: "Short-term", difficulty: 1,
    study: { content: "CAT  ·  DOG  ·  BIRD", seconds: 4 },
    text: "Which word was NOT shown?",
    options: ["DOG", "CAT", "FISH", "BIRD"], answer: 2 },

  { category: "Short-term", difficulty: 1,
    study: { content: "7   3   9   1", seconds: 4 },
    text: "Which number was NOT in the list?",
    options: ["7", "5", "9", "1"], answer: 1 },

  { category: "Short-term", difficulty: 2,
    study: { content: "APPLE  ·  BANANA  ·  CHERRY  ·  DRAGONFRUIT", seconds: 5 },
    text: "What was the third item?",
    options: ["CHERRY", "BANANA", "DRAGONFRUIT", "APPLE"], answer: 0 },

  { category: "Short-term", difficulty: 2,
    study: { content: "SARAH  ·  JAMES  ·  MARIA  ·  DAVID", seconds: 5 },
    text: "Which name was second?",
    options: ["Sarah", "James", "Maria", "David"], answer: 1 },

  { category: "Short-term", difficulty: 2,
    study: { content: "4   8   2   9   5   6", seconds: 5 },
    text: "What was the fourth number?",
    options: ["2", "9", "5", "8"], answer: 1 },

  { category: "Short-term", difficulty: 2,
    study: { content: "K   T   R   M   Q   B", seconds: 4 },
    text: "Which letter was NOT in the list?",
    options: ["K", "R", "Q", "S"], answer: 3 },

  { category: "Short-term", difficulty: 3,
    study: { content: "ELEPHANT  ·  GIRAFFE  ·  LION  ·  ZEBRA  ·  MONKEY", seconds: 6 },
    text: "Which animal came directly after LION?",
    options: ["GIRAFFE", "ZEBRA", "MONKEY", "ELEPHANT"], answer: 1 },

  { category: "Short-term", difficulty: 3,
    study: { content: "3817     5294", seconds: 5 },
    text: "Which number was shown second?",
    options: ["3817", "5294", "5924", "3871"], answer: 1 },

  { category: "Short-term", difficulty: 3,
    study: { content: "PAPER · GLASS · METAL · WOOD · STONE · CLOTH", seconds: 6 },
    text: "Which material was fifth?",
    options: ["WOOD", "GLASS", "STONE", "CLOTH"], answer: 2 },

  // ---------- WORKING ----------
  { category: "Working", difficulty: 1,
    study: { content: "Start with 10\n− 3\n+ 2", seconds: 5 },
    text: "What is the result?",
    options: ["8", "9", "10", "11"], answer: 1 },

  { category: "Working", difficulty: 1,
    study: { content: "6   2   8", seconds: 4 },
    text: "Which option shows those digits sorted from smallest to largest?",
    options: ["2 6 8", "8 6 2", "2 8 6", "6 8 2"], answer: 0 },

  { category: "Working", difficulty: 1,
    study: { content: "Jane has:\n5 cats · 3 dogs · 2 birds", seconds: 5 },
    text: "How many pets does Jane have in total?",
    options: ["8", "9", "10", "11"], answer: 2 },

  { category: "Working", difficulty: 2,
    study: { content: "15  →  −7  →  ×2  →  +4", seconds: 6 },
    text: "Starting at 15 and applying each step in order, what is the result?",
    options: ["18", "20", "22", "32"], answer: 1 },

  { category: "Working", difficulty: 2,
    study: { content: "4   7   1   9", seconds: 4 },
    text: "Which option shows the digits in reverse order?",
    options: ["9 1 7 4", "9 7 1 4", "4 7 1 9", "1 9 4 7"], answer: 0 },

  { category: "Working", difficulty: 2,
    study: { content: "+10   −3   +5   −2   +8", seconds: 6 },
    text: "What is the net change?",
    options: ["+12", "+15", "+18", "+20"], answer: 2 },

  { category: "Working", difficulty: 2,
    study: { content: "3   8   5   2   9", seconds: 5 },
    text: "What is the sum of the first and last numbers?",
    options: ["11", "12", "13", "14"], answer: 1 },

  { category: "Working", difficulty: 3,
    study: { content: "100  →  ÷2  →  −10  →  ×3  →  +5", seconds: 7 },
    text: "Starting at 100 and applying each step in order, what is the result?",
    options: ["115", "120", "125", "145"], answer: 2 },

  { category: "Working", difficulty: 3,
    study: { content: "R   D   T   A   L", seconds: 5 },
    text: "Which option shows those letters in alphabetical order?",
    options: ["A D L R T", "A D R L T", "D A L R T", "A L D R T"], answer: 0 },

  // ---------- VISUAL ----------
  { category: "Visual", difficulty: 1,
    study: { content: "🔴  🔵  🟢  🟡", seconds: 4 },
    text: "What colour was the third circle?",
    options: ["Red", "Blue", "Green", "Yellow"], answer: 2 },

  { category: "Visual", difficulty: 1,
    study: { content: "🍎  🍌  🍇  🍎  🍊", seconds: 5 },
    text: "How many apples (🍎) were shown?",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Visual", difficulty: 1,
    study: { content: "▲  ●  ■  ●  ▲", seconds: 4 },
    text: "Which shape was in the middle?",
    options: ["Triangle", "Circle", "Square", "Diamond"], answer: 2 },

  { category: "Visual", difficulty: 2,
    study: { content: "⬜⬛⬜\n⬜⬜⬜\n⬜⬜⬛", seconds: 5 },
    text: "Which row had NO black squares?",
    options: ["Top", "Middle", "Bottom", "Every row had one"], answer: 1 },

  { category: "Visual", difficulty: 2,
    study: { content: "🐶  🐱  🐭\n🐹  🐰  🦊", seconds: 6 },
    text: "Which animal was directly below the cat (🐱)?",
    options: ["Mouse", "Hamster", "Rabbit", "Fox"], answer: 2 },

  { category: "Visual", difficulty: 2,
    study: { content: "🔺  🔺  🔵  🔺  🔵  🔵", seconds: 5 },
    text: "How many blue circles (🔵) were shown?",
    options: ["2", "3", "4", "5"], answer: 1 },

  { category: "Visual", difficulty: 3,
    study: { content: "⭐  🌙  ☀️  ⭐  🌙  ☀️  ☀️", seconds: 6 },
    text: "Which symbol appeared most often?",
    options: ["Star", "Moon", "Sun", "All appeared equally often"], answer: 2 },

  { category: "Visual", difficulty: 3,
    study: { content: "⬛⬜⬜⬛\n⬜⬛⬛⬜", seconds: 6 },
    text: "How many black squares were shown in total?",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Visual", difficulty: 3,
    study: { content: "🟥  🟦  🟥  🟩  🟦  🟥", seconds: 6 },
    text: "Which colour appeared exactly twice?",
    options: ["Red", "Blue", "Green", "None of them"], answer: 1 },
];

// ============================================================
// CRITICAL THINKING (Analysis, Inference, Evaluation)
// ============================================================
const CRITICAL_THINKING_QUESTIONS = [

  // ---------- ANALYSIS ----------
  { category: "Analysis", difficulty: 1,
    text: "All dogs bark. Max is a dog. What can we conclude?",
    options: ["Max barks", "Max is brown", "Max likes fetch", "All animals bark"], answer: 0 },

  { category: "Analysis", difficulty: 1,
    text: "Which of these is an opinion rather than a fact?",
    options: [
      "Water boils at 100 °C at sea level",
      "Coffee tastes better than tea",
      "The Earth orbits the Sun",
      "A triangle has three sides"
    ], answer: 1 },

  { category: "Analysis", difficulty: 1,
    text: "Which of these claims can be tested with evidence?",
    options: [
      "Green is the best colour",
      "This medicine lowers blood pressure in adults",
      "Winters were nicer long ago",
      "Cats are better company than dogs"
    ], answer: 1 },

  { category: "Analysis", difficulty: 2,
    text: "\"Popular products must be high quality.\" Which hidden assumption does this argument rely on?",
    options: [
      "Popularity is a reliable sign of quality",
      "Products can be evaluated",
      "Quality exists",
      "Popular products are expensive"
    ], answer: 0 },

  { category: "Analysis", difficulty: 2,
    text: "\"Either you support the plan completely, or you are against us.\" What is the flaw?",
    options: ["False dilemma", "Ad hominem", "Slippery slope", "Circular reasoning"], answer: 0 },

  { category: "Analysis", difficulty: 2,
    text: "What is the logical form of: \"If A then B. A is true. Therefore B.\"?",
    options: ["Modus ponens", "Modus tollens", "Affirming the consequent", "Induction"], answer: 0 },

  { category: "Analysis", difficulty: 2,
    text: "\"Every swan I have seen is white, so all swans are white.\" This reasoning is:",
    options: ["Deductive and certain", "Inductive and could be wrong", "Circular", "A definition"], answer: 1 },

  { category: "Analysis", difficulty: 3,
    text: "\"If it rained, the street is wet. The street is wet. Therefore it rained.\" What is wrong with this argument?",
    options: [
      "Nothing; it is valid",
      "The street could be wet for other reasons",
      "It should say \"it will rain\"",
      "The first premise is false"
    ], answer: 1 },

  { category: "Analysis", difficulty: 3,
    text: "\"People who eat breakfast get better grades, so breakfast raises grades.\" Which alternative explanation weakens this the most?",
    options: [
      "Students from more stable homes both eat breakfast and study more",
      "Breakfast foods are tasty",
      "Grades are numbers",
      "Some schools serve breakfast"
    ], answer: 0 },

  { category: "Analysis", difficulty: 3,
    text: "A survey says 80% of respondents prefer Product A. Which piece of information would change how far you trust that claim the most?",
    options: [
      "How many people were surveyed and how they were chosen",
      "The colour of the product",
      "The founder's name",
      "The day the survey was published"
    ], answer: 0 },

  // ---------- INFERENCE ----------
  { category: "Inference", difficulty: 1,
    text: "You see puddles and wet ground outside. Which inference is best supported?",
    options: [
      "It rained recently",
      "It will rain again tomorrow",
      "The weather is cold",
      "Wet ground is only ever caused by sprinklers"
    ], answer: 0 },

  { category: "Inference", difficulty: 1,
    text: "A shop is closed. The sign says \"Back in 30 minutes.\" What can you reasonably infer?",
    options: [
      "It will probably reopen within about half an hour",
      "It has closed permanently",
      "It reopens tomorrow",
      "It is a public holiday"
    ], answer: 0 },

  { category: "Inference", difficulty: 1,
    text: "The lights are off and the family car is gone from the driveway. What is the most likely inference?",
    options: ["Nobody is home", "The house is empty forever", "There was a burglary", "Everyone is asleep"], answer: 0 },

  { category: "Inference", difficulty: 2,
    text: "Everyone in the room is wearing a coat or a hat. Ana is not wearing a coat. What can we infer?",
    options: ["Ana is wearing a hat", "Ana is wearing nothing", "Ana is wearing both", "Nothing can be inferred"], answer: 0 },

  { category: "Inference", difficulty: 2,
    text: "Sales rose 20% after a new ad campaign launched. Which statement is best supported by this information alone?",
    options: [
      "Sales rose after the campaign began; the data alone doesn't show the campaign caused it",
      "The campaign caused the increase",
      "The campaign failed",
      "Competitors lost sales"
    ], answer: 0 },

  { category: "Inference", difficulty: 2,
    text: "A bag contains only red and blue balls. You draw 5 balls and all are red. Which inference is most reasonable?",
    options: [
      "The bag probably contains many red balls, but blue ones are still possible",
      "The bag contains no blue balls",
      "The next ball must be blue",
      "The bag holds exactly 5 balls"
    ], answer: 0 },

  { category: "Inference", difficulty: 2,
    text: "No reptiles have fur, and all snakes are reptiles. Which follows?",
    options: ["No snakes have fur", "Some snakes have fur", "All furry animals are snakes", "Snakes are mammals"], answer: 0 },

  { category: "Inference", difficulty: 2,
    text: "Maria is always on time. She is not at the meeting when it starts. What is the most reasonable inference?",
    options: [
      "Something unusual has delayed her",
      "She has quit",
      "She dislikes meetings",
      "The meeting is not important"
    ], answer: 0 },

  { category: "Inference", difficulty: 3,
    text: "Class A (50 students) averaged 78 on a test. Class B (5 students) averaged 82. What is the best inference?",
    options: [
      "Class B is definitely better",
      "Class B's average is less reliable because the group is small",
      "Class A has better teachers",
      "The tests must have been different"
    ], answer: 1 },

  { category: "Inference", difficulty: 3,
    text: "A town's traffic rose 20% last year. Which extra fact best supports \"population growth caused it\"?",
    options: [
      "The population rose about 20% and traffic per person stayed the same",
      "A new coffee shop opened",
      "The traffic lights were repainted",
      "The town has three schools"
    ], answer: 0 },

  // ---------- EVALUATION ----------
  { category: "Evaluation", difficulty: 1,
    text: "Which source is most reliable for a medical claim?",
    options: [
      "A peer-reviewed study",
      "An anonymous social media post",
      "A celebrity endorsement",
      "A friend's recommendation"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 1,
    text: "A headline says: \"Miracle pill cures everything!\" What should raise your suspicion most?",
    options: [
      "The extreme, unqualified claim",
      "The word \"pill\"",
      "The exclamation mark",
      "The length of the headline"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "\"5 out of 5 users recommend our product.\" What is the main weakness of this evidence?",
    options: [
      "A tiny sample, possibly hand-picked",
      "There are too many users",
      "The product is new",
      "There is no weakness"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "A claim relies on emotional language instead of evidence. What is the effect on the argument?",
    options: [
      "It adds no evidence, so the claim still needs support",
      "It makes the claim true",
      "It proves the claim false",
      "Emotion always strengthens a claim"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "Which claim needs more evidence?",
    options: [
      "All students in the school study daily",
      "Some students in the school study daily",
      "Both need the same",
      "Neither needs any"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "Ice cream sales and drownings both rise in summer. How strong is the claim \"ice cream causes drowning\"?",
    options: [
      "Weak: hot weather could explain both",
      "Strong: they rise together",
      "Proven by the data",
      "Ice cream must be unsafe"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "A physicist gives a strong opinion about a new medical treatment. How much weight should it carry?",
    options: [
      "Less than a medical expert's, since it is outside their field",
      "The same as a medical expert's",
      "None; experts are never right",
      "More, because physicists are clever"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 3,
    text: "\"90% of students passed the test, so the test was easy.\" What is the best evaluation?",
    options: [
      "Not necessarily: students may have been well prepared or grading may have been generous",
      "Correct: a high pass rate proves an easy test",
      "Incorrect: pass rates say nothing at all",
      "Correct, but only for maths tests"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 3,
    text: "Argument A: \"Most X are Y, so all X are Y.\" Argument B: \"Some X are Y, so some Y are X.\" Which is logically valid?",
    options: ["A", "B", "Both", "Neither"], answer: 1 },

  { category: "Evaluation", difficulty: 3,
    text: "A study of 12 people finds a diet works. A study of 5,000 people finds no effect. All else equal, which is more trustworthy?",
    options: ["The 5,000-person study", "The 12-person study", "Neither", "Whichever was published first"], answer: 0 },
];

// ============================================================
// LEARNING ABILITY (Pattern Recognition, Adaptation, Application)
// New rules are defined inside the question, so prior knowledge isn't needed.
// ============================================================
const LEARNING_QUESTIONS = [

  // ---------- PATTERN RECOGNITION ----------
  { category: "Pattern Recognition", difficulty: 1,
    text: "Red, Blue, Red, Blue, Red, ?",
    options: ["Red", "Blue", "Green", "Yellow"], answer: 1 },

  { category: "Pattern Recognition", difficulty: 1,
    text: "What comes next? A B C A B C A B ?",
    options: ["C", "A", "B", "D"], answer: 0 },

  { category: "Pattern Recognition", difficulty: 1,
    text: "What comes next? 3, 6, 9, 12, ?",
    options: ["14", "15", "16", "18"], answer: 1 },

  { category: "Pattern Recognition", difficulty: 2,
    text: "What comes next? Circle, Square, Triangle, Circle, Square, ?",
    options: ["Triangle", "Circle", "Square", "Pentagon"], answer: 0 },

  { category: "Pattern Recognition", difficulty: 2,
    text: "What comes next? X, Y, Z, A, B, C, D, ?",
    options: ["E", "X", "Y", "Z"], answer: 0 },

  { category: "Pattern Recognition", difficulty: 2,
    text: "What comes next? 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "12", "13", "14"], answer: 2 },

  { category: "Pattern Recognition", difficulty: 2,
    text: "What comes next? Z, X, V, T, ?",
    options: ["R", "S", "Q", "P"], answer: 0 },

  { category: "Pattern Recognition", difficulty: 3,
    text: "What comes next? 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"], answer: 1 },

  { category: "Pattern Recognition", difficulty: 3,
    text: "What comes next? AZ, BY, CX, DW, ?",
    options: ["EU", "EV", "FV", "EW"], answer: 1 },

  { category: "Pattern Recognition", difficulty: 3,
    text: "What comes next? 1, 2, 6, 24, 120, ?",
    options: ["240", "480", "600", "720"], answer: 3 },

  // ---------- ADAPTATION ----------
  { category: "Adaptation", difficulty: 1,
    text: "The rule \"multiply by 2\" is changed to \"multiply by 3\". What does the new rule give for 4?",
    options: ["8", "12", "16", "7"], answer: 1 },

  { category: "Adaptation", difficulty: 1,
    text: "New game rule: any number that is a multiple of 3 is replaced by \"Fizz\". What are 12, 14 and 15 replaced with?",
    options: ["Fizz, 14, Fizz", "12, Fizz, 15", "Fizz, Fizz, Fizz", "12, 14, 15"], answer: 0 },

  { category: "Adaptation", difficulty: 2,
    text: "Rule 1 adds 3 to a number. From now on, Rule 2 applies instead and subtracts 2. Start at 10, apply Rule 1 once, then Rule 2 twice. What is the result?",
    options: ["9", "11", "13", "15"], answer: 0 },

  { category: "Adaptation", difficulty: 2,
    text: "Red cards used to score 2 points and black cards 1 point. After the joker appears the values swap. Two red cards are drawn after the joker. How many points is that?",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Adaptation", difficulty: 2,
    text: "Code 1 writes each letter as the NEXT letter (CAT becomes DBU). Code 2 writes each letter as the PREVIOUS letter. Using Code 2, how is DOG written?",
    options: ["EPH", "CNF", "DOG", "GOD"], answer: 1 },

  { category: "Adaptation", difficulty: 2,
    text: "A recipe for 4 servings uses 200 g of rice. How much rice is needed for 10 servings?",
    options: ["400 g", "500 g", "600 g", "800 g"], answer: 1 },

  { category: "Adaptation", difficulty: 2,
    text: "Shop B sells pens at 3 for £4.50. How much do 6 pens cost there?",
    options: ["£6.00", "£9.00", "£13.50", "£27.00"], answer: 1 },

  { category: "Adaptation", difficulty: 3,
    text: "A counter normally goes up 1 on \"up\" and down 1 on \"down\". In reverse mode the meanings swap. Starting at 5 in reverse mode you press: up, up, down. What is the counter now?",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Adaptation", difficulty: 3,
    text: "The 09:15 bus used to arrive at 10:00. The timetable now has it leave 20 minutes earlier and take 10 minutes longer. When does it arrive?",
    options: ["09:50", "10:10", "10:30", "09:30"], answer: 0 },

  { category: "Adaptation", difficulty: 3,
    text: "A robot's rule was: move forward 2 steps, then turn right. It is updated to: move forward 2 steps, then turn LEFT. The robot starts at (0, 0) facing north (north = up the y-axis, east = right on the x-axis) and runs the updated rule twice. Where does it end up, and which way is it facing?",
    options: ["(2, 2) facing south", "(−2, 2) facing south", "(−2, −2) facing east", "(0, 4) facing west"], answer: 1 },

  // ---------- APPLICATION ----------
  { category: "Application", difficulty: 1,
    text: "A \"blicket\" is any object that is both round and red. Which of these is a blicket?",
    options: ["A red ball", "A blue ball", "A red box", "A green apple"], answer: 0 },

  { category: "Application", difficulty: 1,
    text: "New rule: take the first letter of each word. Apply it to \"Portable Network Graphics\".",
    options: ["PNG", "PGN", "NGP", "PNC"], answer: 0 },

  { category: "Application", difficulty: 1,
    text: "A palindrome reads the same forwards and backwards. Which of these is a palindrome?",
    options: ["LEVEL", "LEAVE", "LEVER", "LEAD"], answer: 0 },

  { category: "Application", difficulty: 1,
    text: "In a colour-mixing code, \"zib\" = red and \"zab\" = blue, and combining two codes mixes the colours. What does \"zib zab\" produce?",
    options: ["Purple", "Green", "Orange", "Brown"], answer: 0 },

  { category: "Application", difficulty: 2,
    text: "In a made-up language: \"mo\" = small, \"ta\" = dog, \"ku\" = big, \"ri\" = cat. Adjectives come AFTER the noun. How do you say \"big cat\"?",
    options: ["ku ri", "ri ku", "ta ku", "mo ri"], answer: 1 },

  { category: "Application", difficulty: 2,
    text: "A plant doubles in height every week. It is 3 cm tall today. How tall will it be in 3 weeks?",
    options: ["9 cm", "12 cm", "18 cm", "24 cm"], answer: 3 },

  { category: "Application", difficulty: 2,
    text: "A shop charges no tax on items under £20, and 10% tax on the price of items of £20 or more. What is the total for a £50 item and a £15 item?",
    options: ["£65", "£70", "£71.50", "£72.50"], answer: 1 },

  { category: "Application", difficulty: 2,
    text: "A \"double-step\" means: multiply by 2, then subtract 3. Apply a double-step twice to the number 5.",
    options: ["7", "11", "17", "4"], answer: 1 },

  { category: "Application", difficulty: 2,
    text: "\"Zeta days\" fall every 4th day counting from day 2 (days 2, 6, 10, and so on). Which of these is a Zeta day?",
    options: ["14", "15", "16", "17"], answer: 0 },

  { category: "Application", difficulty: 3,
    text: "The effort needed on a lever = load × (load arm ÷ effort arm). A 60 kg load sits 1 m from the pivot and you push 3 m from the pivot. What effort (in kg-force) is needed?",
    options: ["10", "20", "30", "180"], answer: 1 },
];

// ============================================================
// CREATIVITY (Divergent Thinking, Originality, Flexibility)
// Flexibility is mostly Remote Associates puzzles (one correct word). Divergent Thinking and
// Originality use `scores`: cliché options earn little, more original workable ideas earn more.
// ============================================================
const CREATIVITY_QUESTIONS = [

  // ---------- DIVERGENT THINKING (scored) ----------
  { category: "Divergent Thinking", difficulty: 1,
    text: "Which is the most inventive alternative use for a brick?",
    options: [
      "Build a wall",
      "Doorstop",
      "Heat it in an oven, wrap it, and use it as a bed warmer",
      "Paperweight"
    ], scores: [0, 0.25, 1, 0.25] },

  { category: "Divergent Thinking", difficulty: 1,
    text: "Which is the most inventive use for a paper clip?",
    options: [
      "Hold papers together",
      "Poke open a phone's SIM tray",
      "Use as a bookmark",
      "Bend it into a phone stand or a hook for hanging ornaments"
    ], scores: [0, 0.5, 0.25, 1] },

  { category: "Divergent Thinking", difficulty: 2,
    text: "You have no bucket but must carry water a short distance. Which idea is the most inventive?",
    options: [
      "Ask a neighbour to lend a bucket",
      "Use a clean plastic bottle",
      "Knot a waterproof poncho into a pouch",
      "Freeze the water into blocks beforehand and carry the ice"
    ], scores: [0, 0.25, 0.6, 1] },

  { category: "Divergent Thinking", difficulty: 2,
    text: "Which is the most inventive use for an old umbrella?",
    options: [
      "Keep off the rain",
      "Shade from the sun",
      "Strip the fabric and use the frame as a plant support",
      "Turn it upside down as a light reflector for photography"
    ], scores: [0, 0.25, 0.6, 1] },

  { category: "Divergent Thinking", difficulty: 2,
    text: "Which is the most inventive use for a single sock?",
    options: [
      "Wear it",
      "Dust rag",
      "Hand puppet",
      "Fill it with rice and warm it in the microwave as a hand warmer"
    ], scores: [0, 0.25, 0.5, 1] },

  { category: "Divergent Thinking", difficulty: 2,
    text: "Which is the most inventive use for a ladder that isn't for climbing?",
    options: [
      "Lean it on a wall as storage",
      "Lay it flat as a drying rack for laundry or herbs",
      "Prop it as a garden trellis for climbing plants",
      "Hang it from the ceiling as a pot rack"
    ], scores: [0.25, 0.5, 0.5, 1] },

  { category: "Divergent Thinking", difficulty: 3,
    text: "A café wants people to stay less time at busy periods without seeming rude. Which idea is the most inventive?",
    options: [
      "Put up a \"30 minute limit\" sign",
      "Ask customers to leave",
      "Play faster music",
      "Give a small discount to anyone who leaves their seat within 30 minutes"
    ], scores: [0.25, 0, 0.5, 1] },

  { category: "Divergent Thinking", difficulty: 3,
    text: "Which is the most inventive use for old newspapers?",
    options: [
      "Wrap fragile items",
      "Recycle them",
      "Roll and glue them into sturdy tubes to build furniture",
      "Light a fire"
    ], scores: [0.25, 0, 1, 0.25] },

  // ---------- ORIGINALITY (scored) ----------
  { category: "Originality", difficulty: 1,
    text: "Complete the metaphor: \"Time is ___\". Which is the most original?",
    options: [
      "money",
      "a river",
      "a stubborn guest who never checks the clock",
      "precious"
    ], scores: [0, 0.25, 1, 0] },

  { category: "Originality", difficulty: 1,
    text: "Complete the metaphor: \"A good idea is ___\". Which is the most original?",
    options: [
      "a light bulb",
      "a seed",
      "a key cut for a lock nobody has found yet",
      "brilliant"
    ], scores: [0, 0.25, 1, 0] },

  { category: "Originality", difficulty: 2,
    text: "Which new product idea for a toothbrush is the most original?",
    options: [
      "A toothbrush in more colours",
      "A toothbrush with a timer",
      "A toothbrush whose bristles change colour to show missed spots",
      "A longer toothbrush"
    ], scores: [0, 0.4, 1, 0.1] },

  { category: "Originality", difficulty: 2,
    text: "Which story premise is the most original?",
    options: [
      "A young hero defeats an evil king",
      "A lighthouse keeper receives letters from ships that sank long ago",
      "Two people from rival families fall in love",
      "A detective solves a murder at a mansion"
    ], scores: [0, 1, 0.1, 0.1] },

  { category: "Originality", difficulty: 2,
    text: "Which is the most original way to describe a city at night?",
    options: [
      "Full of lights",
      "A circuit board humming with tiny electric decisions",
      "Very busy",
      "Beautiful"
    ], scores: [0.1, 1, 0, 0] },

  { category: "Originality", difficulty: 3,
    text: "\"What if gravity reversed for one hour a day?\" Which response is the most original?",
    options: [
      "People would float away",
      "Everything would fall upwards",
      "Cities would build ceiling gardens and schedule commutes around \"upward hour\"",
      "It would be scary"
    ], scores: [0.1, 0.1, 1, 0] },

  { category: "Originality", difficulty: 3,
    text: "Which is the most original design for a park bench?",
    options: [
      "A wooden bench",
      "A bench with a built-in phone charger",
      "A bench that plays a short melody when two strangers sit on it together",
      "A bench with a backrest"
    ], scores: [0, 0.4, 1, 0] },

  { category: "Originality", difficulty: 3,
    text: "A tree without leaves in winter could symbolize... Which is the most original?",
    options: [
      "Winter",
      "Death",
      "A pause between sentences, not the end of the story",
      "Sadness"
    ], scores: [0, 0.1, 1, 0.1] },

  // ---------- FLEXIBILITY (Remote Associates: find the word linking all three) ----------
  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: cottage, swiss, cake",
    options: ["cheese", "house", "butter", "bread"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: cream, skate, water",
    options: ["ice", "cold", "snow", "glass"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: loser, throat, spot",
    options: ["sore", "sick", "bad", "hot"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: show, life, row",
    options: ["boat", "ship", "ride", "play"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: night, wrist, stop",
    options: ["watch", "clock", "time", "alarm"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "Find the one word that links all three: rocking, wheel, high",
    options: ["chair", "seat", "horse", "table"], answer: 0 },

  { category: "Flexibility", difficulty: 3,
    text: "Find the one word that links all three: dew, comb, bee",
    options: ["honey", "sugar", "wax", "sweet"], answer: 0 },

  { category: "Flexibility", difficulty: 3,
    text: "Find the one word that links all three: fountain, baking, pop",
    options: ["soda", "water", "juice", "cola"], answer: 0 },

  { category: "Flexibility", difficulty: 2,
    text: "You need to hammer a nail but have no hammer. Which option shows the most flexible thinking?",
    options: [
      "Give up and buy a hammer tomorrow",
      "Ask which everyday objects are hard and heavy enough, such as the heel of a shoe or the flat of a wrench",
      "Push the nail in with your thumb",
      "Wait for someone to lend you one"
    ], scores: [0, 1, 0, 0.25] },

  { category: "Flexibility", difficulty: 3,
    text: "A meeting room is double-booked. Which response best shows flexible thinking?",
    options: [
      "Argue that your booking came first",
      "Cancel your meeting",
      "Look for a different space, split the session, or move part of it online",
      "Hold the meeting in the corridor anyway"
    ], scores: [0, 0.1, 1, 0.1] },
];

// ============================================================
// PROBLEM-SOLVING (Problem Identification, Solution Generation, Evaluation)
// ============================================================
const PROBLEM_SOLVING_QUESTIONS = [

  // ---------- PROBLEM IDENTIFICATION ----------
  { category: "Problem Identification", difficulty: 1,
    text: "A project is late. Three tasks finish on time, but one task always waits two days for sign-off. What is the most likely bottleneck?",
    options: ["The sign-off step", "The three finished tasks", "The team size", "The deadline itself"], answer: 0 },

  { category: "Problem Identification", difficulty: 1,
    text: "A phone battery drains in 3 hours, but only when one particular app is open. What is the most likely cause?",
    options: ["That app", "The charger", "The screen size", "The phone case"], answer: 0 },

  { category: "Problem Identification", difficulty: 2,
    text: "A website is slow only between 6 pm and 8 pm each day. What is the most useful first question?",
    options: [
      "What changes at that time, such as traffic or scheduled jobs?",
      "Is the logo too large?",
      "Who designed the site?",
      "Is the server brand new?"
    ], answer: 0 },

  { category: "Problem Identification", difficulty: 2,
    text: "A plant's leaves turn yellow. It is watered daily, and its pot has no drainage holes. What is the most likely problem?",
    options: ["Overwatering with poor drainage", "Too much sunlight", "Too little water", "The colour of the pot"], answer: 0 },

  { category: "Problem Identification", difficulty: 2,
    text: "A printer prints blank pages even though the paper is loaded and the ink tanks are full. What is the most sensible next check?",
    options: [
      "Whether the print nozzles are clogged",
      "Whether the desk is level",
      "Reinstalling the operating system",
      "Buying a new printer"
    ], answer: 0 },

  { category: "Problem Identification", difficulty: 2,
    text: "Sales fell 15% in one region while all others were flat. A competitor opened there last month and your prices have not changed. What should you investigate first?",
    options: [
      "How the competitor's offer compares in that region",
      "Your brand colours",
      "Sales in the unaffected regions",
      "Staff holiday policy"
    ], answer: 0 },

  { category: "Problem Identification", difficulty: 3,
    text: "Customers complain about late deliveries. The warehouse ships same-day and couriers deliver in 2 days as promised, but orders after 5 pm ship the next day while the website says \"ships same day\" for every order. What is the core problem?",
    options: [
      "The website promises same-day shipping for after-hours orders",
      "Couriers are too slow",
      "The warehouse is too small",
      "Customers are impatient"
    ], answer: 0 },

  { category: "Problem Identification", difficulty: 3,
    text: "A cake recipe that works at home fails at a friend's house high in the mountains. Which changed variable is the most likely culprit?",
    options: [
      "Lower air pressure affecting rising and boiling",
      "The wording of the recipe",
      "The time of day",
      "The friend's oven colour"
    ], answer: 0 },

  { category: "Problem Identification", difficulty: 3,
    text: "Server errors began right after Tuesday's update. Two other changes went out on Monday: a new logo and a database patch. What is the best first step?",
    options: [
      "Test or roll back the Tuesday update in isolation",
      "Blame the logo",
      "Restart everything repeatedly",
      "Ignore it until it worsens"
    ], answer: 0 },

  // ---------- SOLUTION GENERATION ----------
  { category: "Solution Generation", difficulty: 1,
    text: "A bridge holds at most 100 kg. You weigh 70 kg and need to move two 20 kg boxes across. Which plan works?",
    options: [
      "Carry one box per trip",
      "Carry both boxes at once",
      "Run across quickly with both",
      "Add a third box for balance"
    ], answer: 0 },

  { category: "Solution Generation", difficulty: 1,
    text: "Two people who don't trust each other must share a cake. Which method guarantees each thinks they got a fair share?",
    options: [
      "One cuts, the other chooses first",
      "The older person eats first",
      "Toss a coin for the whole cake",
      "The cutter picks first"
    ], answer: 0 },

  { category: "Solution Generation", difficulty: 1,
    text: "A sofa is a few centimetres too wide for the door. Which idea is the best first attempt?",
    options: [
      "Remove the door from its hinges or take the sofa's legs off",
      "Cut the sofa in half",
      "Knock down the wall",
      "Leave it outside"
    ], answer: 0 },

  { category: "Solution Generation", difficulty: 2,
    text: "You have a 3-litre jug and a 5-litre jug. You fill the 5-litre jug, then pour into the 3-litre jug until it is full. How much water is left in the 5-litre jug?",
    options: ["1 litre", "2 litres", "3 litres", "4 litres"], answer: 1 },

  { category: "Solution Generation", difficulty: 2,
    text: "A car park has 12 spaces. Which is the simplest system that stops more than 12 cars being inside at once?",
    options: [
      "A counter at the entrance that goes up on entry, down on exit, and blocks the gate at 12",
      "Hire 12 guards",
      "Paint the spaces a different colour",
      "Ask drivers to count the cars themselves"
    ], answer: 0 },

  { category: "Solution Generation", difficulty: 2,
    text: "Five people each make 4 items per hour. How many hours do they need to make 100 items together?",
    options: ["4", "5", "6", "25"], answer: 1 },

  { category: "Solution Generation", difficulty: 3,
    text: "Three switches outside a closed room control three bulbs inside. You may enter the room only once. Which plan lets you match every switch to its bulb?",
    options: [
      "Leave switch 1 on for a while, then turn it off, turn switch 2 on, and enter: lit = switch 2, warm but off = switch 1, cold and off = switch 3",
      "Flip all three on and guess",
      "Flip all three on, then off, then enter",
      "Ask someone else which is which"
    ], answer: 0 },

  { category: "Solution Generation", difficulty: 3,
    text: "You have 8 identical-looking coins and one is slightly heavier. What is the fewest weighings on a balance scale that always finds it?",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Solution Generation", difficulty: 3,
    text: "You must ferry a wolf, a goat and a cabbage across a river in a boat that carries you and one item. The wolf eats the goat and the goat eats the cabbage if left alone together. What must you take first?",
    options: ["The goat", "The wolf", "The cabbage", "Nothing"], answer: 0 },

  // ---------- EVALUATION ----------
  { category: "Evaluation", difficulty: 1,
    text: "A plan has three steps, but Step 2 needs the result of Step 3 and Step 3 needs the result of Step 2. What is wrong with the plan?",
    options: ["The steps depend on each other in a circle", "It has too many steps", "It has too few steps", "Nothing is wrong"], answer: 0 },

  { category: "Evaluation", difficulty: 1,
    text: "You compute that a job needs 3.5 people. What is the most sensible check?",
    options: [
      "Check whether the answer makes sense in context, since people can't be split",
      "Report 3.5 as the final answer",
      "Round down without thinking",
      "Ignore the result"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 1,
    text: "Which is the best way to check that 47 × 12 = 564?",
    options: [
      "Recompute another way: 47 × 10 + 47 × 2 = 470 + 94",
      "Trust it because it looks right",
      "Round everything to 100",
      "Ask three friends to guess"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "A fix makes an error message disappear, but the underlying data is still wrong. What is the best assessment?",
    options: [
      "It hides the symptom; the root cause remains",
      "The problem is solved",
      "Delete the data",
      "Ignore the data"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "Which is the best way to test whether a new study method works?",
    options: [
      "Compare test scores of a group using it with a similar group that isn't",
      "Ask one friend whether it felt good",
      "Use a more colourful textbook",
      "Try it once and decide"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 2,
    text: "Option A costs £200 and saves £50 a month. Option B costs £300 and saves £90 a month. After 12 months, which has the better net result?",
    options: ["Option A", "Option B", "They are equal", "Cannot be told"], answer: 1 },

  { category: "Evaluation", difficulty: 3,
    text: "Solution A takes 10 minutes and works 90% of the time. Solution B takes 30 minutes and works 99% of the time. A failure costs 120 extra minutes to redo. Which has the lower expected time?",
    options: ["Solution A", "Solution B", "They are equal", "Cannot be told"], answer: 0 },

  { category: "Evaluation", difficulty: 3,
    text: "A supermarket wants shorter queues. 60% of shoppers buy 5 items or fewer. Which solution is best supported by that data?",
    options: [
      "Add self-service kiosks aimed at small baskets",
      "Add nothing",
      "Repaint the checkout area",
      "Sell fewer items"
    ], answer: 0 },

  { category: "Evaluation", difficulty: 3,
    text: "After a fix, complaints fell 30% in the first week, but that week included a public holiday. What is the best conclusion?",
    options: [
      "Inconclusive: the holiday may explain the drop, so keep monitoring",
      "The fix is proven",
      "The fix failed",
      "Holidays cause complaints"
    ], answer: 0 },
];

// ============================================================
// ATTENTION AND FOCUS (Sustained, Selective, Divided); timed
// Stimuli are placed in `visual`. Counts here were checked by script.
// ============================================================
const ATTENTION_QUESTIONS = [

  // ---------- SUSTAINED ATTENTION ----------
  { category: "Sustained Attention", difficulty: 1,
    text: "How many times does the letter E (upper or lower case) appear?",
    visual: "The three trees had three free beetles.",
    options: ["10", "11", "12", "13"], answer: 2 },

  { category: "Sustained Attention", difficulty: 1,
    text: "How many stars (⭐) are there?",
    visual: "⭐ 🌙 ⭐ ⭐ 🌙 ⭐",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Sustained Attention", difficulty: 1,
    text: "How many times does the letter T (upper or lower case) appear?",
    visual: "Test the tent with the tent.",
    options: ["7", "8", "9", "10"], answer: 2 },

  { category: "Sustained Attention", difficulty: 2,
    text: "Which letter appears most often?",
    visual: "A B A C A D A E A",
    options: ["A", "B", "C", "D"], answer: 0 },

  { category: "Sustained Attention", difficulty: 2,
    text: "Which word is misspelled?",
    visual: "The cat and the dog are freinds.",
    options: ["cat", "dog", "freinds", "are"], answer: 2 },

  { category: "Sustained Attention", difficulty: 2,
    text: "How many vowels (a, e, i, o, u) are there in total?",
    visual: "Beautiful education",
    options: ["8", "9", "10", "11"], answer: 2 },

  { category: "Sustained Attention", difficulty: 2,
    text: "How many pairs of identical letters sit side by side?",
    visual: "aabbccddee",
    options: ["4", "5", "10", "0"], answer: 1 },

  { category: "Sustained Attention", difficulty: 2,
    text: "How many numbers are greater than 5?",
    visual: "2 7 4 9 5 6 1 8",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Sustained Attention", difficulty: 3,
    text: "How many letters are immediately followed by the same letter?",
    visual: "MISSISSIPPI",
    options: ["2", "3", "4", "5"], answer: 1 },

  { category: "Sustained Attention", difficulty: 3,
    text: "How many times does the digit 8 appear?",
    visual: "3 8 2 9 8 3 8 1 8 4",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Sustained Attention", difficulty: 3,
    text: "How many words start with the letter B (upper or lower case)?",
    visual: "big red bat blue sun bus rug ban",
    options: ["4", "5", "6", "7"], answer: 1 },

  // ---------- SELECTIVE ATTENTION ----------
  { category: "Selective Attention", difficulty: 1,
    text: "At which position is the word BLUE?",
    visual: "RED BLUE GREEN YELLOW",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Selective Attention", difficulty: 1,
    text: "Ignoring the letters, which numbers appear, in order?",
    visual: "A 1 B 2 C 3 D",
    options: ["1, 2, 3", "A, B, C", "A, 1, B", "1, 3, D"], answer: 0 },

  { category: "Selective Attention", difficulty: 1,
    text: "How many times does the word RED appear (ignore the other words)?",
    visual: "yellow RED blue RED green",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Selective Attention", difficulty: 1,
    text: "Ignoring the symbols, how many letters are there?",
    visual: "@ABC#DEF$GHI",
    options: ["6", "8", "9", "12"], answer: 2 },

  { category: "Selective Attention", difficulty: 2,
    text: "Which position holds the different symbol?",
    visual: "○ ○ ● ○ ○",
    options: ["1", "2", "3", "4"], answer: 2 },

  { category: "Selective Attention", difficulty: 2,
    text: "How many times does the letter X appear?",
    visual: "OOXOOOOXOOO",
    options: ["1", "2", "3", "4"], answer: 1 },

  { category: "Selective Attention", difficulty: 2,
    text: "Ignoring capitalisation, how many times is the exact word \"hello\" written?",
    visual: "Hello HELLO hello HeLoO",
    options: ["2", "3", "4", "5"], answer: 1 },

  { category: "Selective Attention", difficulty: 2,
    text: "Which of the four strings is different from the others?",
    visual: "ABCD  ABCD  ABDC  ABCD",
    options: ["1st", "2nd", "3rd", "4th"], answer: 2 },

  { category: "Selective Attention", difficulty: 3,
    text: "How many times does the pair \"AB\" appear (reading left to right)?",
    visual: "ABXABXAB",
    options: ["2", "3", "4", "5"], answer: 1 },

  { category: "Selective Attention", difficulty: 3,
    text: "How many of these words are animals?",
    visual: "table cat river horse cloud dog lamp",
    options: ["2", "3", "4", "5"], answer: 1 },

  { category: "Selective Attention", difficulty: 3,
    text: "Ignoring the numbers, what word do the letters spell?",
    visual: "4 C 7 A 2 T 9",
    options: ["CAT", "ACT", "TAC", "CAR"], answer: 0 },

  // ---------- DIVIDED ATTENTION ----------
  { category: "Divided Attention", difficulty: 1,
    text: "Who is the medium one?",
    visual: "John is tall, Mary is short, Tom is medium.",
    options: ["John", "Mary", "Tom", "Nobody"], answer: 2 },

  { category: "Divided Attention", difficulty: 1,
    text: "Count the red circles and the blue squares.",
    visual: "🔴 🟦 🔴 🟦 🟦",
    options: ["2 red, 3 blue", "3 red, 2 blue", "2 red, 2 blue", "3 red, 3 blue"], answer: 0 },

  { category: "Divided Attention", difficulty: 2,
    text: "Start at 100, then apply +10, −5, +3 in order. What do you get?",
    options: ["105", "107", "108", "110"], answer: 2 },

  { category: "Divided Attention", difficulty: 2,
    text: "How many items are there in total?",
    visual: "1 apple, 2 birds, 3 cats",
    options: ["3", "6", "9", "12"], answer: 1 },

  { category: "Divided Attention", difficulty: 2,
    text: "Which colour is third, and how many colours are listed?",
    visual: "red, blue, green, pink, grey",
    options: ["green, 5", "blue, 5", "green, 4", "pink, 5"], answer: 0 },

  { category: "Divided Attention", difficulty: 2,
    text: "How many vowels and how many consonants are in this word?",
    visual: "FOCUS",
    options: ["2 vowels, 3 consonants", "3 vowels, 2 consonants", "1 vowel, 4 consonants", "2 vowels, 2 consonants"], answer: 0 },

  { category: "Divided Attention", difficulty: 3,
    text: "Ignoring the colour words, what is the sum of the results of all the sums?",
    visual: "5+3, yellow, 2×4, green, 1+1",
    options: ["16", "17", "18", "20"], answer: 2 },

  { category: "Divided Attention", difficulty: 3,
    text: "Add only the odd numbers.",
    visual: "3 8 5 2 7 4",
    options: ["13", "15", "17", "20"], answer: 1 },

  { category: "Divided Attention", difficulty: 3,
    text: "Start at 50. Subtract 3 for each ▲ and add 5 for each ●. What do you finish with?",
    visual: "▲ ● ● ▲ ●",
    options: ["57", "59", "61", "63"], answer: 1 },

  { category: "Divided Attention", difficulty: 3,
    text: "Add the largest number of list A to the largest number of list B.",
    visual: "A: 2, 4, 6     B: 1, 3, 5",
    options: ["9", "10", "11", "12"], answer: 2 },
];

// ============================================================
// EMOTIONAL INTELLIGENCE (Self-Awareness, Empathy, Relationship Management)
// Scenario items scored by `scores`: 1 = best response, partial credit for defensible ones.
// ============================================================
const EMOTIONAL_QUESTIONS = [

  // ---------- SELF-AWARENESS ----------
  { category: "Self-Awareness", difficulty: 1,
    text: "You snap at a colleague during a stressful day and then notice what you did. What is the best next step?",
    options: [
      "Apologise briefly, own the stress behind it, and note what triggered it",
      "Say nothing and hope they forget",
      "Explain that it was really their fault",
      "Apologise by email only if they bring it up"
    ], scores: [1, 0, 0, 0.5] },

  { category: "Self-Awareness", difficulty: 2,
    text: "Your manager says your reports are often late, and you feel defensive. What is the best response?",
    options: [
      "Notice the defensiveness, ask for specifics, and consider what is true in it",
      "Point out that others are late too",
      "Agree quickly to end the conversation",
      "Say nothing and stew about it afterwards"
    ], scores: [1, 0, 0.25, 0] },

  { category: "Self-Awareness", difficulty: 2,
    text: "You keep putting off an important task. Which explanation shows the most self-awareness?",
    options: [
      "Ask what feeling the task triggers, such as fear of getting it wrong, and address that",
      "\"I'm just lazy.\"",
      "\"The task is pointless.\"",
      "\"Everyone procrastinates.\""
    ], scores: [1, 0.25, 0, 0] },

  { category: "Self-Awareness", difficulty: 1,
    text: "Your heart races before a presentation. What is the most useful way to read that?",
    options: [
      "It's nervous energy; slow your breathing and treat it as readiness",
      "It means the presentation will go badly",
      "It means you should cancel",
      "Ignore it and hope it passes"
    ], scores: [1, 0, 0, 0.5] },

  { category: "Self-Awareness", difficulty: 3,
    text: "After a great result you feel guilty rather than proud. What is the most self-aware response?",
    options: [
      "Notice the mismatch and ask what belief is behind the guilt",
      "Feel bad about feeling bad",
      "Dismiss the result as luck",
      "Talk about it endlessly with everyone"
    ], scores: [1, 0.25, 0, 0.1] },

  { category: "Self-Awareness", difficulty: 2,
    text: "You notice that you agree with everything in meetings to avoid conflict. What is the best step?",
    options: [
      "Notice when it happens and practise voicing one honest view per meeting",
      "Keep agreeing",
      "Stop attending meetings",
      "Disagree with everything to compensate"
    ], scores: [1, 0, 0, 0.25] },

  { category: "Self-Awareness", difficulty: 1,
    text: "You are tired and irritable, with an important conversation scheduled. What is the best approach?",
    options: [
      "Acknowledge your state, postpone if possible, and rest first",
      "Push through and handle everything as normal",
      "Vent to the first person you meet",
      "Deny that you are irritable"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Self-Awareness", difficulty: 2,
    text: "A friend says you interrupt a lot. What is the best response?",
    options: [
      "Thank them, watch for it, and ask them to point it out",
      "Deny it",
      "Say they interrupt too",
      "Apologise repeatedly but change nothing"
    ], scores: [1, 0, 0, 0.25] },

  { category: "Self-Awareness", difficulty: 3,
    text: "Which is the most accurate way to assess your own skill at something?",
    options: [
      "Look at recent concrete results and ask for others' feedback",
      "Go by how confident you feel today",
      "Assume you are above average",
      "Assume you are bad at everything"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Self-Awareness", difficulty: 3,
    text: "You feel a sharp pang of envy when a colleague is promoted. What is the most emotionally intelligent response?",
    options: [
      "Acknowledge the envy, ask what it says about your own goals, and plan for them",
      "Quietly undermine them",
      "Pretend you feel nothing",
      "Quit your job"
    ], scores: [1, 0, 0.25, 0] },

  // ---------- EMPATHY ----------
  { category: "Empathy", difficulty: 1,
    text: "A friend tells you their pet has died. What is the best response?",
    options: [
      "Say you are sorry and listen without rushing to fix anything",
      "Say it was only an animal",
      "Change the subject to cheer them up",
      "Tell them to get a new pet soon"
    ], scores: [1, 0, 0.1, 0.25] },

  { category: "Empathy", difficulty: 1,
    text: "A colleague is unusually quiet and short-tempered today. What is the best response?",
    options: [
      "Check in privately and ask whether they are okay",
      "Ignore it",
      "Mention it to the rest of the team",
      "Give them tough feedback on their attitude"
    ], scores: [1, 0.1, 0, 0] },

  { category: "Empathy", difficulty: 1,
    text: "A new team member looks lost on their first day. What do you do?",
    options: [
      "Introduce yourself and offer to help",
      "Wait for them to ask",
      "Assume they will work it out",
      "Point out what they are doing wrong"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Empathy", difficulty: 2,
    text: "A teammate is thrilled about a small win. What is the best response?",
    options: [
      "Share their excitement and ask about it",
      "Mention a bigger win of your own",
      "Say it isn't a big deal",
      "Nod and walk away"
    ], scores: [1, 0, 0, 0.25] },

  { category: "Empathy", difficulty: 2,
    text: "A friend rants about their boss and has not asked for advice. What is the best first move?",
    options: [
      "Listen and reflect back how they feel",
      "List five solutions",
      "Defend the boss",
      "Tell them it is not that bad"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Empathy", difficulty: 2,
    text: "Someone from a different culture declines to shake your hand. What is the best response?",
    options: [
      "Respect it, greet them another way, and stay curious",
      "Insist on the handshake",
      "Assume they are being rude",
      "Avoid them afterwards"
    ], scores: [1, 0, 0, 0] },

  { category: "Empathy", difficulty: 3,
    text: "A team member missed a deadline because a family member is ill. What is the best response?",
    options: [
      "Express concern, ask how you can help, and re-plan the work",
      "Mark them down for missing it",
      "Ask for proof of the illness",
      "Say that everyone has problems"
    ], scores: [1, 0, 0, 0] },

  { category: "Empathy", difficulty: 1,
    text: "A young child is crying because their ice cream fell on the ground. What is the best response?",
    options: [
      "Acknowledge their disappointment, then help",
      "Tell them to stop, it is only ice cream",
      "Buy another one immediately without a word",
      "Ignore the crying"
    ], scores: [1, 0, 0.5, 0] },

  { category: "Empathy", difficulty: 3,
    text: "You disagree with someone and they become visibly upset. What is the best response?",
    options: [
      "Pause, acknowledge their feelings, and then return to the topic calmly",
      "Keep arguing your point",
      "Leave the conversation",
      "Make a joke at their expense"
    ], scores: [1, 0, 0.25, 0] },

  { category: "Empathy", difficulty: 2,
    text: "A friend fails an exam they studied hard for. What do you say?",
    options: [
      "\"That's really tough. How are you feeling?\"",
      "\"I told you to study differently.\"",
      "\"It's not that important.\"",
      "\"Here are ten study tips.\""
    ], scores: [1, 0, 0.25, 0.25] },

  // ---------- RELATIONSHIP MANAGEMENT ----------
  { category: "Relationship Management", difficulty: 1,
    text: "You and a colleague clash over who does which tasks. What is the best first step?",
    options: [
      "Talk privately, describe the issue calmly, and listen to their view",
      "Complain to other colleagues",
      "Avoid them",
      "Escalate to your manager straight away"
    ], scores: [1, 0, 0.1, 0.25] },

  { category: "Relationship Management", difficulty: 1,
    text: "You need to give a teammate negative feedback. What is the best approach?",
    options: [
      "Be specific, kind, and focus on behaviour and next steps",
      "Be harsh so they take it seriously",
      "Avoid saying anything",
      "Post it in the team chat"
    ], scores: [1, 0, 0, 0] },

  { category: "Relationship Management", difficulty: 2,
    text: "Your team seems demotivated. What is the best step?",
    options: [
      "Ask what is behind it, listen, and act on what you can",
      "Add more pressure",
      "Ignore it",
      "Blame the team in the next meeting"
    ], scores: [1, 0, 0, 0] },

  { category: "Relationship Management", difficulty: 2,
    text: "Two friends in a quarrel both ask you to take their side. What is the best response?",
    options: [
      "Stay neutral and encourage them to talk to each other",
      "Side with the friend you are closer to",
      "Tell each one what they want to hear",
      "Refuse to speak to either of them"
    ], scores: [1, 0.25, 0, 0.25] },

  { category: "Relationship Management", difficulty: 2,
    text: "A client is angry about a delay. What is the best response?",
    options: [
      "Acknowledge their frustration, apologise for the impact, and explain the plan",
      "Explain why it isn't your fault",
      "Promise whatever they ask",
      "End the call"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Relationship Management", difficulty: 3,
    text: "A teammate presents your work as their own in a meeting. What is the best follow-up?",
    options: [
      "Speak with them privately, state the facts, and ask for accurate credit going forward",
      "Say nothing",
      "Gossip about it",
      "Take credit for their next piece of work"
    ], scores: [1, 0.1, 0, 0] },

  { category: "Relationship Management", difficulty: 1,
    text: "You need help from a busy colleague. What is the best way to ask?",
    options: [
      "Ask clearly, respect their time, and offer something in return",
      "Demand it, since it is urgent",
      "Hint and hope they notice",
      "Do it badly yourself rather than ask"
    ], scores: [1, 0, 0.25, 0.25] },

  { category: "Relationship Management", difficulty: 2,
    text: "One loud voice dominates your team meeting. What is the best move as a participant?",
    options: [
      "Invite quieter people in by name and suggest turn-taking",
      "Let it happen",
      "Talk over them",
      "Skip future meetings"
    ], scores: [1, 0.1, 0, 0] },

  { category: "Relationship Management", difficulty: 2,
    text: "A friend often cancels plans at the last minute. What is the best response?",
    options: [
      "Tell them how it affects you and ask what is going on",
      "Cancel on them in return",
      "Give them the silent treatment",
      "Pretend it doesn't bother you"
    ], scores: [1, 0, 0, 0.25] },

  { category: "Relationship Management", difficulty: 3,
    text: "You disagree with your boss's plan. What is the best approach?",
    options: [
      "Raise concerns respectfully with evidence and alternatives, then commit to the decision",
      "Complain to colleagues",
      "Quietly undermine the plan",
      "Say nothing and sulk"
    ], scores: [1, 0, 0, 0.25] },
];

// ============================================================
// DECISION-MAKING (Risk Assessment, Logic, Judgment)
// Risk Assessment and Logic have one correct answer; Judgment uses partial credit.
// ============================================================
const DECISION_MAKING_QUESTIONS = [

  // ---------- RISK ASSESSMENT ----------
  { category: "Risk Assessment", difficulty: 1,
    text: "Option A: a guaranteed £50. Option B: a 50% chance of £120 and a 50% chance of £0. Which has the higher expected value?",
    options: ["Option A", "Option B", "They are equal", "Cannot be computed"], answer: 1 },

  { category: "Risk Assessment", difficulty: 1,
    text: "Which is riskier: an investment whose outcomes range from −10% to +12%, or one ranging from −60% to +90%?",
    options: ["The first", "The second", "They are equally risky", "Cannot be told"], answer: 1 },

  { category: "Risk Assessment", difficulty: 2,
    text: "You pay £10 to roll a die and win £30 if it lands on 6, otherwise nothing. What is your expected net result per play?",
    options: ["−£5", "£0", "+£5", "+£20"], answer: 0 },

  { category: "Risk Assessment", difficulty: 2,
    text: "Insurance covers a 1-in-200 chance of a £10,000 loss each year. What is the expected annual loss without insurance?",
    options: ["£50", "£100", "£200", "£10,000"], answer: 0 },

  { category: "Risk Assessment", difficulty: 2,
    text: "A game costs £80 to play and gives a 20% chance of winning £500. What is the expected net result per play?",
    options: ["+£20", "−£20", "+£420", "£0"], answer: 0 },

  { category: "Risk Assessment", difficulty: 2,
    text: "A fair coin has landed heads 5 times in a row. What is the chance of heads on the next flip?",
    options: ["Less than 50%", "Exactly 50%", "More than 50%", "It must be tails"], answer: 1 },

  { category: "Risk Assessment", difficulty: 3,
    text: "A bet gives a 90% chance to win £10 and a 10% chance to lose £100. On expected value alone, should you take it?",
    options: [
      "No: the expected value is −£1",
      "Yes: the expected value is +£9",
      "Yes: the expected value is +£1",
      "It makes no difference: the expected value is £0"
    ], answer: 0 },

  { category: "Risk Assessment", difficulty: 3,
    text: "Two switches each work 90% of the time, independently, and both must work for a machine to run. What is the chance the machine runs?",
    options: ["90%", "81%", "99%", "100%"], answer: 1 },

  { category: "Risk Assessment", difficulty: 3,
    text: "A disease affects 1 in 1,000 people. A test is 99% accurate for both sick and healthy people. You test positive. Roughly how likely is it that you have the disease?",
    options: ["About 99%", "About 50%", "About 9%", "About 1%"], answer: 2 },

  { category: "Risk Assessment", difficulty: 3,
    text: "Which is more probable? (a) Linda is a bank teller. (b) Linda is a bank teller and active in the feminist movement.",
    options: ["(a)", "(b)", "They are equally probable", "Cannot be told"], answer: 0 },

  // ---------- LOGIC ----------
  { category: "Logic", difficulty: 1,
    text: "Option X has a 3-in-10 chance of success. Option Y has a 2-in-5 chance. Which is more likely to succeed?",
    options: ["Option X", "Option Y", "They are equal", "Cannot be told"], answer: 1 },

  { category: "Logic", difficulty: 1,
    text: "You only look for evidence that supports what you already believe. What is this bias called?",
    options: ["Confirmation bias", "Hindsight bias", "Availability heuristic", "Survivorship bias"], answer: 0 },

  { category: "Logic", difficulty: 1,
    text: "A jacket was £200 and is now £120 at Store A. Store B always sells the same jacket for £130. Which is cheaper?",
    options: ["Store A", "Store B", "They are equal", "Cannot be told"], answer: 0 },

  { category: "Logic", difficulty: 2,
    text: "A bat and a ball cost £1.10 together. The bat costs £1.00 more than the ball. How much does the ball cost?",
    options: ["10p", "5p", "1p", "15p"], answer: 1 },

  { category: "Logic", difficulty: 2,
    text: "You paid £50 for a non-refundable concert ticket but are now ill and would rather stay home. What does sound reasoning say about the £50?",
    options: [
      "It is a sunk cost and shouldn't drive the decision",
      "You must go so the money isn't wasted",
      "It proves you should have bought a refundable ticket",
      "It should be doubled to reflect the lost enjoyment"
    ], answer: 0 },

  { category: "Logic", difficulty: 2,
    text: "Shark attacks make headlines, so people fear sharks more than cars, though cars are far deadlier. Which bias is this?",
    options: ["Availability heuristic", "Anchoring", "Halo effect", "Sunk cost"], answer: 0 },

  { category: "Logic", difficulty: 2,
    text: "A seller shows a £1,000 watch first, and then a £300 watch feels cheap. Which bias is at work?",
    options: ["Anchoring", "Framing", "Endowment effect", "Bandwagon effect"], answer: 0 },

  { category: "Logic", difficulty: 3,
    text: "A surgery is described as \"90% survive\" to one group and \"10% die\" to another. The groups decide differently. This is:",
    options: ["The framing effect", "The gambler's fallacy", "Regression to the mean", "The halo effect"], answer: 0 },

  { category: "Logic", difficulty: 3,
    text: "Successful start-ups are praised for habits like working through the night. What is the flaw in copying those habits?",
    options: [
      "Survivorship bias: failed firms with the same habits are not visible",
      "There is no flaw",
      "The press is biased against start-ups",
      "Successful start-ups are too large to copy"
    ], answer: 0 },

  { category: "Logic", difficulty: 3,
    text: "Four cards show E, K, 4 and 7. Each has a letter on one side and a number on the other. To test \"every card with a vowel has an even number on the other side\", which cards must you flip?",
    options: ["E and 7", "E and 4", "K and 4", "All four"], answer: 0 },

  // ---------- JUDGMENT (scored) ----------
  { category: "Judgment", difficulty: 1,
    text: "You must decide quickly with incomplete information, and the decision is easy to undo. What is the best approach?",
    options: [
      "Make the best call you can and adjust as you learn more",
      "Wait until you have complete information",
      "Flip a coin without thinking",
      "Let someone else decide"
    ], scores: [1, 0.25, 0.25, 0.1] },

  { category: "Judgment", difficulty: 1,
    text: "You need to choose between three suppliers. What is the best way to start?",
    options: [
      "List the criteria that matter and score each supplier against them",
      "Pick the first one you find",
      "Pick the cheapest whatever the quality",
      "Pick the one with the fanciest website"
    ], scores: [1, 0, 0.25, 0] },

  { category: "Judgment", difficulty: 2,
    text: "The decision is hard to reverse and your information is thin. What is the best approach?",
    options: [
      "Slow down, gather what you can, and test on a small scale first if possible",
      "Decide fast to avoid stress",
      "Delay indefinitely",
      "Copy what others did"
    ], scores: [1, 0, 0.25, 0.1] },

  { category: "Judgment", difficulty: 2,
    text: "Two experts give you opposite advice. What is the best response?",
    options: [
      "Ask each for their reasoning and evidence, then weigh it",
      "Follow the more senior expert",
      "Choose the cheaper option",
      "Ignore both"
    ], scores: [1, 0.25, 0, 0] },

  { category: "Judgment", difficulty: 2,
    text: "A small risk could wreck an otherwise promising project. What is the best response?",
    options: [
      "Assess the likelihood and impact, then reduce or insure against it",
      "Ignore it",
      "Cancel the project",
      "Hope it doesn't happen"
    ], scores: [1, 0, 0.25, 0] },

  { category: "Judgment", difficulty: 2,
    text: "After a bad decision in the past you hesitate over a similar one. What is the best response?",
    options: [
      "Review what went wrong, apply the lessons, and decide on today's facts",
      "Avoid similar decisions altogether",
      "Repeat exactly what you did before",
      "Ignore the past completely"
    ], scores: [1, 0, 0.25, 0.25] },

  { category: "Judgment", difficulty: 2,
    text: "A tempting offer expires today and you feel pressured. What is the best response?",
    options: [
      "Slow down, check the terms and alternatives, and be willing to let it pass",
      "Accept to avoid regret",
      "Decline automatically",
      "Ask one friend and follow their answer blindly"
    ], scores: [1, 0, 0.25, 0.25] },

  { category: "Judgment", difficulty: 3,
    text: "Your gut says one thing but the data points the other way. What is the best approach?",
    options: [
      "Treat the gut feeling as a hypothesis, check it against the data, then decide",
      "Follow your gut",
      "Ignore your gut completely",
      "Ask friends and go with the majority"
    ], scores: [1, 0.25, 0.25, 0.1] },

  { category: "Judgment", difficulty: 3,
    text: "A decision affects several groups with competing interests. What is the best approach?",
    options: [
      "Identify each group's key interests, look for options that meet the most important ones, and explain your reasoning",
      "Pick whatever the loudest group wants",
      "Pick whatever the largest group wants",
      "Avoid deciding"
    ], scores: [1, 0, 0.25, 0] },

  { category: "Judgment", difficulty: 3,
    text: "The deadline is tomorrow and new information suggests your plan may be flawed. What is the best response?",
    options: [
      "Quickly test how serious the flaw is, then adjust the plan or warn stakeholders early",
      "Ignore the information",
      "Miss the deadline without telling anyone",
      "Blame the data"
    ], scores: [1, 0, 0, 0] },
];

// ============================================================
// PROCESSING SPEED (Perceptual Speed, Quick Decisions, Rapid Processing); timed
// ============================================================
const PROCESSING_SPEED_QUESTIONS = [

  // ---------- PERCEPTUAL SPEED ----------
  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "DOG   DOG",
    options: ["Same", "Different"], answer: 0 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "4821   4812",
    options: ["Same", "Different"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "ABCDE   ABCDE",
    options: ["Same", "Different"], answer: 0 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "7305   7305",
    options: ["Same", "Different"], answer: 0 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "QWERTY   QWERTZ",
    options: ["Same", "Different"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "Same or different?",
    visual: "90210   90201",
    options: ["Same", "Different"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 1,
    text: "At which position is the letter X?",
    visual: "ABXDEF",
    options: ["2", "3", "5", "6"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 2,
    text: "Which one is different?",
    visual: "■  ■  □  ■",
    options: ["1st", "2nd", "3rd", "4th"], answer: 2 },

  { category: "Perceptual Speed", difficulty: 2,
    text: "How many As are there?",
    visual: "AABBAABBAA",
    options: ["4", "5", "6", "7"], answer: 2 },

  { category: "Perceptual Speed", difficulty: 2,
    text: "At which position does the sequence ABC start?",
    visual: "XYZABC",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 2,
    text: "How many 7s are there?",
    visual: "7 1 7 7 2 7",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 2,
    text: "Which string is different?",
    visual: "bcdb   bcdb   bcbd   bcdb",
    options: ["1st", "2nd", "3rd", "4th"], answer: 2 },

  { category: "Perceptual Speed", difficulty: 3,
    text: "How many letters I are there?",
    visual: "MISSISSIPPI",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 3,
    text: "How many letters differ between these two words?",
    visual: "CASTLE   CANTLE",
    options: ["0", "1", "2", "3"], answer: 1 },

  { category: "Perceptual Speed", difficulty: 3,
    text: "Which pair of numbers is identical?",
    visual: "3947 / 3974     5216 / 5216     8830 / 8803",
    options: ["First pair", "Second pair", "Third pair", "None"], answer: 1 },

  // ---------- QUICK DECISIONS ----------
  { category: "Quick Decisions", difficulty: 1,
    text: "A red traffic light means:",
    options: ["Go", "Slow down", "Stop", "Turn left"], answer: 2 },

  { category: "Quick Decisions", difficulty: 1,
    text: "What is the opposite of hot?",
    options: ["Warm", "Cold", "Cool", "Boiling"], answer: 1 },

  { category: "Quick Decisions", difficulty: 1,
    text: "Which of these is a fruit?",
    options: ["Apple", "Carrot", "Bread", "Rice"], answer: 0 },

  { category: "Quick Decisions", difficulty: 1,
    text: "How many days are in a week?",
    options: ["5", "6", "7", "8"], answer: 2 },

  { category: "Quick Decisions", difficulty: 1,
    text: "Which of these is a colour?",
    options: ["Purple", "Table", "Run", "Slowly"], answer: 0 },

  { category: "Quick Decisions", difficulty: 1,
    text: "Which day comes after Tuesday?",
    options: ["Monday", "Wednesday", "Thursday", "Sunday"], answer: 1 },

  { category: "Quick Decisions", difficulty: 2,
    text: "Which is larger: 9 or 12?",
    options: ["9", "12", "They are equal", "Cannot tell"], answer: 1 },

  { category: "Quick Decisions", difficulty: 2,
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"], answer: 1 },

  { category: "Quick Decisions", difficulty: 2,
    text: "Is 17 odd or even?",
    options: ["Odd", "Even", "Both", "Neither"], answer: 0 },

  { category: "Quick Decisions", difficulty: 2,
    text: "Which is the odd one out?",
    options: ["Cat", "Dog", "Car", "Horse"], answer: 2 },

  { category: "Quick Decisions", difficulty: 2,
    text: "Which is larger: 0.5 or 0.25?",
    options: ["0.5", "0.25", "They are equal", "Cannot tell"], answer: 0 },

  { category: "Quick Decisions", difficulty: 2,
    text: "What comes next?",
    visual: "A  E  I  O  ?",
    options: ["P", "U", "T", "Y"], answer: 1 },

  { category: "Quick Decisions", difficulty: 3,
    text: "Which of these is a real English word?",
    options: ["BLARP", "TABLE", "GLENT", "FROBE"], answer: 1 },

  { category: "Quick Decisions", difficulty: 3,
    text: "Which word is spelled correctly?",
    options: ["Recieve", "Receive", "Recieeve", "Receeve"], answer: 1 },

  { category: "Quick Decisions", difficulty: 3,
    text: "Which is the heaviest?",
    options: ["A mouse", "A cat", "An elephant", "A rabbit"], answer: 2 },

  // ---------- RAPID PROCESSING ----------
  { category: "Rapid Processing", difficulty: 1,
    text: "5 + 3 = ?",
    options: ["7", "8", "9", "10"], answer: 1 },

  { category: "Rapid Processing", difficulty: 1,
    text: "10 − 2 = ?",
    options: ["6", "8", "12", "5"], answer: 1 },

  { category: "Rapid Processing", difficulty: 1,
    text: "8 + 4 = ?",
    options: ["10", "12", "14", "16"], answer: 1 },

  { category: "Rapid Processing", difficulty: 1,
    text: "7 + 2 = ?",
    options: ["8", "9", "10", "11"], answer: 1 },

  { category: "Rapid Processing", difficulty: 1,
    text: "2 × 5 = ?",
    options: ["8", "10", "12", "15"], answer: 1 },

  { category: "Rapid Processing", difficulty: 1,
    text: "15 − 5 = ?",
    options: ["8", "10", "12", "14"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "12 ÷ 3 = ?",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "20 ÷ 5 = ?",
    options: ["3", "4", "5", "6"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "6 × 2 = ?",
    options: ["10", "12", "14", "16"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "25 − 10 = ?",
    options: ["10", "15", "20", "25"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "9 × 2 = ?",
    options: ["16", "18", "20", "22"], answer: 1 },

  { category: "Rapid Processing", difficulty: 2,
    text: "30 − 15 = ?",
    options: ["10", "15", "20", "25"], answer: 1 },

  { category: "Rapid Processing", difficulty: 3,
    text: "3 × 7 = ?",
    options: ["18", "20", "21", "24"], answer: 2 },

  { category: "Rapid Processing", difficulty: 3,
    text: "100 ÷ 4 = ?",
    options: ["20", "25", "30", "35"], answer: 1 },

  { category: "Rapid Processing", difficulty: 3,
    text: "11 × 11 = ?",
    options: ["100", "110", "121", "130"], answer: 2 },
];

// Question banks by test id (keys must match the ids in tests.js).
const QUESTION_BANKS = {
  "iq": IQ_QUESTIONS,
  "memory": MEMORY_QUESTIONS,
  "critical-thinking": CRITICAL_THINKING_QUESTIONS,
  "learning": LEARNING_QUESTIONS,
  "creativity": CREATIVITY_QUESTIONS,
  "problem-solving": PROBLEM_SOLVING_QUESTIONS,
  "attention": ATTENTION_QUESTIONS,
  "emotional": EMOTIONAL_QUESTIONS,
  "decision-making": DECISION_MAKING_QUESTIONS,
  "processing-speed": PROCESSING_SPEED_QUESTIONS,
};
