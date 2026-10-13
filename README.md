# Intelligence Test Platform

A static, client-side platform with 10 self-assessment cognitive tests. No accounts, no backend, no data leaves the browser.

## Run it

Open `index.html` in a browser, or serve the folder:

```
npm start        # same as: npx serve -l 8080
```

`.vscode/launch.json` opens Chrome at `http://localhost:8080`, so start the server with the command above before using that launch configuration.

## The tests

| Test | Questions | Time | What it measures | Scoring |
| --- | --- | --- | --- | --- |
| **Intelligence (IQ)** | 30 | 20 min | Logical, numerical, verbal and spatial reasoning | Estimated IQ, with an *estimated* percentile |
| **Memory** | 15 | 8 min | Short-term, working and visual memory. Each item is shown for a few seconds, then hidden before the question | Percentage |
| **Critical Thinking** | 20 | 15 min | Analysing arguments, drawing inferences, evaluating evidence | Percentage |
| **Learning Ability** | 20 | 12 min | Learning a rule from the question, then applying it | Percentage |
| **Creativity** | 15 | 10 min | Word-association puzzles plus originality-graded questions | Percentage, partial credit on graded items |
| **Problem-Solving Ability** | 18 | 14 min | Diagnosing problems, generating solutions, checking them | Percentage |
| **Attention and Focus** | 20 | 10 min | Counting, scanning and filtering | Percentage; accuracy plus speed |
| **Emotional Intelligence** | 20 | 14 min | Scenario responses on self-awareness, empathy and relationships | Percentage, partial credit |
| **Decision-Making** | 20 | 13 min | Expected value, decision biases and judgment scenarios | Percentage, partial credit on judgment items |
| **Processing Speed** | 30 | 5 min | Quick comparisons and arithmetic, each answer timed | Percentage; accuracy plus speed |

Each run draws a random, category-balanced set from a larger bank (at least 1.5x the number asked), so repeat attempts differ.

### Scoring

- Questions are weighted by difficulty (1, 1.5 or 2).
- **Scenario items** (Emotional Intelligence, Decision-Making judgment, Creativity) give full credit for the best option and partial credit for defensible ones.
- **Speed tests** (Attention, Processing Speed) award 60% of an item's points for a correct answer and up to 40% for answering within a target time, which grows with difficulty.
- **Only the IQ test shows a percentile**, and it is an estimate that assumes scores follow a normal distribution with an invented mean and spread (`norm` in `tests.js`). There is no participant data behind it. The other tests report a percentage score only.

### Taking a test

- Tests with free navigation (IQ, Critical Thinking, Learning, Creativity, Problem-Solving, Emotional Intelligence, Decision-Making) have a **Previous** button and a question map for jumping to skipped questions. Finishing with unanswered questions asks for confirmation.
- Memory, Attention and Processing Speed run forward only, since items are timed or shown once.
- Enter or Space on an option selects it; press **Next** to continue.
- Progress is saved in `localStorage`. After a refresh, or after leaving via the back button, **Resume** on the home screen restores the test. The clock keeps running while you are away.
- The results screen has a **Review your answers** section showing what you chose and the correct answer.
- Your last scores for each test are kept in this browser and shown on the test's start screen. Use **Clear history** to remove them.
- A toggle in the top-right corner switches between dark (default) and light themes.

## Project layout

- `index.html`: markup for the home, info, test and results screens.
- `tests.js`: test definitions (`TESTS`, keyed by id): question count, time limit, categories, scoring options.
- `questions.js`: the question banks, exposed as `QUESTION_BANKS[testId]`. The format is documented at the top of the file.
- `script.js`: test flow, timer, scoring, saved progress, history, theme.
- `style.css`: styling for both themes.
- `scripts/check.js`: validation script (below).

## Checking the content

```
npm run check    # or: node scripts/check.js
```

The script verifies that every test id matches its key and has a bank, that each bank is large enough (overall and per category), that categories match `tests.js`, that every answer index and score list is valid, that options are unique, that each element `script.js` looks up exists in `index.html`, and that this README mentions all tests. It cannot tell whether an answer is *correct*, so review keys by hand when you add questions.

### Adding questions

Add an entry to the right array in `questions.js`. Options are shuffled at run time, so the position of the correct option doesn't matter. Run the check afterwards.

## Disclaimer

This is an entertainment / self-assessment tool, not a clinically validated psychometric instrument. It should not be used for diagnosis, employment, education, or any official decision.
