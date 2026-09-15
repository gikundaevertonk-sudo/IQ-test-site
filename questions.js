// Question bank for the IQ test.
// category: "logical" | "numerical" | "verbal" | "spatial"
// difficulty: 1 (easy) - 3 (hard), used to weight scoring
// visual (optional): HTML snippet rendered above the options (for spatial/pattern items)

const QUESTION_BANK = [

  // ---------- NUMERICAL ----------
  { category: "numerical", difficulty: 1,
    text: "What number comes next in the sequence? 2, 4, 6, 8, ?",
    options: ["9", "10", "12", "16"], answer: 1 },

  { category: "numerical", difficulty: 1,
    text: "What number comes next? 1, 3, 5, 7, 9, ?",
    options: ["10", "11", "13", "12"], answer: 1 },

  { category: "numerical", difficulty: 2,
    text: "What number comes next? 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "30"], answer: 2 },

  { category: "numerical", difficulty: 2,
    text: "Find the missing number: 5, 10, 20, 40, ?, 160",
    options: ["60", "70", "80", "100"], answer: 2 },

  { category: "numerical", difficulty: 2,
    text: "What number comes next? 1, 4, 9, 16, 25, ?",
    options: ["30", "36", "35", "49"], answer: 1 },

  { category: "numerical", difficulty: 3,
    text: "What number comes next? 2, 3, 5, 8, 13, ?",
    options: ["18", "20", "21", "24"], answer: 2 },

  { category: "numerical", difficulty: 3,
    text: "Find the missing number: 7, 14, 28, 56, ?",
    options: ["84", "98", "112", "102"], answer: 2 },

  { category: "numerical", difficulty: 3,
    text: "What number comes next? 100, 95, 85, 70, 50, ?",
    options: ["20", "25", "30", "35"], answer: 1 },

  // ---------- LOGICAL ----------
  { category: "logical", difficulty: 1,
    text: "All cats are animals. Some animals are pets. Which statement must be true?",
    options: [
      "All cats are pets",
      "Some cats might be pets",
      "No cats are pets",
      "All pets are cats"
    ], answer: 1 },

  { category: "logical", difficulty: 1,
    text: "If today is Monday, what day will it be in 10 days?",
    options: ["Wednesday", "Thursday", "Friday", "Saturday"], answer: 1 },

  { category: "logical", difficulty: 2,
    text: "Sarah is taller than Mia. Mia is taller than Ken. Who is the shortest?",
    options: ["Sarah", "Mia", "Ken", "Cannot be determined"], answer: 2 },

  { category: "logical", difficulty: 2,
    text: "A is the brother of B. B is the sister of C. What is A to C?",
    options: ["Sister", "Brother", "Cousin", "Cannot be determined"], answer: 1 },

  { category: "logical", difficulty: 2,
    text: "If some Bloops are Razzies and all Razzies are Lazzies, which must be true?",
    options: [
      "All Bloops are Lazzies",
      "Some Bloops are Lazzies",
      "No Bloops are Lazzies",
      "All Lazzies are Bloops"
    ], answer: 1 },

  { category: "logical", difficulty: 3,
    text: "Five friends sit in a row. Alex sits left of Ben. Ben sits left of Cara. Cara sits left of Dan. Dan sits left of Eve. Who sits in the middle?",
    options: ["Alex", "Ben", "Cara", "Dan"], answer: 2 },

  { category: "logical", difficulty: 3,
    text: "If it is true that \"No engineers dislike puzzles\" and \"Tom dislikes puzzles\", what must be true?",
    options: [
      "Tom is an engineer",
      "Tom is not an engineer",
      "All engineers like Tom",
      "Cannot be determined"
    ], answer: 1 },

  // ---------- VERBAL ----------
  { category: "verbal", difficulty: 1,
    text: "Hot is to Cold as Up is to ___",
    options: ["Down", "Sideways", "High", "Top"], answer: 0 },

  { category: "verbal", difficulty: 1,
    text: "Book is to Read as Song is to ___",
    options: ["Sing", "Listen", "Write", "Play"], answer: 1 },

  { category: "verbal", difficulty: 2,
    text: "Which word does not belong with the others?",
    options: ["Apple", "Banana", "Carrot", "Grape"], answer: 2 },

  { category: "verbal", difficulty: 2,
    text: "Doctor is to Hospital as Teacher is to ___",
    options: ["Student", "Book", "School", "Lesson"], answer: 2 },

  { category: "verbal", difficulty: 2,
    text: "Which word means the opposite of 'Abundant'?",
    options: ["Plentiful", "Scarce", "Massive", "Generous"], answer: 1 },

  { category: "verbal", difficulty: 3,
    text: "Which word is most nearly opposite to 'Meticulous'?",
    options: ["Careful", "Careless", "Curious", "Cautious"], answer: 1 },

  { category: "verbal", difficulty: 3,
    text: "PENSIVE is to THOUGHTFUL as JUBILANT is to ___",
    options: ["Sad", "Joyful", "Angry", "Calm"], answer: 1 },

  { category: "verbal", difficulty: 3,
    text: "Which word does not belong with the others?",
    options: ["Whisper", "Murmur", "Shout", "Mutter"], answer: 2 },

  // ---------- SPATIAL / PATTERN ----------
  { category: "spatial", difficulty: 1,
    text: "Which shape comes next in the pattern?",
    visual: "🔵 🔴 🔵 🔴 🔵 ?",
    options: ["🔵", "🔴", "🟡", "🟢"], answer: 1 },

  { category: "spatial", difficulty: 1,
    text: "Which shape comes next in the pattern?",
    visual: "⬛ ⬜ ⬛ ⬜ ⬛ ?",
    options: ["⬛", "⬜", "🔺", "🔵"], answer: 1 },

  { category: "spatial", difficulty: 2,
    text: "Which shape comes next in the pattern?",
    visual: "🔺 🔺 🔻 🔺 🔺 🔻 🔺 🔺 ?",
    options: ["🔺", "🔻", "🔵", "⬛"], answer: 1 },

  { category: "spatial", difficulty: 2,
    text: "Which figure completes the sequence?",
    visual: "◻️ ◼️ ◻️◻️ ◼️◼️ ◻️◻️◻️ ◼️◼️◼️ ?",
    options: ["◻️◻️◻️◻️", "◼️◼️◼️◼️", "◻️", "◼️"], answer: 0 },

  { category: "spatial", difficulty: 2,
    text: "Which shape does not belong with the others?",
    visual: "🔷 🔷 🔶 🔷 🔷",
    options: ["1st", "3rd", "4th", "5th"], answer: 1 },

  { category: "spatial", difficulty: 3,
    text: "A cube is painted red on all sides, then cut into 27 equal smaller cubes. How many small cubes have exactly 2 red faces?",
    options: ["8", "12", "6", "24"], answer: 1 },

  { category: "spatial", difficulty: 3,
    text: "Which shape comes next in the pattern?",
    visual: "🔺 🔵🔵 🔺🔺🔺 🔵🔵🔵🔵 🔺🔺🔺🔺🔺 ?",
    options: ["🔵×6", "🔺×6", "🔵×5", "🔺×5"], answer: 0 },

];
